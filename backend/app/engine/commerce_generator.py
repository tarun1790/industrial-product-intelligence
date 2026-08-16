from typing import Dict, Any, List
from app.models.schemas import CommerceListing, Product

class CommerceGenerator:
    @classmethod
    def generate_commerce_profile(
        cls,
        part_number: str,
        manufacturer: str,
        category: str,
        product_family: str,
        attributes: Dict[str, Any]
    ) -> CommerceListing:
        # Extract key descriptors
        power = cls._get_attr_str(attributes, ["rated_power", "motor_power"])
        voltage = cls._get_attr_str(attributes, ["rated_voltage"])
        freq = cls._get_attr_str(attributes, ["rated_frequency"])
        eff = cls._get_attr_str(attributes, ["efficiency_class"])
        ip = cls._get_attr_str(attributes, ["ip_rating"])
        rpm = cls._get_attr_str(attributes, ["rated_speed_rpm"])
        bore = cls._get_attr_str(attributes, ["bore_diameter"])
        od = cls._get_attr_str(attributes, ["outer_diameter"])
        head = cls._get_attr_str(attributes, ["head_nominal"])
        flow = cls._get_attr_str(attributes, ["flow_rate_nominal"])
        
        # Build Title
        if category == "Industrial Motor":
            specs_snippet = []
            if power: specs_snippet.append(power)
            if eff: specs_snippet.append(eff)
            specs_snippet.append("Three-Phase Industrial AC Motor")
            if voltage: specs_snippet.append(f"{voltage}")
            if rpm: specs_snippet.append(f"{rpm}")
            title = f"{manufacturer} {' '.join(specs_snippet)} – {part_number}"
            subtitle = f"High-efficiency industrial cast-iron motor engineered for continuous severe duty."
            features = [
                f"Premium {eff or 'IE3'} Efficiency for reduced lifecycle energy costs",
                f"Robust {ip or 'IP55'} ingress protection against dust and water jets",
                f"Rated for {voltage or '400/415V'} @ {freq or '50 Hz'} operation with Class F insulation",
                f"Precision balanced rotor achieving ultra-low vibration levels per ISO 10816",
                "Compatible with variable frequency drives (VFD) for precision speed regulation"
            ]
            apps = [
                "Heavy-duty Centrifugal Pumps & Compressors",
                "Industrial Conveyors & Material Handling",
                "HVAC Blowers & Ventilation Systems",
                "Mining, Aggregate & Cement Processing",
                "Chemical & Petrochemical Continuous Processing"
            ]
            keywords = ["three-phase motor", "IE3 motor", manufacturer.lower(), part_number.lower(), "industrial drive", "ABB motor", "Siemens motor", "415V motor"]
            hsn = "85015200"

        elif category == "Rolling Bearing":
            title = f"{manufacturer} Deep Groove Ball Bearing {part_number} ({bore or ''}x{od or ''}mm)"
            subtitle = "High-precision single row deep groove ball bearing with premium steel rings."
            features = [
                f"Optimized internal geometry for high dynamic load capacity",
                f"Precision contact seals (2RSH/2RS) retaining premium synthetic grease",
                "Low friction torque design supporting high limiting speeds",
                "Dimensional tolerance compliant with ISO 492 Normal class"
            ]
            apps = ["Electric Motor End-shields", "Gearboxes & Transmissions", "Pumps & Turbines", "Agricultural Machinery"]
            keywords = ["ball bearing", "SKF bearing", part_number.lower(), "6205 bearing", "deep groove", "rotary bearing"]
            hsn = "84821000"

        elif category == "Centrifugal Pump":
            title = f"{manufacturer} High-Pressure Vertical Multistage Centrifugal Pump {part_number}"
            subtitle = f"Inline multistage pump capable of {head or '50m'} head and {flow or '10 m³/h'} nominal flow."
            features = [
                "Stainless steel 316/304 impellers and stage chambers for corrosion resistance",
                "Cartridge mechanical shaft seal allowing quick on-site maintenance",
                "High hydraulic efficiency with robust cast-iron base",
                "Suitable for clean, thin, non-aggressive and non-explosive liquids"
            ]
            apps = ["Boiler Feed & Condensate Systems", "Water Treatment & RO Plants", "Industrial High-Pressure Washing", "Commercial Building Pressure Boosting"]
            keywords = ["centrifugal pump", "multistage pump", manufacturer.lower(), part_number.lower(), "water pump", "Grundfos pump"]
            hsn = "84137000"

        else:
            title = f"{manufacturer} {category} – Model {part_number}"
            subtitle = f"Engineered industrial component certified to international standards."
            features = [
                "Heavy-duty industrial grade construction",
                "High reliability under continuous operation",
                "Certified compliance with international engineering standards"
            ]
            apps = ["Industrial Automation", "Process Manufacturing", "OEM Equipment Integration"]
            keywords = [category.lower(), manufacturer.lower(), part_number.lower()]
            hsn = "84000000"

        short_desc = (
            f"The {manufacturer} {part_number} is a premier {category.lower()} designed for rigorous industrial environments. "
            f"Featuring exceptional build quality and verified technical tolerances, this component delivers uninterrupted uptime and peak operational efficiency."
        )

        # JSON-LD Schema
        json_ld = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": title,
            "image": [f"https://catalog.productiq.io/assets/{part_number.lower()}.jpg"],
            "description": short_desc,
            "mpn": part_number,
            "brand": {
                "@type": "Brand",
                "name": manufacturer
            },
            "category": category,
            "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
            },
            "additionalProperty": [
                {"@type": "PropertyValue", "name": k, "value": str(v.get("display_value", v.get("raw_value", "")) if isinstance(v, dict) else v)}
                for k, v in attributes.items() if v
            ]
        }

        return CommerceListing(
            title=title,
            subtitle=subtitle,
            short_description=short_desc,
            key_features=features,
            applications=apps,
            target_industries=["Manufacturing", "Mining & Metals", "Energy & Utilities", "Food & Beverage", "Chemical Processing"],
            seo_meta_title=f"{title} | Buy Industrial Specs & CAD",
            seo_meta_description=short_desc[:155],
            seo_keywords=keywords,
            json_ld_schema=json_ld,
            canonical_category=category,
            hsn_unspsc_code=hsn
        )

    @staticmethod
    def _get_attr_str(attrs: Dict[str, Any], keys: List[str]) -> str:
        for k in keys:
            if k in attrs and attrs[k]:
                val = attrs[k]
                if isinstance(val, dict):
                    return str(val.get("display_value") or val.get("raw_value") or "")
                return str(val)
        return ""
