from fastapi import APIRouter
from app.models.schemas import KnowledgeGraphData
from app.engine.knowledge_graph import KnowledgeGraphEngine
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])

@router.get("", response_model=KnowledgeGraphData)
async def get_knowledge_graph():
    prods = list(CATALOG.values())
    return KnowledgeGraphEngine.build_graph_from_products(prods)
