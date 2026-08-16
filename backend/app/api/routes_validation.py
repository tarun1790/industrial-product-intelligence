from fastapi import APIRouter
from typing import Dict, Any
from app.engine.validator import EngineeringValidator

router = APIRouter(prefix="/validate", tags=["Validation Engine"])

@router.post("/engineering-check")
async def run_engineering_check(payload: Dict[str, Any]):
    category = payload.get("category", "Industrial Motor")
    attributes = payload.get("attributes", {})
    issues, checks, trust_score = EngineeringValidator.validate_product(category, attributes)
    return {
        "category": category,
        "trust_score": trust_score,
        "validation_issues": issues,
        "engineering_checks": checks
    }
