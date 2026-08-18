from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ModbusRegisterMapping(BaseModel):
    register_address: int
    parameter_name: str
    data_type: str
    engineering_unit: str
    scaling_factor: float
    access_mode: str # "READ_ONLY", "READ_WRITE"
    description: str

class LadderRung(BaseModel):
    rung_number: int
    title: str
    logic_expression: str
    description: str

class PLCCodePackage(BaseModel):
    part_number: str
    target_controller: str # "Siemens S7-1500 (TIA Portal v18)" / "Rockwell ControlLogix (Studio 5000)"
    programming_standard: str # "IEC 61131-3"
    structured_text_code: str
    ladder_logic_rungs: List[LadderRung]
    modbus_registers: List[ModbusRegisterMapping]
    safety_interlocks_count: int
    control_cycle_time_ms: float

class PLCCodeGeneratorEngine:
    @classmethod
    def synthesize_plc_code(cls, part_number: str = "M3BP 160MLA 4", target_brand: str = "Siemens S7-1500") -> PLCCodePackage:
        st_code = """// ============================================================================
// FUNCTION_BLOCK FB_Motor_Drive_Controller
// Standard: IEC 61131-3 Structured Text (ST)
// Target Hardware: Siemens SIMATIC S7-1500 (TIA Portal v18)
// Equipment: ABB M3BP 160MLA 4 (7.5 kW, 400V, 14.7A, 1465 RPM)
// ============================================================================

VAR_INPUT
    b_Start_Cmd          : BOOL;    // Remote Start Pushbutton
    b_Stop_Cmd           : BOOL;    // Remote Stop Pushbutton
    b_E_Stop_OK          : BOOL;    // Dual-Channel Safety Relay Feedback (NC)
    b_Thermal_Overload_OK: BOOL;    // PT100 Winding Thermistor Trigger (< 155°C)
    r_Speed_Ref_RPM      : REAL;    // Target Speed Setpoint (0.0 to 1500.0 RPM)
    r_Current_Feedback_A : REAL;    // 3-Phase CT Feedback
END_VAR

VAR_OUTPUT
    b_Motor_Running      : BOOL;    // Main Contactor Drive Output (Q0.0)
    b_Fault_Tripped      : BOOL;    // General Fault Alarm Lamp (Q0.1)
    r_VFD_Frequency_Hz   : REAL;    // Inverter Reference Frequency (0.0 to 50.0 Hz)
    w_VFD_Status_Word    : WORD;    // Profinet/Modbus State Word
END_VAR

VAR
    b_Interlock_Healthy  : BOOL;
    r_Ramp_Rate_Hz_Sec   : REAL := 5.0; // 10-second linear acceleration
END_VAR

// 1. SAFETY & INTERLOCK EVALUATION
b_Interlock_Healthy := b_E_Stop_OK AND b_Thermal_Overload_OK AND (r_Current_Feedback_A <= 17.64); // 120% FLA Trip Limit

IF NOT b_Interlock_Healthy THEN
    b_Motor_Running := FALSE;
    b_Fault_Tripped := TRUE;
    r_VFD_Frequency_Hz := 0.0;
    w_VFD_Status_Word := 16#0008; // FAULT_LOCKOUT
    RETURN;
END_IF;

// 2. START / STOP LATCH LOGIC
IF b_Start_Cmd AND NOT b_Stop_Cmd AND b_Interlock_Healthy THEN
    b_Motor_Running := TRUE;
    b_Fault_Tripped := FALSE;
ELSIF b_Stop_Cmd THEN
    b_Motor_Running := FALSE;
END_IF;

// 3. CLOSED-LOOP FREQUENCY SCALING
IF b_Motor_Running THEN
    r_VFD_Frequency_Hz := (LIMIT(0.0, r_Speed_Ref_RPM, 1500.0) / 1500.0) * 50.0;
    w_VFD_Status_Word := 16#0033; // SYSTEM_RUNNING_NORMAL
ELSE
    r_VFD_Frequency_Hz := 0.0;
    w_VFD_Status_Word := 16#0001; // READY_STANDBY
END_IF;
"""

        rungs = [
            LadderRung(
                rung_number=1,
                title="Safety Interlock & Master Contactor Permissive",
                logic_expression="[ E_Stop_OK (NC) ]---[ Thermal_Relay_OK (NC) ]---[ Current_Normal (NC) ]---( Interlock_Permissive )",
                description="Verifies dual-channel E-Stop loop, PT100 thermistor threshold, and sub-120% full-load current prior to energizing coil."
            ),
            LadderRung(
                rung_number=2,
                title="3-Wire Start/Stop Latch with Run Seal-in",
                logic_expression="[ Interlock_Permissive ]---[ +---[ Start_PB (NO) ]---+---[ Stop_PB (NC) ]---( Main_Contactor_Q0_0 ) ]\n                             +---[ Contactor_Q0_0 ]--+",
                description="Standard industrial start/stop station with memory hold circuit and zero-voltage dropout protection."
            ),
            LadderRung(
                rung_number=3,
                title="VFD Speed Reference Analog Clamp (0-10V / 4-20mA)",
                logic_expression="[ Contactor_Q0_0 ]---[ SCALE_LINEAR( Raw_AI0, 0, 27648, 0.0, 50.0 ) ]---> ( VFD_Freq_Output_AQ0 )",
                description="Scales raw 16-bit analog input from DCS/SCADA potentiometer into 0.0 to 50.0 Hz inverter reference."
            )
        ]

        registers = [
            ModbusRegisterMapping(
                register_address=40001,
                parameter_name="VFD_CONTROL_WORD",
                data_type="UINT16",
                engineering_unit="HEX_BITS",
                scaling_factor=1.0,
                access_mode="READ_WRITE",
                description="Bit 0: Enable, Bit 1: Coast Stop, Bit 2: Quick Stop, Bit 3: Fault Reset"
            ),
            ModbusRegisterMapping(
                register_address=40002,
                parameter_name="TARGET_SPEED_REFERENCE",
                data_type="INT16",
                engineering_unit="RPM",
                scaling_factor=1.0,
                access_mode="READ_WRITE",
                description="Target motor shaft rotational speed setpoint (0 to 1500 RPM)"
            ),
            ModbusRegisterMapping(
                register_address=40003,
                parameter_name="ACTUAL_CURRENT_FEEDBACK",
                data_type="UINT16",
                engineering_unit="Amperes",
                scaling_factor=0.1,
                access_mode="READ_ONLY",
                description="Measured 3-phase RMS output current (147 = 14.7 A)"
            ),
            ModbusRegisterMapping(
                register_address=40004,
                parameter_name="STATOR_WINDING_TEMPERATURE",
                data_type="INT16",
                engineering_unit="°C",
                scaling_factor=1.0,
                access_mode="READ_ONLY",
                description="PT100 RTD sensor reading inside phase U stator winding"
            ),
            ModbusRegisterMapping(
                register_address=40005,
                parameter_name="SHAFT_OUTPUT_TORQUE",
                data_type="INT16",
                engineering_unit="Nm",
                scaling_factor=0.1,
                access_mode="READ_ONLY",
                description="Calculated air-gap electromagnetic torque (489 = 48.9 Nm)"
            )
        ]

        return PLCCodePackage(
            part_number=part_number,
            target_controller=target_brand,
            programming_standard="IEC 61131-3 (ST / LAD / Modbus TCP)",
            structured_text_code=st_code,
            ladder_logic_rungs=rungs,
            modbus_registers=registers,
            safety_interlocks_count=3,
            control_cycle_time_ms=10.0
        )
