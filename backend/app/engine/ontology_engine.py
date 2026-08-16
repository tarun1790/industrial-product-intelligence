from typing import List, Dict, Any, Tuple
from app.models.schemas import CategoryOntologySchema, SchemaAttributeRequirement, SchemaCompletenessAudit, AttributeValue

# Master Category Schema Definitions
CATEGORY_SCHEMAS: Dict[str, CategoryOntologySchema] = {
    "Industrial Motor": CategoryOntologySchema(
        category_name="Industrial Motor",
        industry_sector="Power Transmission & Heavy Machinery",
        standard_governing_bodies=["IEC 60034-1", "IEC 60034-30-1", "NEMA MG 1"],
        expected_attributes_count=14,
        attributes_schema=[
            SchemaAttributeRequirement(attribute_name="manufacturer", display_name="Manufacturer", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="part_number", display_name="Part Number", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="product_family", display_name="Product Family", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="power_kw", display_name="Rated Output Power", group_name="Electrical", is_required=True, canonical_unit="kW", standard_reference="IEC 60034-1 §7"),
            SchemaAttributeRequirement(attribute_name="voltage_v", display_name="Rated Voltage", group_name="Electrical", is_required=True, canonical_unit="V", standard_reference="IEC 60038"),
            SchemaAttributeRequirement(attribute_name="current_a", display_name="Rated Full Load Current", group_name="Electrical", is_required=True, canonical_unit="A"),
            SchemaAttributeRequirement(attribute_name="frequency_hz", display_name="Supply Frequency", group_name="Electrical", is_required=True, canonical_unit="Hz"),
            SchemaAttributeRequirement(attribute_name="phase_count", display_name="Phase Count", group_name="Electrical", is_required=True),
            SchemaAttributeRequirement(attribute_name="efficiency_class", display_name="Efficiency Class", group_name="Electrical", is_required=True, standard_reference="IEC 60034-30-1"),
            SchemaAttributeRequirement(attribute_name="power_factor", display_name="Power Factor (cos φ)", group_name="Electrical", is_required=False, enrichment_rule="Inferred from IEC 60034 nominal table (0.82 for 7.5kW 4-pole)"),
            SchemaAttributeRequirement(attribute_name="speed_rpm", display_name="Nominal Full-Load Speed", group_name="Mechanical", is_required=True, canonical_unit="RPM"),
            SchemaAttributeRequirement(attribute_name="frame_size", display_name="IEC Frame Size", group_name="Mechanical", is_required=True, standard_reference="IEC 60072-1"),
            SchemaAttributeRequirement(attribute_name="mounting_type", display_name="Mounting Configuration", group_name="Mechanical", is_required=True, standard_reference="IEC 60034-7"),
            SchemaAttributeRequirement(attribute_name="weight_kg", display_name="Net Weight", group_name="Mechanical", is_required=True, canonical_unit="kg"),
            SchemaAttributeRequirement(attribute_name="ip_rating", display_name="Ingress Protection", group_name="Environmental", is_required=True, standard_reference="IEC 60034-5"),
            SchemaAttributeRequirement(attribute_name="insulation_class", display_name="Insulation Class", group_name="Environmental", is_required=True, standard_reference="IEC 60085"),
            SchemaAttributeRequirement(attribute_name="ambient_temp_max", display_name="Max Ambient Temperature", group_name="Environmental", is_required=False, canonical_unit="°C", enrichment_rule="Standard continuous rating 40°C per IEC 60034-1")
        ]
    ),
    "Rolling Bearing": CategoryOntologySchema(
        category_name="Rolling Bearing",
        industry_sector="Precision Motion & Tribology",
        standard_governing_bodies=["ISO 15", "ISO 281", "ISO 76", "DIN 625"],
        expected_attributes_count=10,
        attributes_schema=[
            SchemaAttributeRequirement(attribute_name="manufacturer", display_name="Manufacturer", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="part_number", display_name="Part Number", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="bearing_type", display_name="Bearing Type", group_name="Identity", is_required=True),
            SchemaAttributeRequirement(attribute_name="bore_diameter_mm", display_name="Bore Diameter (d)", group_name="Mechanical", is_required=True, canonical_unit="mm", standard_reference="ISO 15"),
            SchemaAttributeRequirement(attribute_name="outer_diameter_mm", display_name="Outer Diameter (D)", group_name="Mechanical", is_required=True, canonical_unit="mm", standard_reference="ISO 15"),
            SchemaAttributeRequirement(attribute_name="width_mm", display_name="Width (B)", group_name="Mechanical", is_required=True, canonical_unit="mm", standard_reference="ISO 15"),
            SchemaAttributeRequirement(attribute_name="dynamic_load_c_kn", display_name="Dynamic Load Rating (C)", group_name="Mechanical", is_required=True, canonical_unit="kN", standard_reference="ISO 281"),
            SchemaAttributeRequirement(attribute_name="static_load_c0_kn", display_name="Static Load Rating (C0)", group_name="Mechanical", is_required=True, canonical_unit="kN", standard_reference="ISO 76"),
            SchemaAttributeRequirement(attribute_name="limiting_speed_rpm", display_name="Limiting Speed (Grease)", group_name="Mechanical", is_required=True, canonical_unit="RPM"),
            SchemaAttributeRequirement(attribute_name="sealing_type", display_name="Sealing Enclosure", group_name="Environmental", is_required=True),
            SchemaAttributeRequirement(attribute_name="internal_clearance", display_name="Radial Internal Clearance", group_name="Mechanical", is_required=False, enrichment_rule="Default Normal Clearance (CN) per ISO 5753-1")
        ]
    )
}

