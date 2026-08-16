import re
from typing import List, Dict, Any, Optional
from app.models.schemas import Product, SearchQueryRequest

class IndustrialSearchEngine:
    @classmethod
    def parse_natural_language_query(cls, query: str) -> Dict[str, Any]:
        params: Dict[str, Any] = {
            "category": None,
            "min_power_kw": None,
            "max_power_kw": None,
            "voltage_v": None,
            "phase": None,
            "efficiency_class": None,
            "ip_rating": None,
            "bore_mm": None,
            "manufacturer": None
        }
        
        q_lower = query.lower()

        # Category detection
        if any(w in q_lower for w in ["motor", "induction motor", "electric motor"]):
            params["category"] = "Industrial Motor"
        elif any(w in q_lower for w in ["bearing", "ball bearing", "roller bearing"]):
            params["category"] = "Rolling Bearing"
        elif any(w in q_lower for w in ["pump", "centrifugal pump", "multistage"]):
            params["category"] = "Centrifugal Pump"
        elif any(w in q_lower for w in ["breaker", "mcb", "mccb", "circuit breaker"]):
            params["category"] = "Circuit Breaker"

        # Manufacturer detection
        for mfg in ["ABB", "Siemens", "SKF", "Grundfos", "Schneider", "Festo", "Fluke", "Timken", "Danfoss", "WEG"]:
            if mfg.lower() in q_lower:
                params["manufacturer"] = mfg
                break

        # Power range: "5-10 kW", "5 to 10kw", "7.5 kW"
        range_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:kw|kilowatt)', q_lower)
        if range_match:
            params["min_power_kw"] = float(range_match.group(1))
            params["max_power_kw"] = float(range_match.group(2))
        else:
            single_power = re.search(r'(\d+(?:\.\d+)?)\s*(?:kw|kilowatt)', q_lower)
            if single_power:
                val = float(single_power.group(1))
                params["min_power_kw"] = val * 0.9
                params["max_power_kw"] = val * 1.1

        # Voltage: "415 V", "400v", "230V"
        volt_match = re.search(r'(\d{3,4})\s*(?:v|volt)', q_lower)
        if volt_match:
            params["voltage_v"] = float(volt_match.group(1))

        # Phase: "three phase", "3-phase", "3 phase", "single phase", "1-phase"
        if any(w in q_lower for w in ["three phase", "3-phase", "3 phase", "3ph"]):
            params["phase"] = 3
        elif any(w in q_lower for w in ["single phase", "1-phase", "1 phase", "1ph"]):
            params["phase"] = 1

        # Efficiency: "ie3", "ie4", "ie2"
        eff_match = re.search(r'ie\s*([1-5])', q_lower)
        if eff_match:
            params["efficiency_class"] = f"IE{eff_match.group(1)}"

        # Bore diameter: "25 mm", "25mm bore"
        bore_match = re.search(r'(\d+(?:\.\d+)?)\s*mm(?:\s*bore)?', q_lower)
        if bore_match and params["category"] == "Rolling Bearing":
            params["bore_mm"] = float(bore_match.group(1))

        # IP Rating: "ip55", "ip66"
        ip_match = re.search(r'ip\s*([0-9]{2})', q_lower)
        if ip_match:
            params["ip_rating"] = f"IP{ip_match.group(1)}"

        return params

    @classmethod
    def search_catalog(
        cls,
        products: List[Product],
        query: str,
        filters: Optional[SearchQueryRequest] = None
    ) -> List[Dict[str, Any]]:
        parsed = cls.parse_natural_language_query(query)
        
        # Override with explicit filters if supplied
        if filters:
            if filters.category: parsed["category"] = filters.category
            if filters.manufacturer: parsed["manufacturer"] = filters.manufacturer
            if filters.min_power_kw is not None: parsed["min_power_kw"] = filters.min_power_kw
            if filters.max_power_kw is not None: parsed["max_power_kw"] = filters.max_power_kw
            if filters.voltage_v is not None: parsed["voltage_v"] = filters.voltage_v
            if filters.phase is not None: parsed["phase"] = filters.phase
            if filters.efficiency_class: parsed["efficiency_class"] = filters.efficiency_class
            if filters.bore_mm is not None: parsed["bore_mm"] = filters.bore_mm

        results = []
        tokens = set(re.findall(r'\w+', query.lower()))

        for p in products:
            score = 0.0
            reasons = []

            # Category filter
            if parsed["category"]:
                if p.category.lower() == parsed["category"].lower():
                    score += 30.0
                    reasons.append(f"Category matched '{p.category}'")
                else:
                    continue # Hard filter

            # Manufacturer
            if parsed["manufacturer"]:
                if parsed["manufacturer"].lower() in p.manufacturer.lower():
                    score += 25.0
                    reasons.append(f"OEM matched '{p.manufacturer}'")
                else:
                    continue

            # Power range match
            p_power = cls._extract_num(p.attributes.get("rated_power")) or cls._extract_num(p.attributes.get("motor_power"))
            if p_power is not None:
                if parsed["min_power_kw"] is not None and parsed["max_power_kw"] is not None:
                    if parsed["min_power_kw"] <= p_power <= parsed["max_power_kw"]:
                        score += 30.0
                        reasons.append(f"Power {p_power} kW within requested {parsed['min_power_kw']}–{parsed['max_power_kw']} kW range")
                    else:
                        score -= 20.0

            # Voltage match
            p_volt = cls._extract_num(p.attributes.get("rated_voltage"))
            if p_volt is not None and parsed["voltage_v"] is not None:
                if abs(p_volt - parsed["voltage_v"]) <= 20: # 400V vs 415V compatibility
                    score += 20.0
                    reasons.append(f"Rated voltage {p_volt}V compatible with {parsed['voltage_v']}V system")

            # Efficiency match
            p_eff_obj = p.attributes.get("efficiency_class")
            p_eff = ""
            if p_eff_obj:
                if hasattr(p_eff_obj, "raw_value"):
                    p_eff = str(p_eff_obj.raw_value or "")
                elif isinstance(p_eff_obj, dict):
                    p_eff = str(p_eff_obj.get("display_value") or p_eff_obj.get("raw_value") or "")
                else:
                    p_eff = str(p_eff_obj)

            if parsed["efficiency_class"] and parsed["efficiency_class"].upper() in p_eff.upper():
                score += 15.0
                reasons.append(f"Efficiency class {p_eff} matches requirement")

            # Bore diameter match
            p_bore = cls._extract_num(p.attributes.get("bore_diameter"))
            if p_bore is not None and parsed["bore_mm"] is not None:
                if abs(p_bore - parsed["bore_mm"]) < 0.1:
                    score += 35.0
                    reasons.append(f"Exact bore size {p_bore} mm")

            # General token overlap
            p_text = f"{p.part_number} {p.manufacturer} {p.title} {p.product_family} {' '.join(p.compatible_products)}".lower()
            overlap = sum(1 for t in tokens if t in p_text)
            score += overlap * 5.0

            # Add trust score weighting
            score += (p.trust_score * 0.1)

            results.append({
                "product": p,
                "relevance_score": round(max(0.0, score), 1),
                "matched_criteria": reasons,
                "parsed_intent": parsed
            })

        results.sort(key=lambda r: r["relevance_score"], reverse=True)
        return results

    @staticmethod
    def _extract_num(attr: Any) -> Optional[float]:
        if not attr:
            return None
        if isinstance(attr, (int, float)):
            return float(attr)
        if isinstance(attr, dict):
            if attr.get("normalized_value") is not None:
                return float(attr["normalized_value"])
            if attr.get("raw_value") is not None:
                try:
                    return float(attr["raw_value"])
                except (ValueError, TypeError):
                    pass
        return None
