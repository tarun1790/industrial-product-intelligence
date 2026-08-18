from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class DismantleNode(BaseModel):
    node_id: str
    component_name: str
    mass_kg: float
    material_classification: str # "Cast Iron GJL-200", "Electrolytic Copper Cu-ETP", "Silicon Electrical Steel M400", "Cast Aluminum AlSi9Cu3"
    recyclability_pct: float
    lme_scrap_rate_usd_per_kg: float
    recovered_salvage_value_usd: float
    circular_pathway: str # "CLOSED_LOOP_REMANUFACTURE", "SECONDARY_METALLURGY_MELT", "ELASTOMER_PYROLYSIS"
    disassembly_step_sequence: int

class CircularDismantleReport(BaseModel):
    part_number: str
    total_product_mass_kg: float
    total_recyclable_mass_kg: float
    material_circularity_index: float # 0.0 to 1.0 (Ellen MacArthur Foundation MCI)
    total_commodity_salvage_value_usd: float
    virgin_material_displacement_co2e_kg: float
    dismantle_nodes: List[DismantleNode]
    esg_circularity_verdict: str

class CircularDismantleEngine:
    @classmethod
    def generate_dismantle_tree(cls, part_number: str = "M3BP 160MLA 4") -> CircularDismantleReport:
        nodes = [
            DismantleNode(
                node_id="DISMANTLE-01",
                component_name="Cast-Iron Stator Housing & End Shields",
                mass_kg=26.5,
                material_classification="Cast Iron EN-GJL-200",
                recyclability_pct=100.0,
                lme_scrap_rate_usd_per_kg=0.38,
                recovered_salvage_value_usd=10.07,
                circular_pathway="CLOSED_LOOP_REMANUFACTURE",
                disassembly_step_sequence=1
            ),
            DismantleNode(
                node_id="DISMANTLE-02",
                component_name="Stator Copper Winding Bundle",
                mass_kg=6.2,
                material_classification="Electrolytic Copper Cu-ETP (99.9% Pure)",
                recyclability_pct=100.0,
                lme_scrap_rate_usd_per_kg=9.20, # LME Copper rate
                recovered_salvage_value_usd=57.04,
                circular_pathway="SECONDARY_METALLURGY_MELT",
                disassembly_step_sequence=2
            ),
            DismantleNode(
                node_id="DISMANTLE-03",
                component_name="Laminated Stator & Rotor Core Pack",
                mass_kg=8.8,
                material_classification="Non-Oriented Electrical Steel M400-50A",
                recyclability_pct=98.5,
                lme_scrap_rate_usd_per_kg=0.75,
                recovered_salvage_value_usd=6.60,
                circular_pathway="CLOSED_LOOP_REMANUFACTURE",
                disassembly_step_sequence=3
            ),
            DismantleNode(
                node_id="DISMANTLE-04",
                component_name="Rotor Cast Aluminum Cage & Shaft",
                mass_kg=3.5,
                material_classification="Cast Aluminum AlSi9Cu3 + 42CrMo4 Steel",
                recyclability_pct=95.0,
                lme_scrap_rate_usd_per_kg=2.20,
                recovered_salvage_value_usd=7.70,
                circular_pathway="SECONDARY_METALLURGY_MELT",
                disassembly_step_sequence=4
            )
        ]

        total_mass = sum(n.mass_kg for n in nodes)
        salvage_val = sum(n.recovered_salvage_value_usd for n in nodes)

        return CircularDismantleReport(
            part_number=part_number,
            total_product_mass_kg=45.0,
            total_recyclable_mass_kg=round(total_mass, 1),
            material_circularity_index=0.94,
            total_commodity_salvage_value_usd=round(salvage_val, 2),
            virgin_material_displacement_co2e_kg=128.4,
            dismantle_nodes=nodes,
            esg_circularity_verdict="EXEMPLARY CIRCULARITY: 94% Material Circularity Index (MCI) with $81.41 USD residual commodity salvage value and 128.4 kg CO2e virgin extraction displacement."
        )
