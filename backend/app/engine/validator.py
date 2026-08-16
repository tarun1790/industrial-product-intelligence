import math
from typing import List, Dict, Any, Tuple, Optional
from app.models.schemas import ValidationIssue, EngineeringSanityCheck

class EngineeringValidator:
    @classmethod
    def validate_product(cls, category: str, attributes: Dict[str, Any]) -> Tuple[List[ValidationIssue], List[EngineeringSanityCheck], float]:
        issues: List[ValidationIssue] = []
        checks: List[EngineeringSanityCheck] = []
        trust_penalty = 0.0

        if category == "Industrial Motor":
            # 1. 3-Phase Electrical Power Balance Verification
            power_val = cls._get_num(attributes.get("rated_power"))
            volt_val = cls._get_num(attributes.get("rated_voltage"))
            curr_val = cls._get_num(attributes.get("rated_current"))
            phases_val = cls._get_num(attributes.get("number_of_phases"), default=3)
            pf_val = cls._get_num(attributes.get("power_factor"), default=0.85)
            eff_val = cls._get_num(attributes.get("efficiency_percentage"), default=90.0) / 100.0
            
            if power_val and volt_val and curr_val:
                if phases_val == 3:
                    # P_calc = sqrt(3) * V * I * cos(phi) * eta / 1000  (in kW)
                    p_calc = (math.sqrt(3) * volt_val * curr_val * pf_val * eff_val) / 1000.0
                    formula = "P(kW) = √3 × V × I × cos(φ) × η / 1000"
                else:
                    p_calc = (volt_val * curr_val * pf_val * eff_val) / 1000.0
                    formula = "P(kW) = V × I × cos(φ) × η / 1000"
                
                discrepancy = abs(p_calc - power_val) / power_val * 100.0
                
                if discrepancy > 25.0:
                    issues.append(ValidationIssue(
                        id="ERR_ELEC_INCONSISTENCY",
                        severity="ERROR",
                        category="PHYSICS_ELECTRICAL",
                        title="Severe Electrical Rating Discrepancy",
                        message=f"Stated mechanical power is {power_val} kW, but calculated theoretical output is {p_calc:.2f} kW at {volt_val}V and {curr_val}A (Discrepancy: {discrepancy:.1f}%).",
                        affected_attributes=["rated_power", "rated_voltage", "rated_current"],
                        suggested_correction=f"Verify if current rating ({curr_val}A) is starting current instead of full-load nominal current.",
                        is_physics_violation=True
                    ))
                    trust_penalty += 35.0
                    checks.append(EngineeringSanityCheck(
                        passed=False,
                        formula_tested=formula,
                        calculated_value=f"{p_calc:.2f} kW",
                        stated_value=f"{power_val:.2f} kW",
                        discrepancy_percentage=round(discrepancy, 1),
                        details="Physical power equation failed tolerance (>25% discrepancy)"
                    ))
                else:
                    checks.append(EngineeringSanityCheck(
                        passed=True,
                        formula_tested=formula,
                        calculated_value=f"{p_calc:.2f} kW",
                        stated_value=f"{power_val:.2f} kW",
                        discrepancy_percentage=round(discrepancy, 1),
                        details=f"Electrical parameters validated within standard {discrepancy:.1f}% engineering tolerance"
                    ))

            # 2. Synchronous Speed & Slip Verification
            freq = cls._get_num(attributes.get("rated_frequency"), default=50.0)
            rpm = cls._get_num(attributes.get("rated_speed_rpm"))
            if freq and rpm:
                # Standard synchronous speeds at 50Hz: 3000, 1500, 1000, 750 (2, 4, 6, 8 poles)
                # at 60Hz: 3600, 1800, 1200, 900
                sync_speeds_50 = [3000, 1500, 1000, 750]
                sync_speeds_60 = [3600, 1800, 1200, 900]
                valid_syncs = sync_speeds_50 if abs(freq - 50) < 2 else sync_speeds_60
                
                # Induction motors must run slightly below synchronous speed
                closest_sync = min(valid_syncs, key=lambda s: abs(s - rpm))
                if rpm > closest_sync:
                    issues.append(ValidationIssue(
                        id="WARN_SUPERSYNCHRONOUS_SPEED",
                        severity="WARNING",
                        category="PHYSICS_ELECTRICAL",
                        title="Supersynchronous Speed Detected for Induction Motor",
                        message=f"Rated speed of {rpm} RPM exceeds nearest synchronous speed ({closest_sync} RPM @ {freq}Hz).",
                        affected_attributes=["rated_speed_rpm", "rated_frequency"],
                        suggested_correction=f"Ensure this is not a VFD inverter overspeed rating or synchronous reluctance motor.",
                        is_physics_violation=True
                    ))
                    trust_penalty += 15.0

            # 3. IP rating sanity vs Application
            ip_val = attributes.get("ip_rating")
            ip_str = cls._get_str(ip_val)
            if "IP20" in ip_str or "IP21" in ip_str:
                issues.append(ValidationIssue(
                    id="INFO_IP_RATING_LOW",
                    severity="INFO",
                    category="IP_RATING",
                    title="Low Ingress Protection (Open Drip Proof)",
                    message=f"Enclosure rated {ip_str}. Suitable only for clean, dry indoor switchrooms.",
                    affected_attributes=["ip_rating"]
                ))

        elif category == "Rolling Bearing":
            # Dynamic Load C vs Static Load C0 check
            dyn_c = cls._get_num(attributes.get("dynamic_load_rating_c"))
            stat_c0 = cls._get_num(attributes.get("static_load_rating_c0"))
            if dyn_c and stat_c0:
                if stat_c0 > dyn_c * 1.5:
                    issues.append(ValidationIssue(
                        id="WARN_BEARING_LOAD_RATIO",
                        severity="WARNING",
                        category="LOAD_SPEED",
                        title="Abnormal Bearing Load Capacity Ratio",
                        message=f"Static load C0 ({stat_c0} kN) is unusually higher than dynamic load C ({dyn_c} kN).",
                        affected_attributes=["dynamic_load_rating_c", "static_load_rating_c0"],
                        suggested_correction="Verify radial vs axial thrust load column alignment in source table."
                    ))
                    trust_penalty += 10.0
                else:
                    checks.append(EngineeringSanityCheck(
                        passed=True,
                        formula_tested="C0 / C standard ISO ratio",
                        calculated_value=f"C0/C = {stat_c0/dyn_c:.2f}",
                        stated_value=f"C={dyn_c}kN, C0={stat_c0}kN",
                        details="Load ratings follow standard ISO 281 / ISO 76 proportionality"
                    ))

        elif category == "Centrifugal Pump":
            # Hydraulic power check: P_hyd = rho * g * Q * H / 3.6e6
            flow = cls._get_num(attributes.get("flow_rate_nominal")) # m3/h
            head = cls._get_num(attributes.get("head_nominal")) # m
            motor_p = cls._get_num(attributes.get("motor_power")) # kW
            if flow and head and motor_p:
                p_hyd = (1000 * 9.81 * flow * head) / 3600000.0 # kW
                if motor_p < p_hyd * 0.8:
                    issues.append(ValidationIssue(
                        id="ERR_PUMP_UNDERPWR",
                        severity="ERROR",
                        category="PHYSICS_ELECTRICAL",
                        title="Motor Power Insufficient for Hydraulic Duty",
                        message=f"Required hydraulic power is {p_hyd:.2f} kW for {flow} m³/h @ {head}m head, but motor is only rated {motor_p} kW.",
                        affected_attributes=["flow_rate_nominal", "head_nominal", "motor_power"],
                        suggested_correction="Check if head or flow is maximum shutoff value instead of nominal duty point.",
                        is_physics_violation=True
                    ))
                    trust_penalty += 25.0
                else:
                    checks.append(EngineeringSanityCheck(
                        passed=True,
                        formula_tested="P_hyd = (ρ × g × Q × H) / 3.6×10⁶",
                        calculated_value=f"Hydraulic Power: {p_hyd:.2f} kW",
                        stated_value=f"Motor Power: {motor_p} kW",
                        details="Motor power adequately covers hydraulic load with safe service factor"
                    ))

        trust_score = max(5.0, round(100.0 - trust_penalty, 1))
        return issues, checks, trust_score

    @classmethod
    def _get_str(cls, attr: Any) -> str:
        if not attr:
            return ""
        if hasattr(attr, "raw_value"):
            return str(attr.raw_value or "")
        if isinstance(attr, dict):
            return str(attr.get("display_value") or attr.get("raw_value") or "")
        return str(attr)

    @classmethod
    def _get_num(cls, attr_dict: Any, default: Optional[float] = None) -> Optional[float]:
        if not attr_dict:
            return default
        if isinstance(attr_dict, (int, float)):
            return float(attr_dict)
        if hasattr(attr_dict, "normalized_value") and attr_dict.normalized_value is not None:
            return float(attr_dict.normalized_value)
        if hasattr(attr_dict, "raw_value") and attr_dict.raw_value is not None:
            try:
                clean = str(attr_dict.raw_value).split()[0].replace('%', '')
                return float(clean)
            except (ValueError, TypeError):
                pass
        if isinstance(attr_dict, dict):
            if attr_dict.get("normalized_value") is not None:
                return float(attr_dict["normalized_value"])
            if attr_dict.get("raw_value") is not None:
                try:
                    clean = str(attr_dict["raw_value"]).split()[0].replace('%', '')
                    return float(clean)
                except (ValueError, TypeError):
                    pass
        return default
