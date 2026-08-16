import re
from typing import Tuple, Optional, Any, Dict

UNIT_CONVERSIONS = {
    # Power to kW
    "power": {
        "kw": 1.0,
        "kilowatt": 1.0,
        "kilowatts": 1.0,
        "w": 0.001,
        "watt": 0.001,
        "watts": 0.001,
        "hp": 0.745699872,
        "horsepower": 0.745699872,
        "mw": 1000.0
    },
    # Length to mm
    "length": {
        "mm": 1.0,
        "millimeter": 1.0,
        "millimeters": 1.0,
        "cm": 10.0,
        "centimeter": 10.0,
        "m": 1000.0,
        "meter": 1000.0,
        "in": 25.4,
        "inch": 25.4,
        "inches": 25.4,
        "\"": 25.4
    },
    # Force to kN
    "force": {
        "kn": 1.0,
        "kilonewton": 1.0,
        "n": 0.001,
        "newton": 0.001,
        "lbf": 0.00444822,
        "lbs": 0.00444822
    },
    # Weight to kg
    "weight": {
        "kg": 1.0,
        "kilogram": 1.0,
        "kilograms": 1.0,
        "g": 0.001,
        "gram": 0.001,
        "grams": 0.001,
        "lb": 0.453592,
        "lbs": 0.453592,
        "pound": 0.453592,
        "pounds": 0.453592
    },
    # Pressure to bar
    "pressure": {
        "bar": 1.0,
        "mpa": 10.0,
        "kpa": 0.01,
        "pa": 0.00001,
        "psi": 0.0689476
    },
    # Flow to m3/h
    "flow": {
        "m3/h": 1.0,
        "m³/h": 1.0,
        "l/min": 0.06,
        "lpm": 0.06,
        "gpm": 0.2271247
    },
    # Electrical
    "voltage": {
        "v": 1.0,
        "volt": 1.0,
        "volts": 1.0,
        "kv": 1000.0,
        "mv": 0.001
    },
    "current": {
        "a": 1.0,
        "amp": 1.0,
        "amps": 1.0,
        "ampere": 1.0,
        "ma": 0.001,
        "ka": 1000.0
    }
}

class IndustrialNormalizer:
    @staticmethod
    def extract_numeric_and_unit(text: str) -> Tuple[Optional[float], Optional[str]]:
        if text is None:
            return None, None
        if isinstance(text, (int, float)):
            return float(text), None
            
        clean = str(text).strip().replace(',', '.')
        # Match pattern: number followed by optional whitespace and unit
        match = re.match(r'^([\d\.\s/]+)\s*([a-zA-Z°³µ\/\"\'-]+)?$', clean)
        if match:
            num_str = match.group(1).strip()
            unit_str = match.group(2).strip() if match.group(2) else None
            try:
                # Handle fraction like 1/2 or simple float
                if '/' in num_str:
                    parts = num_str.split('/')
                    val = float(parts[0]) / float(parts[1])
                else:
                    val = float(num_str)
                return val, unit_str
            except ValueError:
                pass
        return None, None

    @classmethod
    def normalize_attribute(cls, attr_name: str, raw_val: Any) -> Dict[str, Any]:
        if raw_val is None:
            return {"raw_value": None, "normalized_value": None, "normalized_unit": None, "display_value": "N/A"}
            
        str_val = str(raw_val).strip()
        
        # Special String Normalizations
        if "ip_rating" in attr_name.lower():
            match = re.search(r'IP\s*(\d{2}[A-Z]?)', str_val, re.IGNORECASE)
            if match:
                canon = f"IP{match.group(1).upper()}"
                return {"raw_value": str_val, "normalized_value": None, "normalized_unit": None, "display_value": canon}
        
        if "efficiency_class" in attr_name.lower():
            match = re.search(r'IE\s*([1-5])', str_val, re.IGNORECASE)
            if match:
                canon = f"IE{match.group(1)}"
                return {"raw_value": str_val, "normalized_value": None, "normalized_unit": None, "display_value": canon}
            if "premium" in str_val.lower():
                return {"raw_value": str_val, "normalized_value": None, "normalized_unit": None, "display_value": "IE3"}

        val, unit = cls.extract_numeric_and_unit(str_val)
        if val is None:
            return {"raw_value": str_val, "normalized_value": None, "normalized_unit": None, "display_value": str_val}

        # Check unit group
        unit_lower = unit.lower() if unit else ""
        
        # Power conversion -> canonical kW
        if any(k in attr_name.lower() for k in ["power", "kw", "watt", "hp"]):
            multiplier = UNIT_CONVERSIONS["power"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_kw = round(val * multiplier, 4)
                return {
                    "raw_value": str_val,
                    "unit": unit or "kW",
                    "normalized_value": norm_kw,
                    "normalized_unit": "kW",
                    "display_value": f"{norm_kw} kW"
                }

        # Length / Dimensions -> canonical mm
        if any(k in attr_name.lower() for k in ["bore", "diameter", "width", "height", "stroke", "dimension", "length"]):
            multiplier = UNIT_CONVERSIONS["length"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_mm = round(val * multiplier, 3)
                return {
                    "raw_value": str_val,
                    "unit": unit or "mm",
                    "normalized_value": norm_mm,
                    "normalized_unit": "mm",
                    "display_value": f"{norm_mm} mm"
                }

        # Weight -> canonical kg
        if "weight" in attr_name.lower():
            multiplier = UNIT_CONVERSIONS["weight"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_kg = round(val * multiplier, 2)
                return {
                    "raw_value": str_val,
                    "unit": unit or "kg",
                    "normalized_value": norm_kg,
                    "normalized_unit": "kg",
                    "display_value": f"{norm_kg} kg"
                }

        # Load / Force -> canonical kN
        if any(k in attr_name.lower() for k in ["load", "force", "dynamic_load", "static_load"]):
            multiplier = UNIT_CONVERSIONS["force"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_kn = round(val * multiplier, 3)
                return {
                    "raw_value": str_val,
                    "unit": unit or "kN",
                    "normalized_value": norm_kn,
                    "normalized_unit": "kN",
                    "display_value": f"{norm_kn} kN"
                }

        # Pressure -> canonical bar
        if "pressure" in attr_name.lower() or "head" in attr_name.lower():
            multiplier = UNIT_CONVERSIONS["pressure"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_bar = round(val * multiplier, 2)
                return {
                    "raw_value": str_val,
                    "unit": unit or "bar",
                    "normalized_value": norm_bar,
                    "normalized_unit": "bar",
                    "display_value": f"{norm_bar} bar"
                }

        # Voltage -> canonical V
        if "voltage" in attr_name.lower():
            multiplier = UNIT_CONVERSIONS["voltage"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_v = round(val * multiplier, 1)
                return {
                    "raw_value": str_val,
                    "unit": unit or "V",
                    "normalized_value": norm_v,
                    "normalized_unit": "V",
                    "display_value": f"{norm_v} V"
                }

        # Current -> canonical A
        if "current" in attr_name.lower():
            multiplier = UNIT_CONVERSIONS["current"].get(unit_lower, 1.0 if not unit_lower else None)
            if multiplier:
                norm_a = round(val * multiplier, 2)
                return {
                    "raw_value": str_val,
                    "unit": unit or "A",
                    "normalized_value": norm_a,
                    "normalized_unit": "A",
                    "display_value": f"{norm_a} A"
                }

        # Default fallback
        return {
            "raw_value": str_val,
            "unit": unit or "",
            "normalized_value": val,
            "normalized_unit": unit or "",
            "display_value": f"{val} {unit}".strip() if unit else str(val)
        }
