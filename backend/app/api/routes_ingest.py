from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import IngestionRequest, Product
from app.engine.extractor import MultiModalExtractor
from app.engine.pdf_parser import LivePDFParserEngine
from app.api.routes_products import CATALOG

router = APIRouter(prefix="/ingest", tags=["Ingestion & Extraction"])

@router.post("/part-number", response_model=Product)
async def ingest_part_number(payload: IngestionRequest):
    content = payload.content or "M3BP 160MLA 4"
    prod = MultiModalExtractor.extract_from_part_number(content, payload.manufacturer_hint)
    CATALOG[prod.id] = prod
    return prod

@router.post("/text", response_model=Product)
async def ingest_raw_text(payload: IngestionRequest):
    content = payload.content or ""
    prod = MultiModalExtractor.extract_from_text(content, payload.category_hint)
    CATALOG[prod.id] = prod
    return prod

@router.post("/upload-datasheet", response_model=Product)
async def upload_datasheet_document(payload: Dict[str, str]):
    filename = payload.get("filename", "custom_oem_datasheet.pdf")
    content = payload.get("content_text", "")
    prod = LivePDFParserEngine.parse_uploaded_datasheet(filename, content)
    CATALOG[prod.id] = prod
    return prod
