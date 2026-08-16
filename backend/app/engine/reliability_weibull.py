import math
from typing import Dict, Any, List

class WeibullReliabilityEngine:
    @classmethod
    def calculate_weibull_prognostics(
        cls,
        beta_shape_factor: float = 1.85, # Beta > 1 indicates wear-out degradation
        eta_characteristic_life_hrs: float = 65000.0,
        ambient_temp_c: float = 40.0,
        vfd_harmonic_thd_percent: float = 3.0
    ) -> Dict[str, Any]:
        """
        Calculates 2-Parameter Weibull Reliability Distribution:
        R(t) = exp(-(t / eta)^beta)
        """
        # Thermal Derating per Arrhenius Law: 10°C rise halves insulation life
        temp_delta = max(0.0, ambient_temp_c - 40.0)
        thermal_derating_factor = round(2.0 ** (-temp_delta / 10.0), 3)

        # Harmonic Derating Factor (VFD PWM switching losses)
        harmonic_derating_factor = round(max(0.70, 1.0 - (vfd_harmonic_thd_percent * 0.015)), 3)

        effective_eta = eta_characteristic_life_hrs * thermal_derating_factor * harmonic_derating_factor

        points: List[Dict[str, float]] = []
        for t in range(0, int(effective_eta * 1.5) + 1, 5000):
            # Reliability R(t)
            r_t = math.exp(-((t / max(1.0, effective_eta)) ** beta_shape_factor))
            # Failure probability F(t) = 1 - R(t)
            f_t = 1.0 - r_t
            
            points.append({
                "operating_hours": t,
                "reliability_percent": round(r_t * 100.0, 1),
                "cumulative_failure_probability_percent": round(f_t * 100.0, 1)
            })

        # Mean Time Between Failures (MTBF) = eta * Gamma(1 + 1/beta)
        # For beta=1.85, Gamma(1.54) approx 0.888
        mtbf_hours = round(effective_eta * 0.888, 0)
        b10_life_hours = round(effective_eta * ((-math.log(0.90)) ** (1.0 / beta_shape_factor)), 0)

        return {
            "weibull_parameters": {
                "beta_shape_factor": beta_shape_factor,
                "eta_characteristic_life_hrs": eta_characteristic_life_hrs,
                "effective_eta_derated_hrs": round(effective_eta, 0)
            },
            "derating_factors": {
                "ambient_thermal_derating": thermal_derating_factor,
                "vfd_harmonic_derating": harmonic_derating_factor,
                "combined_derating_multiplier": round(thermal_derating_factor * harmonic_derating_factor, 3)
            },
            "prognostic_metrics": {
                "b10_rating_life_hrs": b10_life_hours,
                "mtbf_mean_time_between_failures_hrs": mtbf_hours,
                "expected_service_life_years": round(mtbf_hours / 8760.0, 1),
                "recommended_inspection_interval_hrs": 12000
            },
            "reliability_curve_points": points
        }
