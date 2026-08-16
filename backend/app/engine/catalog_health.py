from typing import List, Dict, Any
from app.models.schemas import CatalogHealthMetrics, HITLReviewItem
from datetime import datetime

# Simulated In-Memory HITL Review Queue
HITL_QUEUE: List[HITLReviewItem] = [
    HITLReviewItem(
        id="hitl_01",
        product_id="prod_abb_m3bp_160",
        part_number="M3BP 160MLA 4",
        manufacturer="ABB",
        attribute_name="weight",
        conflict_values=[
            {"source": "ABB OEM Datasheet 2024 Rev C", "value": 45, "unit": "kg", "authority": "OEM_1.0"},
            {"source": "Distributor Catalog 2021", "value": 42, "unit": "kg", "authority": "DIST_0.7"}
        ],
        suggested_value="45 kg",
        confidence_level="NEEDS_HUMAN_SIGN_OFF",
        review_status="PENDING_REVIEW",
        assigned_engineer="Lead Mechanical Engineer"
    ),
    HITLReviewItem(
        id="hitl_02",
        product_id="prod_skf_6205",
        part_number="6205-2RSH",
        manufacturer="SKF",
        attribute_name="limiting_speed_rpm",
        conflict_values=[
            {"source": "SKF Master Catalog PUB 17000", "value": 18000, "unit": "RPM", "authority": "OEM_1.0"},
            {"source": "Bearing Supply Web", "value": 15000, "unit": "RPM", "authority": "DIST_0.6"}
        ],
        suggested_value="18000 RPM (Grease Contact)",
        confidence_level="NEEDS_HUMAN_SIGN_OFF",
        review_status="PENDING_REVIEW",
        assigned_engineer="Senior Tribologist"
    ),
    HITLReviewItem(
        id="hitl_03",
        product_id="prod_grundfos_cr10",
        part_number="CR 10-06",
        manufacturer="Grundfos",
        attribute_name="max_operating_pressure",
        conflict_values=[
            {"source": "Grundfos CR Product Guide 2024", "value": 16, "unit": "bar", "authority": "OEM_1.0"},
            {"source": "Third-Party Spec Table", "value": 25, "unit": "bar", "authority": "DIST_0.5"}
        ],
        suggested_value="16 bar (Standard Oval Flange)",
        confidence_level="NEEDS_HUMAN_SIGN_OFF",
        review_status="PENDING_REVIEW",
        assigned_engineer="Hydraulic Systems Specialist"
    )
]

class CatalogHealthEngine:
    @classmethod
    def get_catalog_metrics(cls) -> CatalogHealthMetrics:
        return CatalogHealthMetrics(
            total_products_processed=12482,
            verified_count=9842,
            needs_review_count=1238,
            conflicting_count=742,
            missing_attributes_count=660,
            average_completeness_percent=91.4,
            duplicate_rate_percent=4.2,
            avg_processing_time_sec=42.0,
            manual_baseline_time_min=18.0,
            accuracy_precision=97.8,
            accuracy_recall=95.4,
            conflict_resolution_accuracy=94.2
        )

    @classmethod
    def get_hitl_queue(cls) -> List[HITLReviewItem]:
        return HITL_QUEUE

    @classmethod
    def update_hitl_item(
        cls,
        item_id: str,
        action: str, # "APPROVE", "OVERRIDE"
        override_value: Any = None,
        reason: str = "Approved by Chief Engineer"
    ) -> HITLReviewItem:
        for item in HITL_QUEUE:
            if item.id == item_id:
                item.review_status = "APPROVED" if action == "APPROVE" else "OVERRIDDEN"
                if override_value:
                    item.suggested_value = override_value
                item.override_reason = reason
                item.reviewed_at = datetime.utcnow().isoformat()
                return item
        return HITL_QUEUE[0]
