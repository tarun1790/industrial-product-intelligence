from fastapi import APIRouter
from typing import List, Dict, Any
from app.models.schemas import SearchQueryRequest
from app.engine.search_engine import IndustrialSearchEngine
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/search", tags=["Search"])

@router.post("/parametric")
async def parametric_search(req: SearchQueryRequest):
    prods = list(CATALOG.values())
    results = IndustrialSearchEngine.search_catalog(prods, req.query, req)
    return {
        "query": req.query,
        "total_matches": len(results),
        "results": results
    }
