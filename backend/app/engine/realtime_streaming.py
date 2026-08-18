import asyncio
import math
import random
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class LiveTelemetryFrame(BaseModel):
    timestamp_iso: str
    part_number: str
    phase_u_current_amps: float
    phase_v_current_amps: float
    phase_w_current_amps: float
    stator_temperature_c: float
    vibration_velocity_rms_mms: float
    vfd_dc_bus_voltage_v: float
    shaft_speed_rpm: float
    operating_status: str # "RUNNING_HEALTHY", "WARNING_ELEVATED", "TRIPPED_EMERGENCY_STOP"
    active_alarms: List[str]
    weibull_degradation_index: float

class RealtimeStreamingHub:
    _emergency_trip_active: bool = False
    _trip_reason: Optional[str] = None

    @classmethod
    def trigger_emergency_trip(cls, reason: str = "MANUAL_E_STOP_TRIGGERED"):
        cls._emergency_trip_active = True
        cls._trip_reason = reason

    @classmethod
    def reset_emergency_trip(cls):
        cls._emergency_trip_active = False
        cls._trip_reason = None

    @classmethod
    def generate_live_frame(cls, part_number: str = "M3BP 160MLA 4") -> LiveTelemetryFrame:
        t = time.time()
        iso_time = time.strftime("%Y-%m-%dT%H:%M:%S.", time.gmtime(t)) + f"{int((t % 1) * 1000):03d}Z"

        if cls._emergency_trip_active:
            return LiveTelemetryFrame(
                timestamp_iso=iso_time,
                part_number=part_number,
                phase_u_current_amps=0.0,
                phase_v_current_amps=0.0,
                phase_w_current_amps=0.0,
                stator_temperature_c=58.2,
                vibration_velocity_rms_mms=0.02,
                vfd_dc_bus_voltage_v=0.0,
                shaft_speed_rpm=0.0,
                operating_status="TRIPPED_EMERGENCY_STOP",
                active_alarms=[cls._trip_reason or "SAFETY_INTERLOCK_OPEN"],
                weibull_degradation_index=0.0
            )

        # Normal operation with realistic dynamic sinusoidal ripple + noise
        base_current = 14.7
        i_u = round(base_current + 0.35 * math.sin(t * 4.0) + random.uniform(-0.08, 0.08), 2)
        i_v = round(base_current + 0.35 * math.sin(t * 4.0 + 2.094) + random.uniform(-0.08, 0.08), 2) # +120 deg
        i_w = round(base_current + 0.35 * math.sin(t * 4.0 + 4.188) + random.uniform(-0.08, 0.08), 2) # +240 deg

        t_winding = round(78.5 + 1.2 * math.sin(t * 0.1) + random.uniform(-0.2, 0.2), 1)
        vib_rms = round(0.68 + 0.08 * math.sin(t * 6.0) + random.uniform(-0.03, 0.03), 3)
        vfd_bus = round(565.0 + 3.5 * math.sin(t * 2.0) + random.uniform(-1.0, 1.0), 1)
        speed = round(1465.0 + 4.0 * math.sin(t * 1.5) + random.uniform(-1.0, 1.0), 1)

        alarms = []
        status = "RUNNING_HEALTHY"
        if t_winding > 120.0:
            status = "WARNING_ELEVATED"
            alarms.append("STATOR_TEMP_HIGH_CLASS_B_EXCEEDED")
        if vib_rms > 1.4:
            status = "WARNING_ELEVATED"
            alarms.append("ISO_10816_VIBRATION_ZONE_B")

        return LiveTelemetryFrame(
            timestamp_iso=iso_time,
            part_number=part_number,
            phase_u_current_amps=i_u,
            phase_v_current_amps=i_v,
            phase_w_current_amps=i_w,
            stator_temperature_c=t_winding,
            vibration_velocity_rms_mms=vib_rms,
            vfd_dc_bus_voltage_v=vfd_bus,
            shaft_speed_rpm=speed,
            operating_status=status,
            active_alarms=alarms,
            weibull_degradation_index=0.038
        )
