from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
from app.engine.cross_reference import CrossReferenceEngine
from app.engine.curves_simulator import EngineeringCurvesSimulator
from app.engine.compliance import ComplianceEngine
from app.engine.why_not_engine import WhyNotEngine
from app.engine.catalog_health import CatalogHealthEngine
from app.engine.temporal_history import TemporalHistoryEngine
from app.engine.source_discovery import SourceDiscoveryEngine
from app.engine.ontology_engine import ProductOntologyEngine
from app.engine.benchmark_evaluator import BenchmarkEvaluatorEngine
from app.engine.neuro_symbolic import NeuroSymbolicReasoner
from app.engine.dpp_sustainability import DigitalProductPassportEngine
from app.engine.reliability_weibull import WeibullReliabilityEngine
from app.engine.multi_agent_consensus import MultiAgentConsensusProtocol
from app.engine.industry_adapter import IndustryAdapterEngine, IndustryProfile
from app.models.schemas import (
    WhyNotEvaluation, CatalogHealthMetrics, HITLReviewItem,
    ProductRevisionHistoryItem, SourceDiscoveryReport, CategoryOntologySchema,
    GroundTruthEvaluationReport
)
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/advanced", tags=["Advanced Engineering Intelligence"])

@router.get("/industries", response_model=List[IndustryProfile])
async def get_all_industry_profiles():
    return IndustryAdapterEngine.get_all_industries()

@router.post("/industries/synthesize")
async def synthesize_any_industry_schema(payload: Dict[str, Any]):
    ind_name = payload.get("industry_name", "Cryogenic LNG & Gas Distribution")
    cat_name = payload.get("category_name", "Cryogenic Butterfly Valve")
    standards = payload.get("governing_standards", ["ISO 28921-1", "BS 6364 Cryogenic Testing", "ASME B16.34"])
    return IndustryAdapterEngine.generate_custom_ontology_for_any_industry(ind_name, cat_name, standards)

@router.get("/neuro-symbolic")
async def get_neuro_symbolic_proof(product_type: str = "3-Phase Induction Motor"):
    return NeuroSymbolicReasoner.generate_symbolic_proof(product_type)

@router.get("/dpp")
async def get_digital_product_passport(part_number: str = "M3BP 160MLA 4", manufacturer: str = "ABB"):
    return DigitalProductPassportEngine.generate_dpp_passport(part_number, manufacturer)

@router.post("/weibull")
async def calculate_weibull_reliability(payload: Dict[str, Any]):
    beta = float(payload.get("beta_shape_factor", 1.85))
    eta = float(payload.get("eta_characteristic_life_hrs", 65000.0))
    temp = float(payload.get("ambient_temp_c", 40.0))
    thd = float(payload.get("vfd_harmonic_thd_percent", 3.0))
    return WeibullReliabilityEngine.calculate_weibull_prognostics(beta, eta, temp, thd)

@router.get("/multi-agent")
async def get_multi_agent_consensus(part_number: str = "M3BP 160MLA 4", manufacturer: str = "ABB"):
    return MultiAgentConsensusProtocol.run_agent_consensus(part_number, manufacturer)

@router.get("/benchmark-report", response_model=GroundTruthEvaluationReport)
async def get_ground_truth_benchmark_report():
    return BenchmarkEvaluatorEngine.get_ground_truth_report()

@router.get("/sources/{part_number}", response_model=SourceDiscoveryReport)
async def get_discovered_sources(part_number: str, manufacturer: str = "ABB"):
    return SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

@router.get("/ontology/{category_name}", response_model=CategoryOntologySchema)
async def get_category_ontology_schema(category_name: str):
    return ProductOntologyEngine.get_schema_for_category(category_name)

@router.get("/interchange/{part_number}")
async def get_interchange_equivalents(part_number: str):
    matches = CrossReferenceEngine.find_equivalents(part_number)
    return {
        "query_part_number": part_number,
        "equivalents_found": len(matches),
        "matches": matches
    }

@router.post("/why-not", response_model=WhyNotEvaluation)
async def evaluate_why_not(payload: Dict[str, Any]):
    base_id = payload.get("base_product_id", "prod_abb_m3bp_160")
    candidate_part = payload.get("candidate_part_number", "132S 5.5KW")
    candidate_mfg = payload.get("candidate_manufacturer", "Alternative OEM")
    
    base_prod = CATALOG.get(base_id, list(CATALOG.values())[0])
    return WhyNotEngine.evaluate_alternative(base_prod.dict(), candidate_part, candidate_mfg)

@router.get("/catalog-health", response_model=CatalogHealthMetrics)
async def get_catalog_health_metrics():
    return CatalogHealthEngine.get_catalog_metrics()

@router.get("/hitl/queue", response_model=List[HITLReviewItem])
async def get_hitl_review_queue():
    return CatalogHealthEngine.get_hitl_queue()

@router.post("/hitl/update", response_model=HITLReviewItem)
async def update_hitl_review(payload: Dict[str, Any]):
    item_id = payload.get("item_id")
    action = payload.get("action", "APPROVE")
    override_val = payload.get("override_value")
    reason = payload.get("reason", "Approved by Lead Plant Engineer")
    return CatalogHealthEngine.update_hitl_item(item_id, action, override_val, reason)

@router.get("/history/{part_number}", response_model=List[ProductRevisionHistoryItem])
async def get_product_revision_history(part_number: str):
    return TemporalHistoryEngine.get_revision_history(part_number)

@router.post("/curves/motor")
async def generate_motor_curves(payload: Dict[str, Any]):
    kw = float(payload.get("rated_power_kw", 7.5))
    rpm = float(payload.get("rated_speed_rpm", 1465))
    sync = float(payload.get("sync_speed_rpm", 1500))
    curr = float(payload.get("rated_current_a", 14.2))
    return EngineeringCurvesSimulator.generate_motor_torque_curve(kw, rpm, sync, curr)

@router.post("/curves/bearing-life")
async def calculate_bearing_fatigue_life(payload: Dict[str, Any]):
    c_kn = float(payload.get("dynamic_load_c_kn", 14.8))
    fr_kn = float(payload.get("radial_load_fr_kn", 2.5))
    fa_kn = float(payload.get("axial_load_fa_kn", 0.5))
    rpm = float(payload.get("speed_rpm", 1465))
    b_type = str(payload.get("bearing_type", "ball"))
    return EngineeringCurvesSimulator.calculate_bearing_life(c_kn, fr_kn, fa_kn, rpm, b_type)

@router.post("/curves/pump-qh")
async def generate_pump_qh(payload: Dict[str, Any]):
    q = float(payload.get("nominal_flow_m3h", 10.0))
    h = float(payload.get("nominal_head_m", 65.0))
    h0 = float(payload.get("shutoff_head_m", 78.0))
    return EngineeringCurvesSimulator.generate_pump_qh_curve(q, h, h0)

@router.post("/compliance/check")
async def check_compliance(payload: Dict[str, Any]):
    category = payload.get("category", "Industrial Motor")
    zone = payload.get("target_zone", "Zone 1 (Gas / Flammable Vapors)")
    gas = payload.get("target_gas_group", "IIC (Hydrogen / Acetylene)")
    temp = payload.get("target_temp_class", "T4 (135°C)")
    washdown = bool(payload.get("is_washdown_required", False))
    return ComplianceEngine.validate_hazardous_compliance(category, zone, gas, temp, washdown)
