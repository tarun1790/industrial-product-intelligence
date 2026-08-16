from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.engine.cross_reference import CrossReferenceEngine
from app.engine.curves_simulator import EngineeringCurvesSimulator
from app.engine.compliance import ComplianceEngine

router = APIRouter(prefix="/advanced", tags=["Advanced Engineering Intelligence"])

@router.get("/interchange/{part_number}")
async def get_interchange_equivalents(part_number: str):
    matches = CrossReferenceEngine.find_equivalents(part_number)
    return {
        "query_part_number": part_number,
        "equivalents_found": len(matches),
        "matches": matches
    }

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
