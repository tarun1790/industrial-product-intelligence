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
from app.engine.system_assembly_simulator import SystemAssemblySimulatorEngine, SystemAssemblyRequest, SystemAssemblyReport
from app.engine.rfq_generator import AutonomousRFQEngine, RFQResponse
from app.engine.vision_ocr import VisionOCREngine, VisionDocumentReport
from app.engine.enterprise_integrations import EnterpriseIntegrationEngine, WebhookDispatchPayload, WebhookDispatchResult
from app.engine.iot_telemetry import IoTTelemetryTwinEngine, SensorTelemetryPacket
from app.engine.cad_dimension_extractor import CADDimensionEngine, CADBlueprintReport
from app.engine.graph_reasoning import KnowledgeGraphReasoningEngine, KnowledgeGraphReasoningReport
from app.engine.compliance_auditor import RegulatoryAuditorEngine, ComplianceAuditCertificate
from app.engine.bayesian_fusion import BayesianFusionEngine, BayesianFusionReport
from app.engine.self_healing_ontology import SelfHealingOntologyEngine, SelfHealingOntologyReport
from app.engine.thermal_fem_surrogate import ThermalFEMSurrogateEngine, ThermalFEMReport
from app.engine.chemical_corrosion_matrix import ChemicalCorrosionEngine, ChemicalCompatibilityReport
from app.engine.tco_carbon_optimizer import TCOCarbonOptimizerEngine, TCOComparisonResult
from app.engine.plc_code_generator import PLCCodeGeneratorEngine, PLCCodePackage
from app.engine.fft_vibration_diagnostics import FFTVibrationDiagnosticsEngine, FFTSpectralReport
from app.engine.supplier_negotiation_warroom import SupplierNegotiationWarRoomEngine, SupplierNegotiationWarRoomReport
from app.engine.circular_dismantle_tree import CircularDismantleEngine, CircularDismantleReport
from app.models.schemas import (
    WhyNotEvaluation, CatalogHealthMetrics, HITLReviewItem,
    ProductRevisionHistoryItem, SourceDiscoveryReport, CategoryOntologySchema,
    GroundTruthEvaluationReport
)
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/advanced", tags=["Advanced Engineering Intelligence"])

@router.get("/automation/plc-code", response_model=PLCCodePackage)
async def get_synthesized_plc_code(part_number: str = "M3BP 160MLA 4", target_brand: str = "Siemens S7-1500"):
    return PLCCodeGeneratorEngine.synthesize_plc_code(part_number, target_brand)

@router.get("/diagnostics/fft-vibration", response_model=FFTSpectralReport)
async def get_fft_vibration_diagnostics(part_number: str = "M3BP 160MLA 4", running_rpm: float = 1465.0, bearing_model: str = "SKF 6309 C3"):
    return FFTVibrationDiagnosticsEngine.compute_fft_spectral_diagnostics(part_number, running_rpm, bearing_model)

@router.post("/procurement/war-room", response_model=SupplierNegotiationWarRoomReport)
async def run_procurement_war_room(payload: Dict[str, Any]):
    part = payload.get("part_number", "M3BP 160MLA 4")
    qty = int(payload.get("quantity", 10))
    msrp = float(payload.get("baseline_msrp", 2850.0))
    return SupplierNegotiationWarRoomEngine.run_sourcing_war_room(part, qty, msrp)

@router.get("/sustainability/dismantle-tree", response_model=CircularDismantleReport)
async def get_circular_dismantle_tree(part_number: str = "M3BP 160MLA 4"):
    return CircularDismantleEngine.generate_dismantle_tree(part_number)

@router.get("/ontology/self-healing", response_model=SelfHealingOntologyReport)
async def get_self_healing_ontology_report():
    return SelfHealingOntologyEngine.audit_and_repair_schemas()

@router.post("/physics/thermal-fem", response_model=ThermalFEMReport)
async def simulate_thermal_fem(payload: Dict[str, Any]):
    part = payload.get("part_number", "M3BP 160MLA 4")
    ambient = float(payload.get("ambient_temp_c", 40.0))
    load = float(payload.get("load_factor_pct", 85.0))
    return ThermalFEMSurrogateEngine.simulate_thermal_distribution(part, ambient, load)

