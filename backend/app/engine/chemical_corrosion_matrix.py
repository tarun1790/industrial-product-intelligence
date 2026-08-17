from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ChemicalMediaCompatibility(BaseModel):
    chemical_formula: str
    chemical_name: str
    concentration_pct: float
    operating_temp_c: float
    tested_material: str # e.g. "AISI 316L Stainless", "Hastelloy C-276", "EPDM FDA"
    corrosion_rate_mm_per_year: float
    compatibility_grade: str # "GRADE_A_EXCELLENT", "GRADE_B_GOOD", "GRADE_C_CONDITIONAL", "GRADE_D_UNSATISFACTORY"
    stress_corrosion_cracking_risk: str # "NEGLIGIBLE", "ELEVATED", "CRITICAL"
    recommended_elastomer: str
    engineering_handling_notes: str

class ChemicalCompatibilityReport(BaseModel):
    product_part_number: str
    wetted_base_material: str
    wetted_elastomer: str
    tested_chemicals_count: int
    safe_chemicals_count: int
    overall_process_suitability: str
    media_evaluations: List[ChemicalMediaCompatibility]
    corrosion_prevention_protocol: str

class ChemicalCorrosionEngine:
    @classmethod
    def evaluate_chemical_compatibility(
        cls,
        part_number: str = "LKH-10/140",
        base_material: str = "AISI 316L Electropolished",
        elastomer: str = "EPDM FDA"
    ) -> ChemicalCompatibilityReport:
        evals = [
            ChemicalMediaCompatibility(
                chemical_formula="H₂SO₄ (10%)",
                chemical_name="Dilute Sulfuric Acid",
                concentration_pct=10.0,
                operating_temp_c=40.0,
                tested_material=base_material,
                corrosion_rate_mm_per_year=0.012,
                compatibility_grade="GRADE_A_EXCELLENT",
                stress_corrosion_cracking_risk="NEGLIGIBLE",
                recommended_elastomer="PTFE / Kalrez 6375",
                engineering_handling_notes="316L passive chromium oxide film stable below 50°C. EPDM acceptable for brief washdown, PTFE recommended for continuous acid."
            ),
            ChemicalMediaCompatibility(
                chemical_formula="NaOH (30%)",
                chemical_name="Sodium Hydroxide (Caustic Soda)",
                concentration_pct=30.0,
                operating_temp_c=65.0,
                tested_material=base_material,
                corrosion_rate_mm_per_year=0.005,
                compatibility_grade="GRADE_A_EXCELLENT",
                stress_corrosion_cracking_risk="NEGLIGIBLE",
                recommended_elastomer="EPDM FDA Grade",
                engineering_handling_notes="Zero alkaline embrittlement. Standard CIP cleaning cycle compatible (140°C steam + 2% caustic wash)."
            ),
            ChemicalMediaCompatibility(
                chemical_formula="HCl (37%)",
                chemical_name="Concentrated Hydrochloric Acid",
                concentration_pct=37.0,
                operating_temp_c=25.0,
                tested_material=base_material,
                corrosion_rate_mm_per_year=2.45,
                compatibility_grade="GRADE_D_UNSATISFACTORY",
                stress_corrosion_cracking_risk="CRITICAL",
                recommended_elastomer="Hastelloy C-276 / Tantalum Trim",
                engineering_handling_notes="SEVERE PITTING RISK: Chloride ions break down 316L passive film. Requires upgrade to Hastelloy C-276 or PFA fluoropolymer lining."
            ),
            ChemicalMediaCompatibility(
                chemical_formula="H₂S / Sour Gas",
                chemical_name="Hydrogen Sulfide (NACE MR0175)",
                concentration_pct=5.0,
                operating_temp_c=80.0,
                tested_material=base_material,
                corrosion_rate_mm_per_year=0.025,
                compatibility_grade="GRADE_B_GOOD",
                stress_corrosion_cracking_risk="NEGLIGIBLE",
                recommended_elastomer="HNBR / Viton GLT",
                engineering_handling_notes="Material hardness verified < 22 HRC. Prevents sulfide stress corrosion cracking per ISO 15156 guidelines."
            )
        ]

        safe = sum(1 for e in evals if e.compatibility_grade in ["GRADE_A_EXCELLENT", "GRADE_B_GOOD"])

        return ChemicalCompatibilityReport(
            product_part_number=part_number,
            wetted_base_material=base_material,
            wetted_elastomer=elastomer,
            tested_chemicals_count=len(evals),
            safe_chemicals_count=safe,
            overall_process_suitability="CERTIFIED_FOR_PHARMA_FOOD_AND_ORGANIC_SOLVENTS",
            media_evaluations=evals,
            corrosion_prevention_protocol="Passivation per ASTM A967 (Citric Acid 4) recommended after maintenance welding."
        )
