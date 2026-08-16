from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class EvidenceItem(BaseModel):
    id: str
    attribute_name: str
    raw_value: str
    source_type: str = Field(description="datasheet_pdf, web_catalog, nameplate_image, technical_manual, supplier_feed")
    source_name: str
    source_uri: Optional[str] = None
    page_number: Optional[int] = None
    bounding_box: Optional[Dict[str, float]] = None # {x0, y0, x1, y1}
    snippet: Optional[str] = None
    confidence: float = Field(default=0.95, ge=0.0, le=1.0)
    extracted_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    source_authority_score: float = Field(default=1.0, ge=0.0, le=1.0) # 1.0 for OEM, 0.7 for distributor

class AttributeValue(BaseModel):
    name: str
    display_name: str
    raw_value: Any
    unit: Optional[str] = None
    normalized_value: Optional[float] = None
    normalized_unit: Optional[str] = None
    is_standardized: bool = True
    confidence: float = 0.95
    is_missing: bool = False
    is_enriched: bool = False
    evidence_ids: List[str] = []

class ConflictRecord(BaseModel):
    id: str
    attribute_name: str
    status: str = Field(default="RESOLVED", description="DETECTED, RESOLVED, MANUAL_REVIEW_NEEDED")
    detected_discrepancies: List[Dict[str, Any]] # list of {source, value, date, authority}
    chosen_value: Any
    chosen_unit: Optional[str] = None
    resolution_reasoning: str
    resolved_by: str = "AI_REVISION_AUTHORITY_ENGINE"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ValidationIssue(BaseModel):
    id: str
    severity: str = Field(description="ERROR, WARNING, INFO")
    category: str = Field(description="PHYSICS_ELECTRICAL, THERMAL_LIMIT, LOAD_SPEED, IP_RATING, STANDARDS_COMPLIANCE")
    title: str
    message: str
    affected_attributes: List[str]
    suggested_correction: Optional[str] = None
    is_physics_violation: bool = False

class EngineeringSanityCheck(BaseModel):
    passed: bool
    formula_tested: str
    calculated_value: Optional[str] = None
    stated_value: Optional[str] = None
    discrepancy_percentage: Optional[float] = None
    details: str

class CommerceListing(BaseModel):
    title: str
    subtitle: str
    short_description: str
    key_features: List[str]
    applications: List[str]
    target_industries: List[str]
    seo_meta_title: str
    seo_meta_description: str
    seo_keywords: List[str]
    json_ld_schema: Dict[str, Any]
    canonical_category: str
    hsn_unspsc_code: Optional[str] = None

class Product(BaseModel):
    id: str
    part_number: str
    clean_part_number: str
    manufacturer: str
    product_family: str
    category: str # "Industrial Motor", "Rolling Bearing", "Centrifugal Pump", "Pneumatic Actuator", "Circuit Breaker", "Industrial Sensor"
    series: Optional[str] = None
    title: str
    status: str = "VERIFIED" # "RAW", "ENRICHED", "VERIFIED", "CONFLICT_FLAGGED"
    trust_score: float = Field(default=96.5, ge=0.0, le=100.0) # Can I trust this product?
    
    attributes: Dict[str, AttributeValue] = {}
    missing_attributes: List[str] = []
    enriched_attributes: List[str] = []
    
    evidence_trail: List[EvidenceItem] = []
    conflicts: List[ConflictRecord] = []
    validation_issues: List[ValidationIssue] = []
    engineering_checks: List[EngineeringSanityCheck] = []
    
    compatible_products: List[str] = []
    replacement_for: List[str] = []
    mating_components: List[str] = []
    
    commerce: Optional[CommerceListing] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class IngestionRequest(BaseModel):
    input_type: str = Field(description="part_number, raw_text, web_url, datasheet_pdf, image_nameplate")
    content: Optional[str] = None # text or part # or URL
    category_hint: Optional[str] = None
    manufacturer_hint: Optional[str] = None

class SearchQueryRequest(BaseModel):
    query: str
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    min_power_kw: Optional[float] = None
    max_power_kw: Optional[float] = None
    voltage_v: Optional[float] = None
    phase: Optional[int] = None
    efficiency_class: Optional[str] = None
    bore_mm: Optional[float] = None

class KnowledgeGraphNode(BaseModel):
    id: str
    label: str
    group: str # "product", "manufacturer", "category", "family", "standard", "accessory"
    title: Optional[str] = None
    value: Optional[int] = 1

class KnowledgeGraphEdge(BaseModel):
    from_node: str
    to_node: str
    label: str # "MANUFACTURED_BY", "BELONGS_TO", "REPLACES", "COMPATIBLE_WITH", "MATES_WITH", "COMPLIES_WITH"
    arrows: str = "to"

class KnowledgeGraphData(BaseModel):
    nodes: List[KnowledgeGraphNode]
    edges: List[KnowledgeGraphEdge]
