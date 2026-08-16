import hashlib
import json
from typing import Dict, Any, List

class DigitalProductPassportEngine:
    @classmethod
    def generate_dpp_passport(
        cls,
        part_number: str = "M3BP 160MLA 4",
        manufacturer: str = "ABB",
        weight_kg: float = 45.0,
        efficiency_class: str = "IE3"
    ) -> Dict[str, Any]:
        """
        Generates EU ESPR (Ecodesign for Sustainable Products Regulation)
        Digital Product Passport with Circularity & Carbon Footprint Metrics.
        """
        # Material Composition Breakdown
        cast_iron_kg = round(weight_kg * 0.58, 1) # Stator & End shields
        silicon_steel_kg = round(weight_kg * 0.24, 1) # Rotor & Stator core laminations
        copper_windings_kg = round(weight_kg * 0.14, 1) # Magnet wire
        aluminum_insulation_kg = round(weight_kg * 0.04, 1)

        # Embodied carbon estimation (kg CO2e)
        embodied_co2_kg = round(
            (cast_iron_kg * 1.8) +
            (silicon_steel_kg * 2.4) +
            (copper_windings_kg * 4.8) +
            (aluminum_insulation_kg * 8.2),
            1
        )

        # Annual energy & operational carbon savings (IE3 vs IE2 over 4,000 operating hrs/yr)
        annual_energy_savings_kwh = 1420.0
        annual_co2_avoided_kg = round(annual_energy_savings_kwh * 0.42, 1) # 420g CO2/kWh grid factor

        # Cryptographic Provenance Seal
        raw_provenance_payload = {
            "standard": "EU_ESPR_2024_ANNEX_IV",
            "dpp_id": f"urn:epc:id:dpp:{manufacturer.lower()}:{part_number.replace(' ', '-').lower()}",
            "manufacturer": manufacturer,
            "part_number": part_number,
            "weight_kg": weight_kg,
            "efficiency_class": efficiency_class,
            "recyclability_percentage": 96.4,
            "embodied_carbon_kg_co2e": embodied_co2_kg
        }
        crypto_hash = hashlib.sha256(json.dumps(raw_provenance_payload, sort_keys=True).encode()).hexdigest()

        return {
            "dpp_standard_compliance": "EU Ecodesign Regulation (ESPR) 2024/1781",
            "passport_urn": raw_provenance_payload["dpp_id"],
            "cryptographic_merkle_seal": f"0x{crypto_hash}",
            "circularity_metrics": {
                "recyclability_rate_percent": 96.4,
                "recycled_content_percent": 38.5,
                "expected_service_lifetime_years": 15.0,
                "repairability_index": "A (High / Modular Stator & Bearing Replacement)"
            },
            "bill_of_materials_crm": [
                {"material": "Cast Iron Frame (Grade EN-GJL-200)", "mass_kg": cast_iron_kg, "percentage": 58.0, "is_critical_raw_material": False},
                {"material": "Low-Loss Silicon Steel Laminations (M400-50A)", "mass_kg": silicon_steel_kg, "percentage": 24.0, "is_critical_raw_material": False},
                {"material": "High-Purity Electrolytic Copper (OF-Cu)", "mass_kg": copper_windings_kg, "percentage": 14.0, "is_critical_raw_material": True},
                {"material": "Die-Cast Aluminum Rotor & Class F Enamel", "mass_kg": aluminum_insulation_kg, "percentage": 4.0, "is_critical_raw_material": False}
            ],
            "carbon_lifecycle": {
                "manufacturing_embodied_co2_kg": embodied_co2_kg,
                "annual_operational_co2_avoided_kg": annual_co2_avoided_kg,
                "annual_energy_savings_kwh": annual_energy_savings_kwh,
                "payback_carbon_breakeven_months": round((embodied_co2_kg / max(1.0, annual_co2_avoided_kg)) * 12.0, 1)
            }
        }
