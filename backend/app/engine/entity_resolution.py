import re
from typing import Dict, Any, List, Tuple

class EntityResolutionEngine:
    @staticmethod
    def clean_part_number(part_no: str) -> str:
        if not part_no:
            return ""
        # Uppercase, remove special separators except alphanumeric
        cleaned = re.sub(r'[^A-Za-z0-9]', '', part_no).upper()
        return cleaned

    @classmethod
    def match_products(cls, input_part: str, candidate_part: str) -> Dict[str, Any]:
        c1 = cls.clean_part_number(input_part)
        c2 = cls.clean_part_number(candidate_part)
        
        if c1 == c2:
            return {
                "match_type": "EXACT_CANONICAL_MATCH",
                "confidence": 1.0,
                "is_same_product": True,
                "is_variant": False,
                "reasoning": f"Cleaned part numbers '{c1}' and '{c2}' are identical."
            }
            
        # Check if one is prefix of other (e.g., base code vs variant suffix)
        if c1.startswith(c2) or c2.startswith(c1):
            return {
                "match_type": "PRODUCT_VARIANT_MATCH",
                "confidence": 0.88,
                "is_same_product": True,
                "is_variant": True,
                "reasoning": f"One part number is a specific variant or packaging sub-designation of the parent model."
            }

        # Fuzzy character overlap
        set1, set2 = set(c1), set(c2)
        jaccard = len(set1 & set2) / max(len(set1 | set2), 1)
        
        if jaccard > 0.8 and len(c1) > 4:
            return {
                "match_type": "PROBABLE_TYPO_OR_SERIES_SIBLING",
                "confidence": round(jaccard, 2),
                "is_same_product": False,
                "is_variant": True,
                "reasoning": f"High character similarity ({jaccard:.2f}) indicates related series family or minor delimiter discrepancy."
            }
            
        return {
            "match_type": "DISTINCT_PRODUCTS",
            "confidence": 0.1,
            "is_same_product": False,
            "is_variant": False,
            "reasoning": "Substantially distinct part numbers."
        }
