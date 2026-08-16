import re
import hashlib
from typing import Dict, Any, Optional
from app.models.schemas import ProductIdentityFingerprint

class ProductIdentityEngine:
    @classmethod
    def generate_fingerprint(
        cls,
        part_number: str,
        manufacturer: str,
        category: str = "Industrial Motor"
    ) -> ProductIdentityFingerprint:
        p_clean = part_number.strip().upper()
        mfg_clean = manufacturer.strip().upper()
        
        family = "GENERAL_INDUSTRIAL"
        frame = None
        variant = None
        mounting = "IM B3 (Foot Mount)"
        voltage = "400/415V"
        freq = "50Hz"

        if "M3BP" in p_clean:
            family = "M3BP Process Performance"
            frame = "160M"
            variant = "MLA-4"
        elif "1LE1" in p_clean:
            family = "SIMOTICS GP 1LE1"
            frame = "160M"
            variant = "1DB2"
        elif "W22" in p_clean:
            family = "W22 Super Premium"
            frame = "132M"
            variant = "IE4"
        elif "6205" in p_clean:
            family = "Deep Groove Ball Bearings"
            frame = "25x52x15mm"
            variant = "2RSH / 2RS"
            mounting = "Radial Shaft Mount"
            voltage = "N/A"
            freq = "N/A"
        elif "CR " in p_clean:
            family = "CR Multistage Pumps"
            frame = "DN 40"
            variant = "10-06"
            mounting = "Vertical Inline"
        elif "3RV" in p_clean:
            family = "SIRIUS 3RV2"
            frame = "Size S00"
            variant = "16A"
            mounting = "DIN Rail 35mm"
        elif "GV3" in p_clean:
            family = "TeSys GV3"
            frame = "Size 3"
            variant = "65A"
            mounting = "DIN Rail 35mm"

        # Construct deterministic hash
        raw_seed = f"{mfg_clean}|{family}|{p_clean}|{frame}|{variant}|{voltage}|{freq}"
        hash_digest = hashlib.sha256(raw_seed.encode()).hexdigest()[:16]

        return ProductIdentityFingerprint(
            manufacturer=manufacturer,
            base_part_number=part_number,
            product_family=family,
            frame_size=frame,
            variant_suffix=variant,
            mounting_configuration=mounting,
            rated_voltage_class=voltage,
            rated_frequency=freq,
            identity_hash=f"fp_{hash_digest}",
            fingerprint_confidence=1.0
        )
