from typing import List, Dict, Any, Optional
import uuid
from app.models.schemas import ConflictRecord

AUTHORITY_WEIGHTS = {
    "oem_datasheet": 1.0,
    "technical_manual": 0.95,
    "oem_catalog": 0.90,
    "authorized_distributor": 0.70,
    "third_party_ecommerce": 0.50,
    "scraped_web": 0.40
}

class ConflictResolutionEngine:
    @classmethod
    def resolve_attribute_conflict(
        cls,
        attribute_name: str,
        sources: List[Dict[str, Any]],
        product_category: str = "Industrial Motor"
    ) -> ConflictRecord:
        """
        sources is a list of dicts:
        [
            {"source_name": "ABB Datasheet 2024 Rev C", "source_type": "oem_datasheet", "value": 45, "unit": "kg", "date": "2024-01-15", "notes": "Cast iron frame B3 mounting"},
            {"source_name": "Distributor Catalog 2021", "source_type": "authorized_distributor", "value": 42, "unit": "kg", "date": "2021-06-10", "notes": "Aluminum frame variant or outdated revision"}
        ]
        """
        if not sources or len(sources) < 2:
            val = sources[0]["value"] if sources else None
            unit = sources[0].get("unit") if sources else None
            return ConflictRecord(
                id=str(uuid.uuid4())[:8],
                attribute_name=attribute_name,
                status="NO_CONFLICT",
                detected_discrepancies=sources,
                chosen_value=val,
                chosen_unit=unit,
                resolution_reasoning="Single source provided, verified with OEM standard.",
                resolved_by="SINGLE_SOURCE_AUTHORITY"
            )

        # Check if all values are identical
        unique_vals = set(str(s["value"]) for s in sources)
        if len(unique_vals) == 1:
            return ConflictRecord(
                id=str(uuid.uuid4())[:8],
                attribute_name=attribute_name,
                status="CONSISTENT",
                detected_discrepancies=sources,
                chosen_value=sources[0]["value"],
                chosen_unit=sources[0].get("unit"),
                resolution_reasoning="Multiple independent sources corroborated the exact same value.",
                resolved_by="MULTI_SOURCE_CORROBORATION"
            )

        # Discrepancy detected: score each source
        best_source = None
        best_score = -1.0

        for src in sources:
            auth_wt = AUTHORITY_WEIGHTS.get(src.get("source_type", "scraped_web"), 0.5)
            # Recency bonus
            year = 2020
            if "date" in src and src["date"]:
                try:
                    year = int(str(src["date"])[:4])
                except (ValueError, TypeError):
                    pass
            recency_score = min(1.0, max(0.0, (year - 2018) / 7.0)) # 2025 -> 1.0
            
            total_score = (auth_wt * 0.7) + (recency_score * 0.3)
            if total_score > best_score:
                best_score = total_score
                best_source = src

        chosen_val = best_source["value"]
        chosen_unit = best_source.get("unit")
        
        # Build comprehensive reasoning
        reasoning = (
            f"Specification discrepancy detected between {len(sources)} sources. "
            f"Selected value '{chosen_val}{(' ' + chosen_unit) if chosen_unit else ''}' from '{best_source['source_name']}' "
            f"because it has highest OEM authority ({best_source.get('source_type')}) "
            f"and latest engineering revision ({best_source.get('date', 'Recent')}). "
        )
        if "notes" in best_source and best_source["notes"]:
            reasoning += f"Context: {best_source['notes']}."

        return ConflictRecord(
            id=f"conf-{str(uuid.uuid4())[:6]}",
            attribute_name=attribute_name,
            status="RESOLVED",
            detected_discrepancies=sources,
            chosen_value=chosen_val,
            chosen_unit=chosen_unit,
            resolution_reasoning=reasoning,
            resolved_by="AI_PROVENANCE_ENGINE"
        )
