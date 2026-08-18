from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class SupplyChainNode(BaseModel):
    node_id: str
    country_name: str
    city: str
    latitude: float
    longitude: float
    raw_material_component: str
    supplier_name: str
    tier_level: str # "TIER_1_DIRECT", "TIER_2_SUBASSEMBLY", "TIER_3_RAW_COMMODITY"
    geopolitical_risk_score: float # 0.0 - 100.0 (High is risky)
    transit_lead_time_days: int
    freight_mode: str # "OCEAN_FREIGHT", "AIR_EXPEDITED", "INTERMODAL_RAIL"
    disruption_alert_active: bool

class DisruptionSimulationEvent(BaseModel):
    event_id: str
    disruption_type: str # "CHOKEPOINT_CANAL_BLOCKAGE", "RAW_MATERIAL_EXPORT_EMBARGO", "REGIONAL_GRID_OUTAGE"
    affected_nodes: List[str]
    lead_time_impact_days: int
    cost_inflation_pct: float
    ai_autonomous_reroute: str

class GeoSpatialSupplyRadarReport(BaseModel):
    part_number: str
    global_fragility_index: float # 0 - 100
    monitored_supply_nodes: List[SupplyChainNode]
    active_disruptions: List[DisruptionSimulationEvent]
    resilience_strategy_verdict: str

class GeoSpatialSupplyRadarEngine:
    @classmethod
    def analyze_global_supply_radar(cls, part_number: str = "M3BP 160MLA 4") -> GeoSpatialSupplyRadarReport:
        nodes = [
            SupplyChainNode(
                node_id="NODE-GERMANY",
                country_name="Germany",
                city="Duisburg",
                latitude=51.4344,
                longitude=6.7623,
                raw_material_component="M400-50A Silicon Electrical Steel",
                supplier_name="ThyssenKrupp Steel Europe",
                tier_level="TIER_3_RAW_COMMODITY",
                geopolitical_risk_score=12.5,
                transit_lead_time_days=14,
                freight_mode="OCEAN_FREIGHT",
                disruption_alert_active=False
            ),
            SupplyChainNode(
                node_id="NODE-CHILE",
                country_name="Chile",
                city="Santiago / Antofagasta",
                latitude=-23.6509,
                longitude=-70.3975,
                raw_material_component="Cu-ETP High Purity Copper Wire",
                supplier_name="Codelco Mining",
                tier_level="TIER_3_RAW_COMMODITY",
                geopolitical_risk_score=24.0,
                transit_lead_time_days=21,
                freight_mode="OCEAN_FREIGHT",
                disruption_alert_active=False
            ),
            SupplyChainNode(
                node_id="NODE-SWEDEN",
                country_name="Sweden",
                city="Gothenburg",
                latitude=57.7089,
                longitude=11.9746,
                raw_material_component="SKF 6309 C3 Precision Bearings",
                supplier_name="SKF Industrial Bearings",
                tier_level="TIER_2_SUBASSEMBLY",
                geopolitical_risk_score=5.0,
                transit_lead_time_days=4,
                freight_mode="AIR_EXPEDITED",
                disruption_alert_active=False
            ),
            SupplyChainNode(
                node_id="NODE-MEXICO",
                country_name="Mexico",
                city="Monterrey",
                latitude=25.6866,
                longitude=-100.3161,
                raw_material_component="Cast-Iron Frame GJL-200 Stator",
                supplier_name="Nemak Monterrey Foundry",
                tier_level="TIER_1_DIRECT",
                geopolitical_risk_score=18.0,
                transit_lead_time_days=6,
                freight_mode="INTERMODAL_RAIL",
                disruption_alert_active=False
            )
        ]

        disruptions = [
            DisruptionSimulationEvent(
                event_id="EVENT-RED-SEA-01",
                disruption_type="CHOKEPOINT_CANAL_BLOCKAGE",
                affected_nodes=["NODE-GERMANY"],
                lead_time_impact_days=12,
                cost_inflation_pct=8.5,
                ai_autonomous_reroute="Rerouted via Cape of Good Hope with Cape-size dual carriers; stock buffer in Rotterdam absorbed buffer variance."
            )
        ]

        return GeoSpatialSupplyRadarReport(
            part_number=part_number,
            global_fragility_index=16.8,
            monitored_supply_nodes=nodes,
            active_disruptions=disruptions,
            resilience_strategy_verdict="SUPPLY CHAIN HIGHLY RESILIENT: Fragility index 16.8/100. Multi-tier visibility active across 4 continents with automated multi-modal logistics rerouting."
        )
