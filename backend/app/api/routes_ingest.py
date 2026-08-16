from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Dict, Any, List
from app.models.schemas import IngestionRequest, Product, ConflictRecord
from app.engine.extractor import MultiModalExtractor
from app.engine.conflict_resolver import ConflictResolutionEngine

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

@router.post("/part-number", response_model=Product)
async def ingest_part_number(req: IngestionRequest):
    if not req.content:
        raise HTTPException(status_code=400, detail="Part number or description is required.")
    product = MultiModalExtractor.extract_from_part_number(req.content)
    return product

@router.post("/pdf", response_model=Product)
async def ingest_pdf(
    file: UploadFile = File(...),
    category_hint: Optional[str] = Form(None),
    manufacturer_hint: Optional[str] = Form(None)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF document.")
    contents = await file.read()
    product = MultiModalExtractor.extract_from_pdf(contents, file.filename)
    return product

@router.post("/text", response_model=Product)
async def ingest_text(req: IngestionRequest):
    if not req.content:
        raise HTTPException(status_code=400, detail="Text content is required.")
    product = MultiModalExtractor.extract_from_text(req.content)
    return product

@router.post("/resolve-conflict", response_model=ConflictRecord)
async def resolve_conflict_endpoint(payload: Dict[str, Any]):
    attr_name = payload.get("attribute_name", "weight")
    sources = payload.get("sources", [])
    category = payload.get("category", "Industrial Motor")
    return ConflictResolutionEngine.resolve_attribute_conflict(attr_name, sources, category)