@router.post("/chemical/corrosion", response_model=ChemicalCompatibilityReport)
async def evaluate_chemical_corrosion(payload: Dict[str, str]):
    part = payload.get("part_number", "LKH-10/140")
    material = payload.get("base_material", "AISI 316L Electropolished")
    elastomer = payload.get("elastomer", "EPDM FDA")
    return ChemicalCorrosionEngine.evaluate_chemical_compatibility(part, material, elastomer)

@router.post("/finance/tco-carbon", response_model=TCOComparisonResult)
async def calculate_tco_carbon_roi(payload: Dict[str, Any]):
    part = payload.get("part_number", "M3BP 160MLA 4")
    power = float(payload.get("rated_power_kw", 7.5))
    hours = int(payload.get("annual_operating_hours", 6000))
    tariff = float(payload.get("electricity_tariff_usd_kwh", 0.14))
    base_eff = float(payload.get("baseline_efficiency_pct", 87.7))
    opt_eff = float(payload.get("optimized_efficiency_pct", 90.4))
    capex = float(payload.get("initial_capex_premium_usd", 480.0))
    return TCOCarbonOptimizerEngine.calculate_tco_and_carbon_roi(part, power, hours, tariff, base_eff, opt_eff, capex)

@router.get("/cad/dimensions", response_model=CADBlueprintReport)
async def get_cad_dimensions(part_number: str = "M3BP 160MLA 4"):
    return CADDimensionEngine.extract_cad_dimensions(part_number)

@router.get("/graph/reasoning", response_model=KnowledgeGraphReasoningReport)
async def get_graph_reasoning_report(part_number: str = "M3BP 160MLA 4"):
    return KnowledgeGraphReasoningEngine.run_graph_reasoning(part_number)

@router.get("/compliance/audit", response_model=ComplianceAuditCertificate)
async def get_statutory_compliance_audit(part_number: str = "M3BP 160MLA 4", manufacturer: str = "ABB"):
    return RegulatoryAuditorEngine.run_statutory_audit(part_number, manufacturer)

@router.get("/bayesian/fusion", response_model=BayesianFusionReport)
async def get_bayesian_fusion_report(part_number: str = "M3BP 160MLA 4"):
    return BayesianFusionEngine.compute_bayesian_fusion(part_number)

@router.post("/integrations/dispatch", response_model=WebhookDispatchResult)
async def dispatch_enterprise_webhook(payload: WebhookDispatchPayload):
    return EnterpriseIntegrationEngine.dispatch_to_enterprise_system(payload)

@router.post("/iot/telemetry", response_model=SensorTelemetryPacket)
async def get_live_iot_telemetry(payload: Dict[str, Any]):
    part = payload.get("part_number", "M3BP 160MLA 4")
    ambient = float(payload.get("ambient_temp_c", 40.0))
    load = float(payload.get("load_factor_percent", 85.0))
    return IoTTelemetryTwinEngine.get_live_machine_telemetry(part, ambient, load)

@router.post("/rfq/generate", response_model=RFQResponse)
async def generate_autonomous_rfq(payload: Dict[str, str]):
    prompt = payload.get("prompt", "Corrosive chemical acid transfer skid with ATEX Zone 1 compliance")
    return AutonomousRFQEngine.generate_rfq_from_natural_language(prompt)

@router.get("/vision/inspect", response_model=VisionDocumentReport)
async def inspect_vision_datasheet(part_number: str = "M3BP 160MLA 4"):
    return VisionOCREngine.inspect_datasheet_vision(part_number)

@router.post("/system-assembly", response_model=SystemAssemblyReport)
async def simulate_system_assembly(payload: SystemAssemblyRequest):
    return SystemAssemblySimulatorEngine.simulate_inter_industry_assembly(payload)

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
    base_id = payload.get("base_product_id") or payload.get("base_part_number") or "prod_abb_m3bp_160"
    candidate_part = payload.get("candidate_part_number", "132S 5.5KW")
    candidate_mfg = payload.get("candidate_manufacturer", "Alternative OEM")
    
    base_prod = CATALOG.get(base_id)
    if not base_prod:
        # Search by part number
        for p in CATALOG.values():
            if p.part_number.upper() == str(base_id).upper() or str(base_id).upper() in p.part_number.upper():
                base_prod = p
                break
    if not base_prod and CATALOG:
        base_prod = list(CATALOG.values())[0]

    base_dict = base_prod.dict() if base_prod else {}
    return WhyNotEngine.evaluate_alternative(base_dict, candidate_part, candidate_mfg)

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
