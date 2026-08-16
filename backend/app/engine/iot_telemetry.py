import math
import random
from typing import Dict, Any, List
from pydantic import BaseModel

class SensorTelemetryPacket(BaseModel):
    timestamp_utc: str
    phase_current_amps: float
    stator_temperature_c: float
    vibration_velocity_rms_mms: float
    vfd_carrier_thd_percent: float
    shaft_speed_rpm: float
    dynamic_stress_multiplier: float
    operating_health_zone: str # "NOMINAL_SAFE", "ELEVATED_STRESS", "THERMAL_WARNING"
    projected_remaining_hours: float

class IoTTelemetryTwinEngine:
    @classmethod
    def get_live_machine_telemetry(
        cls,
        part_number: str = "M3BP 160MLA 4",
        ambient_temp_c: float = 40.0,
        load_factor_percent: float = 85.0
    ) -> SensorTelemetryPacket:
        # Physics calculation based on load and temperature
        base_current = 14.7 * (load_factor_percent / 100.0)
        temp_rise = 45.0 * (load_factor_percent / 100.0) ** 1.8
        stator_temp = ambient_temp_c + temp_rise
        vib_rms = 1.2 + 0.8 * (load_factor_percent / 100.0)

        # Arrhenius thermal acceleration factor
        arrhenius = math.exp((stator_temp - 40.0) / 10.0 * math.log(2.0))
        vib_penalty = (vib_rms / 1.8) ** 1.5
        stress_mult = round(arrhenius * vib_penalty, 2)

        base_eta = 65000.0
        projected_rul = round(base_eta / max(1.0, stress_mult), 0)

        if stator_temp > 95.0 or vib_rms > 3.5:
            zone = "THERMAL_WARNING"
        elif stator_temp > 75.0 or vib_rms > 2.2:
            zone = "ELEVATED_STRESS"
        else:
            zone = "NOMINAL_SAFE"

        return SensorTelemetryPacket(
            timestamp_utc="2024-08-16T22:36:00Z",
            phase_current_amps=round(base_current, 2),
            stator_temperature_c=round(stator_temp, 1),
            vibration_velocity_rms_mms=round(vib_rms, 2),
            vfd_carrier_thd_percent=3.2,
            shaft_speed_rpm=round(1465.0 - (1.0 - load_factor_percent / 100.0) * 15.0, 1),
            dynamic_stress_multiplier=stress_mult,
            operating_health_zone=zone,
            projected_remaining_hours=projected_rul
        )
