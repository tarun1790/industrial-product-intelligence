from fastapi import APIRouter, HTTPException, Response
from typing import List, Optional, Dict, Any
from app.models.schemas import Product
from app.seed_data.benchmark_data import get_benchmark_catalog

router = APIRouter(prefix="/products", tags=["Products"])

# In-memory product store initialized with benchmarks
CATALOG: Dict[str, Product] = {p.id: p for p in get_benchmark_catalog()}

@router.get("", response_model=List[Product])
async def list_products(category: Optional[str] = None, manufacturer: Optional[str] = None):
    prods = list(CATALOG.values())
    if category:
        prods = [p for p in prods if p.category.lower() == category.lower()]
    if manufacturer:
        prods = [p for p in prods if p.manufacturer.lower() == manufacturer.lower()]
    return prods

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    if product_id not in CATALOG:
        raise HTTPException(status_code=404, detail="Product not found.")
    return CATALOG[product_id]

@router.post("/compare")
async def compare_products(payload: Dict[str, List[str]]):
    product_ids = payload.get("product_ids", [])
    if not product_ids or len(product_ids) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 products to compare.")
    
    selected: List[Product] = []
    for pid in product_ids:
        if pid in CATALOG:
            selected.append(CATALOG[pid])
            
    if len(selected) < 2:
        raise HTTPException(status_code=404, detail="Could not find specified products.")

    # Generate AI trade-off synthesis
    names = [f"{p.manufacturer} {p.part_number}" for p in selected]
    summary = (
        f"Comparative Analysis between {len(selected)} industrial components ({', '.join(names)}). "
        f"Key trade-offs identify differences in efficiency rating, structural weight, torque density, and mechanical enclosure ratings. "
    )
    if any(p.category == "Industrial Motor" for p in selected):
        summary += "For severe-duty continuous pump or conveyor loads, higher efficiency (IE3/IE4) with Class F insulation is recommended to reduce long-term TCO."
        
    return {
        "products": selected,
        "ai_tradeoff_summary": summary,
        "attribute_keys": list(set().union(*(p.attributes.keys() for p in selected)))
    }

@router.get("/{product_id}/export/{format_type}")
async def export_product(product_id: str, format_type: str):
    if product_id not in CATALOG:
        raise HTTPException(status_code=404, detail="Product not found.")
    prod = CATALOG[product_id]
    
    if format_type == "json-ld":
        return prod.commerce.json_ld_schema if prod.commerce else {}
    elif format_type == "json":
        return prod.dict()
    elif format_type == "csv":
        header = "Attribute,Raw Value,Normalized Value,Unit,Confidence\n"
        rows = []
        for k, v in prod.attributes.items():
            unit_str = v.unit or ""
            norm_str = str(v.normalized_value) if v.normalized_value is not None else str(v.raw_value)
            rows.append(f'"{k}","{v.raw_value}","{norm_str}","{unit_str}","{v.confidence}"')
        csv_content = header + "\n".join(rows)
        return Response(content=csv_content, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename={prod.clean_part_number}_specs.csv"})
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format_type}")
