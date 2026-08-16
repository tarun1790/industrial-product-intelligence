from typing import List, Dict, Any, Optional

# Multi-Industry Cross-Reference Master Interchange Database
INTERCHANGE_DATABASE: Dict[str, List[Dict[str, Any]]] = {
    # Bearings Cross-Reference
    "SKF 6205-2RSH": [
        {
            "target_part_number": "6205-2RS",
            "target_manufacturer": "Timken",
            "interchange_type": "DIRECT_DROP_IN_100",
            "fit_score": 100.0,
            "dimensions_match": "Exact: 25x52x15 mm",
            "dynamic_load_variance": "-5.4% (14.0 kN vs 14.8 kN)",
            "speed_limit_variance": "-16.6% (15000 RPM vs 18000 RPM)",
            "sealing_match": "Contact NBR Rubber Seals (2RS)",
            "clearance": "Normal (CN)",
            "engineering_verdict": "Fully interchangeable drop-in replacement for standard industrial conveyor and motor applications."
        },
        {
            "target_part_number": "6205 DDU",
            "target_manufacturer": "NSK",
            "interchange_type": "DIRECT_DROP_IN_100",
            "fit_score": 99.5,
            "dimensions_match": "Exact: 25x52x15 mm",
            "dynamic_load_variance": "+1.3% (15.0 kN vs 14.8 kN)",
            "speed_limit_variance": "Exact (18000 RPM)",
            "sealing_match": "Full Contact DDU Rubber Seals",
            "clearance": "Normal (CN)",
            "engineering_verdict": "Premium drop-in equivalent with matching high-speed thermal threshold."
        },
        {
            "target_part_number": "6205.2RSR",
            "target_manufacturer": "Schaeffler FAG",
            "interchange_type": "DIRECT_DROP_IN_100",
            "fit_score": 100.0,
            "dimensions_match": "Exact: 25x52x15 mm",
            "dynamic_load_variance": "Exact (14.8 kN)",
            "speed_limit_variance": "Exact (18000 RPM)",
            "sealing_match": "2RSR Nitrile Lip Seals",
            "clearance": "Normal (CN)",
            "engineering_verdict": "Identical ISO 15 dimensional and load rating equivalence."
        }
    ],
    # Motors Cross-Reference
    "M3BP 160MLA 4": [
        {
            "target_part_number": "1LE1003-1DB22-2AA4",
            "target_manufacturer": "Siemens",
            "interchange_type": "FUNCTIONAL_EQUIVALENT",
            "fit_score": 96.0,
            "dimensions_match": "IEC Frame 160M (Shaft Ø 42mm, Keyway 12x8mm)",
            "power_match": "Direct: 11.0 kW / 7.5 kW equivalent frame envelope",
            "efficiency_match": "IE3 Premium Efficiency (91.4% vs 90.4%)",
            "mounting_match": "IM B3 Foot Mount (H=160mm, A=254mm, B=210mm)",
            "engineering_verdict": "Direct mechanical foot-mount drop-in replacement with higher efficiency and identical shaft height."
        },
        {
            "target_part_number": "W22-7.5KW-4P-IE3",
            "target_manufacturer": "WEG",
            "interchange_type": "DIRECT_DROP_IN_100",
            "fit_score": 98.5,
            "dimensions_match": "IEC Frame 132M / 160M Cast Iron",
            "power_match": "Exact 7.5 kW (10 HP) @ 50 Hz",
            "efficiency_match": "IE3 Premium Efficiency (90.4%)",
            "mounting_match": "Standard IEC IM B3 Foot Mount",
            "engineering_verdict": "Cast iron heavy-duty severe duty interchangeable motor with matching terminal box orientation."
        }
    ],
    # Pumps Cross-Reference
    "CR 10-06 A-FJ-A-E-HQQE": [
        {
            "target_part_number": "Durco Mark 3 ANSI 3x2-8",
            "target_manufacturer": "Flowserve",
            "interchange_type": "PROCESS_UPGRADE_EQUIVALENT",
            "fit_score": 91.0,
            "dimensions_match": "Requires suction/discharge piping flange adapter (DN 40 -> DN 50/80)",
            "flow_head_match": "Matches & exceeds 10-45 m³/h @ 65-75m head",
            "material_match": "Upgrade: 316SS / Hastelloy vs Standard 304SS",
            "engineering_verdict": "High-pressure chemical grade replacement offering extended mean time between maintenance (MTBF)."
        }
    ],
    # Breakers Cross-Reference
    "3RV2011-4AA10": [
        {
            "target_part_number": "GV3P65",
            "target_manufacturer": "Schneider Electric",
            "interchange_type": "FUNCTIONAL_EQUIVALENT",
            "fit_score": 94.0,
            "dimensions_match": "Standard 35mm DIN Rail Mount",
            "breaking_capacity": "Upgrade: 100 kA vs 50 kA Icu",
            "thermal_range": "Adjustable motor overload trip unit",
            "engineering_verdict": "Direct electrical motor protector drop-in with superior short-circuit interrupting capacity."
        }
    ]
}

class CrossReferenceEngine:
    @classmethod
    def find_equivalents(cls, part_number: str) -> List[Dict[str, Any]]:
        clean_query = part_number.strip().upper()
        
        # Exact lookup
        for key, matches in INTERCHANGE_DATABASE.items():
            if key.upper() in clean_query or clean_query in key.upper():
                return matches

        # Fuzzy series fallback
        if "6205" in clean_query:
            return INTERCHANGE_DATABASE["SKF 6205-2RSH"]
        elif "M3BP" in clean_query or "160" in clean_query or "MOTOR" in clean_query:
            return INTERCHANGE_DATABASE["M3BP 160MLA 4"]
        elif "CR " in clean_query or "PUMP" in clean_query:
            return INTERCHANGE_DATABASE["CR 10-06 A-FJ-A-E-HQQE"]
        elif "3RV" in clean_query or "BREAKER" in clean_query:
            return INTERCHANGE_DATABASE["3RV2011-4AA10"]

        return []
