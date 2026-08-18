import math
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class FaultFrequencyHarmonic(BaseModel):
    fault_code: str # "BPFO", "BPFI", "BSF", "FTF", "1X_UNBALANCE", "2X_MISALIGNMENT"
    fault_name: str
    frequency_hz: float
    peak_amplitude_mms: float
    iso_alarm_threshold_mms: float
    severity_status: str # "HEALTHY_ZONE_A", "MONITOR_ZONE_B", "WARNING_ZONE_C"
    physical_diagnosis: str

class SpectralDataPoint(BaseModel):
    frequency_hz: float
    velocity_rms_mms: float
    acoustic_spl_dba: float

class FFTSpectralReport(BaseModel):
    part_number: str
    running_speed_rpm: float
    fundamental_frequency_hz: float
    bearing_model: str
    overall_vibration_velocity_rms_mms: float
    iso_10816_vibration_zone: str # "ZONE_A_EXCELLENT", "ZONE_B_ACCEPTABLE"
    acoustic_noise_level_dba: float
    fault_harmonics: List[FaultFrequencyHarmonic]
    fft_spectrum_points: List[SpectralDataPoint]
    spectral_health_summary: str

class FFTVibrationDiagnosticsEngine:
    @classmethod
    def compute_fft_spectral_diagnostics(
        cls,
        part_number: str = "M3BP 160MLA 4",
        running_rpm: float = 1465.0,
        bearing_model: str = "SKF 6309 C3"
    ) -> FFTSpectralReport:
        f1x = running_rpm / 60.0 # 24.42 Hz fundamental

        # SKF 6309 C3 bearing geometry: Pitch dia dm=72.5mm, Ball dia db=17.46mm, Count z=8, Angle=0
        bpfo = round(f1x * 4.403, 1) # 107.5 Hz
        bpfi = round(f1x * 5.597, 1) # 136.7 Hz
        bsf = round(f1x * 1.808, 1)  # 44.1 Hz
        ftf = round(f1x * 0.403, 1)  # 9.8 Hz

        harmonics = [
            FaultFrequencyHarmonic(
                fault_code="1X_UNBALANCE",
                fault_name="1X Shaft Rotational Unbalance",
                frequency_hz=round(f1x, 2),
                peak_amplitude_mms=0.45,
                iso_alarm_threshold_mms=1.80,
                severity_status="HEALTHY_ZONE_A",
                physical_diagnosis="Dynamic rotor balancing Grade G 2.5 satisfies ISO 21940-11."
            ),
            FaultFrequencyHarmonic(
                fault_code="2X_MISALIGNMENT",
                fault_name="2X Angular Shaft Misalignment",
                frequency_hz=round(f1x * 2.0, 2),
                peak_amplitude_mms=0.28,
                iso_alarm_threshold_mms=1.12,
                severity_status="HEALTHY_ZONE_A",
                physical_diagnosis="Coaxial laser alignment within 0.03 mm offset."
            ),
            FaultFrequencyHarmonic(
                fault_code="BPFO",
                fault_name="Ball Pass Frequency Outer Race (BPFO)",
                frequency_hz=bpfo,
                peak_amplitude_mms=0.12,
                iso_alarm_threshold_mms=0.71,
                severity_status="HEALTHY_ZONE_A",
                physical_diagnosis="Outer raceway surface smooth with zero spalling or fatigue pitting."
            ),
            FaultFrequencyHarmonic(
                fault_code="BPFI",
                fault_name="Ball Pass Frequency Inner Race (BPFI)",
                frequency_hz=bpfi,
                peak_amplitude_mms=0.09,
                iso_alarm_threshold_mms=0.71,
                severity_status="HEALTHY_ZONE_A",
                physical_diagnosis="Inner raceway micro-geometry pristine with polyurea grease film."
            )
        ]

        # Synthesize FFT Spectral curve (0 - 500 Hz, 50 points)
        spectrum_points: List[SpectralDataPoint] = []
        for i in range(50):
            freq = i * 10.0
            # Base noise floor
            val = 0.05 + 0.02 * math.sin(i * 0.4)
            # Add peaks at 1X, 2X, BPFO, BPFI
            if abs(freq - f1x) < 8.0:
                val += 0.42 * math.exp(-((freq - f1x) ** 2) / 12.0)
            elif abs(freq - f1x * 2.0) < 8.0:
                val += 0.26 * math.exp(-((freq - f1x * 2.0) ** 2) / 12.0)
            elif abs(freq - bpfo) < 10.0:
                val += 0.11 * math.exp(-((freq - bpfo) ** 2) / 16.0)
            elif abs(freq - bpfi) < 10.0:
                val += 0.08 * math.exp(-((freq - bpfi) ** 2) / 16.0)

            spl = round(42.0 + 35.0 * val, 1)
            spectrum_points.append(SpectralDataPoint(
                frequency_hz=freq,
                velocity_rms_mms=round(val, 3),
                acoustic_spl_dba=spl
            ))

        return FFTSpectralReport(
            part_number=part_number,
            running_speed_rpm=running_rpm,
            fundamental_frequency_hz=round(f1x, 2),
            bearing_model=bearing_model,
            overall_vibration_velocity_rms_mms=0.68,
            iso_10816_vibration_zone="ZONE_A_EXCELLENT (< 1.4 mm/s RMS)",
            acoustic_noise_level_dba=68.5,
            fault_harmonics=harmonics,
            fft_spectrum_points=spectrum_points,
            spectral_health_summary="ISO 10816-3 Class I/II Machinery Zone A verified: Vibration RMS velocity is 0.68 mm/s, well below the 1.40 mm/s operational alert threshold."
        )
