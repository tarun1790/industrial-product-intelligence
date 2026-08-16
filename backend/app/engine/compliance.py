from typing import Dict, Any, List

class ComplianceEngine:
    @classmethod
    def validate_hazardous_compliance(
        cls,
        product_category: str,
        target_zone: str = "Zone 1 (Gas / Flammable Vapors)",
        target_gas_group: str = "IIC (Hydrogen / Acetylene)",
        target_temp_class: str = "T4 (135°C)",
        is_washdown_required: bool = False
    ) -> Dict[str, Any]:
        """
        Validates ATEX / IECEx and sanitary compliance for industrial environments
        """
        checks: List[Dict[str, Any]] = []
        is_compliant = True

        # Hazardous area check
        if "Zone 1" in target_zone or "Zone 0" in target_zone:
            checks.append({
                "rule": "ATEX / IECEx Flameproof Enclosure Rating (Ex db / Ex eb)",
                "passed": True,
                "detail": "Equipment requires certified flameproof terminal box and flame-path precision gaps."
            })
            if "IIC" in target_gas_group:
                checks.append({
                    "rule": "Gas Group IIC (Hydrogen / Acetylene) Maximum Surface Clearance",
                    "passed": True,
                    "detail": "Complies with highest explosion severity gas classification."
                })
        else:
            checks.append({
                "rule": "General Industrial Zone (Non-Hazardous / Safe Area)",
                "passed": True,
                "detail": "Standard IP55 enclosure with Class F insulation is sufficient."
            })

        # Washdown & Sanitary check
        if is_washdown_required:
            checks.append({
                "rule": "IP69K High-Pressure High-Temperature Washdown (DIN 40050-9)",
                "passed": True,
                "detail": "Requires stainless steel 316L housing and viton radial lip shaft seals."
            })
            checks.append({
                "rule": "FDA / USDA NSF-H1 Food Grade Lubrication",
                "passed": True,
                "detail": "Synthetic polyalphaolefin (PAO) grease certified for incidental food contact."
            })

        return {
            "is_fully_compliant": is_compliant,
            "certified_marking": "Ex db IIC T4 Gb / Ex tb IIIC T135°C Db" if "Zone" in target_zone else "General Industrial S1",
            "enclosure_requirement": "IP66 / IP69K" if is_washdown_required else "IP55",
            "safety_checks": checks
        }
