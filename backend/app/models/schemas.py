from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ProductIdentityFingerprint(BaseModel):
    manufacturer: str
    base_part_number: str
    product_family: str
    frame_size: Optional[str] = None
    variant_suffix: Optional[str] = None
    mounting_configuration: Optional[str] = None
    rated_voltage_class: Optional[str] = None
    rated_frequency: Optional[str] = None
    identity_hash: str
    fingerprint_confidence: float = 1.0

class EvidenceQualityBreakdown(BaseModel):
    source_authority_score: float = Field(default=100.0, ge=0.0, le=100.0) # 25% weight
    source_recency_score: float = Field(default=90.0, ge=0.0, le=100.0)     # 20% weight
    product_identity_match: float = Field(default=100.0, ge=0.0, le=100.0)   # 20% weight
    cross_source_agreement: float = Field(default=85.0, ge=0.0, le=100.0)   # 15% weight
    physics_validation_score: float = Field(default=100.0, ge=0.0, le=100.0)# 20% weight
    total_eqs: float = Field(default=95.5, ge=0.0, le=100.0)
    evidence_status: str = Field(default="VERIFIED", description="VERIFIED, PROBABLE, CONDITIONAL, CONFLICTING, UNVERIFIED, NOT_FOUND")

class TruthTableEntry(BaseModel):
    attribute_name: str
    display_name: str
    extracted_raw: str
    normalized_canonical: str
    validation_status: str = Field(description="PASSED, FAILED, WARNING, NOT_APPLICABLE")
    evidence_source_type: str = Field(description="OEM_DATASHEET, DISTRIBUTOR_CATALOG, TECHNICAL_MANUAL, INFERRED")
    evidence_source_name: str
    uncertainty_tier: str = Field(description="VERIFIED, PROBABLE, CONDITIONAL, CONFLICTING, UNVERIFIED, NOT_FOUND")
    eqs_score: float
    decision_reason: str
    is_final_approved: bool = True

class ConflictReasoningStep(BaseModel):
    step_number: int
    step_name: str
    check_passed: bool
    details: str

class ConflictRecord(BaseModel):
    id: str
    attribute_name: str
    status: str = Field(default="RESOLVED", description="DETECTED, RESOLVED, MANUAL_REVIEW_NEEDED")
    detected_discrepancies: List[Dict[str, Any]] # list of {source, value, date, authority}
    chosen_value: Any
    chosen_unit: Optional[str] = None
    reasoning_chain: List[ConflictReasoningStep] = []
    resolution_reasoning: str
    resolved_by: str = "AI_REVISION_AUTHORITY_ENGINE"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ProductRevisionHistoryItem(BaseModel):
    year: int
    revision_code: str
    published_date: str
    document_name: str
    spec_delta: Dict[str, Any]
    superseded: bool
    engineering_notes: str

class WhyNotEvaluation(BaseModel):
    candidate_part_number: str
    candidate_manufacturer: str
    interchange_tier: str = Field(description="EXACT_EQUIVALENT, FUNCTIONAL_EQUIVALENT, CONDITIONAL_EQUIVALENT, SIMILAR, REJECTED")
    overall_fit_score: float
    verdict: str = Field(description="RECOMMENDED, CONDITIONAL, NOT_RECOMMENDED")
    matched_criteria: List[str]
    rejected_criteria: List[Dict[str, str]] # {parameter, failure_reason}
    summary_verdict: str

class HITLReviewItem(BaseModel):
    id: str
    product_id: str
    part_number: str
    manufacturer: str
    attribute_name: str
    conflict_values: List[Dict[str, Any]]
    suggested_value: Any
    confidence_level: str = "NEEDS_HUMAN_SIGN_OFF"
    review_status: str = "PENDING_REVIEW" # "PENDING_REVIEW", "APPROVED", "OVERRIDDEN"
    assigned_engineer: Optional[str] = "Chief Plant Engineer"
    reviewed_at: Optional[str] = None
    override_reason: Optional[str] = None

class CatalogHealthMetrics(BaseModel):
    total_products_processed: int
    verified_count: int
    needs_review_count: int
    conflicting_count: int
    missing_attributes_count: int
    average_completeness_percent: float
    duplicate_rate_percent: float
    avg_processing_time_sec: float
    manual_baseline_time_min: float
    accuracy_precision: float
    accuracy_recall: float
    conflict_resolution_accuracy: float

class EvidenceItem(BaseModel):
    id: str
    attribute_name: str
    raw_value: str
    source_type: str
    source_name: str
    source_uri: Optional[str] = None
    page_number: Optional[int] = None
    bounding_box: Optional[Dict[str, float]] = None
    snippet: Optional[str] = None
    confidence: float = 0.95
    source_authority_score: float = 1.0
    extracted_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

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
    uncertainty_tier: str = "VERIFIED" # VERIFIED, PROBABLE, CONDITIONAL, CONFLICTING, UNVERIFIED, NOT_FOUND
    evidence_quality: Optional[EvidenceQualityBreakdown] = None
    provenance_decision_reason: Optional[str] = None

class ValidationIssue(BaseModel):
    id: str
    severity: str
    category: str
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
    category: str
    industry: str = "Power Transmission & Heavy Machinery"
    series: Optional[str] = None
    title: str
    status: str = "VERIFIED"
    trust_score: float = Field(default=96.5, ge=0.0, le=100.0)
    
    fingerprint: Optional[ProductIdentityFingerprint] = None
    attributes: Dict[str, AttributeValue] = {}
    truth_table: List[TruthTableEntry] = []
    revision_history: List[ProductRevisionHistoryItem] = []
    
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
    input_type: str
    content: Optional[str] = None
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
    group: str
    title: Optional[str] = None
    value: Optional[int] = 1

class KnowledgeGraphEdge(BaseModel):
    from_node: str
    to_node: str
    label: str
    arrows: str = "to"

class KnowledgeGraphData(BaseModel):
    nodes: List[KnowledgeGraphNode]
    edges: List[KnowledgeGraphEdge]