class ProductOntologyEngine:
    @classmethod
    def get_schema_for_category(cls, category_name: str) -> CategoryOntologySchema:
        for k, v in CATEGORY_SCHEMAS.items():
            if k.upper() in category_name.upper() or category_name.upper() in k.upper():
                return v
        return CATEGORY_SCHEMAS["Industrial Motor"]

    @classmethod
    def audit_and_enrich_product(
        cls,
        category_name: str,
        current_attributes: Dict[str, Any]
    ) -> Tuple[SchemaCompletenessAudit, Dict[str, Any]]:
        schema = cls.get_schema_for_category(category_name)
        total_expected = len(schema.attributes_schema)
        
        extracted_keys = set(current_attributes.keys())
        missing_keys = []
        enriched_keys = []

        # Copy attributes dict
        enriched_attrs = dict(current_attributes)

        for req in schema.attributes_schema:
            k = req.attribute_name
            if k not in extracted_keys:
                if req.enrichment_rule:
                    # Enrich with domain rule
                    if k == "power_factor":
                        val_obj = AttributeValue(
                            name=k,
                            display_name=req.display_name,
                            group_name=req.group_name,
                            raw_value=0.82,
                            normalized_value=0.82,
                            is_enriched=True,
                            uncertainty_tier="PROBABLE",
                            provenance_decision_reason=f"Enriched via domain rule: {req.enrichment_rule}"
                        )
                        enriched_attrs[k] = val_obj
                        enriched_keys.append(k)
                    elif k == "ambient_temp_max":
                        val_obj = AttributeValue(
                            name=k,
                            display_name=req.display_name,
                            group_name=req.group_name,
                            raw_value=40,
                            unit="°C",
                            normalized_value=40.0,
                            normalized_unit="°C",
                            is_enriched=True,
                            uncertainty_tier="PROBABLE",
                            provenance_decision_reason=f"Enriched via domain rule: {req.enrichment_rule}"
                        )
                        enriched_attrs[k] = val_obj
                        enriched_keys.append(k)
                    elif k == "internal_clearance":
                        val_obj = AttributeValue(
                            name=k,
                            display_name=req.display_name,
                            group_name=req.group_name,
                            raw_value="CN (Normal)",
                            is_enriched=True,
                            uncertainty_tier="PROBABLE",
                            provenance_decision_reason=f"Enriched via domain rule: {req.enrichment_rule}"
                        )
                        enriched_attrs[k] = val_obj
                        enriched_keys.append(k)
                    else:
                        missing_keys.append(k)
                else:
                    missing_keys.append(k)

        found_count = len(extracted_keys)
        completeness = round(((found_count + len(enriched_keys)) / max(1, total_expected)) * 100.0, 1)

        audit = SchemaCompletenessAudit(
            total_expected=total_expected,
            extracted_found_count=found_count,
            missing_count=len(missing_keys),
            enriched_count=len(enriched_keys),
            completeness_percentage=min(100.0, completeness),
            missing_attribute_names=missing_keys,
            enriched_attribute_names=enriched_keys
        )

        return audit, enriched_attrs
