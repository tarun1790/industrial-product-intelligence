import math
from typing import Dict, Any, List

class EngineeringCurvesSimulator:
    @classmethod
    def generate_motor_torque_curve(
        cls,
        rated_power_kw: float = 7.5,
        rated_speed_rpm: float = 1465,
        sync_speed_rpm: float = 1500,
        rated_current_a: float = 14.2
    ) -> Dict[str, Any]:
        """
        Generates Kloss formula approximation for AC Induction Motor Torque-Speed Curve
        T_nom = 9550 * P / N
        """
        t_nom = round((9550.0 * rated_power_kw) / max(1.0, rated_speed_rpm), 2) # Nm
        t_start = round(t_nom * 2.3, 2) # Locked rotor torque
        t_max = round(t_nom * 3.1, 2)   # Breakdown torque
        
        # Breakdown speed typically around 85% of sync speed
        s_crit = (sync_speed_rpm - (sync_speed_rpm * 0.85)) / sync_speed_rpm

        points: List[Dict[str, float]] = []
        for n in range(0, int(sync_speed_rpm) + 1, 75):
            slip = max(0.001, (sync_speed_rpm - n) / sync_speed_rpm)
            # Kloss equation: T / T_max = 2 / (s/s_crit + s_crit/s)
            t_ratio = 2.0 / ((slip / s_crit) + (s_crit / slip))
            t_val = round(t_max * t_ratio, 2)
            
            # Current estimation: Starting current is 6x nominal, drops down
            curr_ratio = 1.0 + (5.0 * (slip ** 0.8))
            curr_val = round(rated_current_a * curr_ratio, 1)
            
            eff_val = round(max(0.0, min(92.0, (1.0 - slip) * 94.0)), 1)

            points.append({
                "speed_rpm": n,
                "torque_nm": t_val,
                "current_a": curr_val,
                "efficiency_percent": eff_val
            })

        return {
            "nominal_torque_nm": t_nom,
            "starting_torque_nm": t_start,
            "breakdown_torque_nm": t_max,
            "rated_power_kw": rated_power_kw,
            "rated_speed_rpm": rated_speed_rpm,
            "data_points": points
        }

    @classmethod
    def calculate_bearing_life(
        cls,
        dynamic_load_c_kn: float = 14.8,
        radial_load_fr_kn: float = 2.5,
        axial_load_fa_kn: float = 0.5,
        speed_rpm: float = 1465,
        bearing_type: str = "ball" # "ball" (p=3) or "roller" (p=10/3)
    ) -> Dict[str, Any]:
        """
        ISO 281 L10h Rating Life calculation:
        L10h = (10^6 / (60 * n)) * (C / P)^p
        """
        p_exponent = 3.0 if bearing_type == "ball" else (10.0 / 3.0)
        
        # Equivalent dynamic load P
        # For deep groove ball bearing: if Fa/Fr > 0.22, P = 0.56 Fr + 1.4 Fa
        ratio = axial_load_fa_kn / max(0.01, radial_load_fr_kn)
        if ratio > 0.22:
            equiv_load_p = (0.56 * radial_load_fr_kn) + (1.4 * axial_load_fa_kn)
        else:
            equiv_load_p = radial_load_fr_kn

        equiv_load_p = max(0.1, equiv_load_p)

        # L10 revolutions in millions
        l10_million_revs = (dynamic_load_c_kn / equiv_load_p) ** p_exponent
        
        # L10h operating hours
        l10h_hours = (1000000.0 / (60.0 * max(1.0, speed_rpm))) * l10_million_revs
        l10h_years_continuous = l10h_hours / 8760.0

        return {
            "equivalent_load_p_kn": round(equiv_load_p, 3),
            "dynamic_capacity_c_kn": dynamic_load_c_kn,
            "l10_million_revolutions": round(l10_million_revs, 1),
            "l10h_operating_hours": round(l10h_hours, 0),
            "l10h_continuous_years": round(l10h_years_continuous, 2),
            "service_verdict": "Exceeds standard 40,000h industrial design threshold" if l10h_hours >= 40000 else "Standard duty rating",
            "fatigue_load_ratio_c_over_p": round(dynamic_load_c_kn / equiv_load_p, 2)
        }

    @classmethod
    def generate_pump_qh_curve(
        cls,
        nominal_flow_m3h: float = 10.0,
        nominal_head_m: float = 65.0,
        shutoff_head_m: float = 78.0
    ) -> Dict[str, Any]:
        """
        Generates parabolic pump head-flow curve H(Q) = H_0 - k * Q^2
        """
        k_factor = (shutoff_head_m - nominal_head_m) / (nominal_flow_m3h ** 2)
        
        points: List[Dict[str, float]] = []
        max_flow = int(nominal_flow_m3h * 1.6)
        
        for q in range(0, max_flow + 1, 1):
            h_val = round(max(0.0, shutoff_head_m - (k_factor * (q ** 2))), 1)
            # Hydraulic power in kW: (1000 * 9.81 * Q * H) / 3.6e6
            p_hyd = round((1000.0 * 9.81 * q * h_val) / 3600000.0, 2)
            # Efficiency curve peaks at nominal flow
            eff = round(max(10.0, 72.0 * (1.0 - (((q - nominal_flow_m3h) / nominal_flow_m3h) ** 2))), 1)
            
            points.append({
                "flow_m3h": q,
                "head_m": h_val,
                "hydraulic_power_kw": p_hyd,
                "pump_efficiency_percent": eff
            })

        return {
            "bep_flow_m3h": nominal_flow_m3h,
            "bep_head_m": nominal_head_m,
            "shutoff_head_m": shutoff_head_m,
            "data_points": points
        }
