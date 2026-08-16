from typing import Dict, Any, List
import re
from app.models.schemas import (
    Product, AttributeValue, EvidenceItem, ProductIdentityFingerprint,
    SourceDiscoveryReport, SchemaCompletenessAudit
)
from app.models.ontology import CATEGORY_ONTOLOGY
from app.core.normalizer import IndustrialNormalizer
from app.engine.validator import EngineeringValidator
from app.engine.commerce_generator import CommerceGenerator
from app.engine.conflict_resolver import ConflictResolutionEngine
from app.engine.identity_fingerprint import ProductIdentityEngine
from app.engine.source_discovery import SourceDiscoveryEngine
from app.engine.ontology_engine import ProductOntologyEngine
from app.engine.evidence_quality import EvidenceQualityEngine
from app.engine.temporal_history import TemporalHistoryEngine

class MultiModalExtractor:
    @classmethod
    def extract_from_part_number(cls, part_number: str, manufacturer_hint: str = None) -> Product:
        clean_p = part_number.strip().upper()
        
        # 1. IDENTIFY
        if "6205" in clean_p or "BEARING" in clean_p:
            return cls._build_bearing_sample(part_number, manufacturer_hint or "SKF")
        else:
            return cls._build_motor_sample(part_number, manufacturer_hint or "ABB")

    @classmethod
    def extract_from_text(cls, text: str, category_hint: str = "Industrial Motor") -> Product:
        return cls._build_motor_sample("M3BP 160MLA 4", "ABB")

    @classmethod
    def _build_motor_sample(cls, part_number: str, manufacturer: str) -> Product:
        # 1. IDENTIFY: Fingerprint & Source Discovery
        fingerprint = ProductIdentityEngine.generate_fingerprint(part_number, manufacturer, "Industrial Motor")
        sources_report = SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

        # Raw Extracted Attributes
        raw_attributes = {
            "power_kw": AttributeValue(name="power_kw", display_name="Rated Output Power", group_name="Electrical", raw_value="7.5 kW", unit="kW", normalized_value=7.5, normalized_unit="kW", is_standardized=True, confidence=0.99, evidence_ids=["ev_m1"]),
            "voltage_v": AttributeValue(name="voltage_v", display_name="Rated Voltage", group_name="Electrical", raw_value="415 V", unit="V", normalized_value=415.0, normalized_unit="V", is_standardized=True, confidence=0.98, evidence_ids=["ev_m2"]),
            "current_a": AttributeValue(name="current_a", display_name="Rated Current (FLA)", group_name="Electrical", raw_value="14.2 A", unit="A", normalized_value=14.2, normalized_unit="A", is_standardized=True, confidence=0.96, evidence_ids=["ev_m3"]),
            "frequency_hz": AttributeValue(name="frequency_hz", display_name="Supply Frequency", group_name="Electrical", raw_value="50 Hz", unit="Hz", normalized_value=50.0, normalized_unit="Hz", is_standardized=True, confidence=0.99, evidence_ids=["ev_m4"]),
            "phase_count": AttributeValue(name="phase_count", display_name="Phase Count", group_name="Electrical", raw_value=3, is_standardized=True, confidence=1.0, evidence_ids=["ev_m5"]),
            "speed_rpm": AttributeValue(name="speed_rpm", display_name="Full Load Speed", group_name="Mechanical", raw_value="1465 RPM", unit="RPM", normalized_value=1465.0, normalized_unit="RPM", is_standardized=True, confidence=0.98, evidence_ids=["ev_m6"]),
            "efficiency_class": AttributeValue(name="efficiency_class", display_name="Efficiency Class", group_name="Electrical", raw_value="IE3 Premium", is_standardized=True, confidence=0.97, evidence_ids=["ev_m7"]),
            "efficiency_percentage": AttributeValue(name="efficiency_percentage", display_name="Efficiency %", group_name="Electrical", raw_value=90.4, unit="%", normalized_value=90.4, normalized_unit="%", is_standardized=True, confidence=0.95, evidence_ids=["ev_m8"]),
            "frame_size": AttributeValue(name="frame_size", display_name="Frame Size", group_name="Mechanical", raw_value="160M", is_standardized=True, confidence=0.99, evidence_ids=["ev_m9"]),
            "mounting_type": AttributeValue(name="mounting_type", display_name="Mounting Configuration", group_name="Mechanical", raw_value="IM B3 (Foot Mount)", is_standardized=True, confidence=0.98, evidence_ids=["ev_m10"]),
            "ip_rating": AttributeValue(name="ip_rating", display_name="Ingress Protection", group_name="Environmental", raw_value="IP55", is_standardized=True, confidence=0.99, evidence_ids=["ev_m11"]),
            "insulation_class": AttributeValue(name="insulation_class", display_name="Insulation Class", group_name="Environmental", raw_value="Class F", is_standardized=True, confidence=0.98, evidence_ids=["ev_m12"]),
            "weight_kg": AttributeValue(name="weight_kg", display_name="Net Weight", group_name="Mechanical", raw_value=45, unit="kg", normalized_value=45.0, normalized_unit="kg", is_standardized=True, confidence=0.95, evidence_ids=["ev_m13", "ev_m14"])
        }

        # 2. ENRICH: Category Ontology Schema Audit & Missing Attribute Inference
        schema_audit, enriched_attributes = ProductOntologyEngine.audit_and_enrich_product("Industrial Motor", raw_attributes)

        # Multi-Source Evidence Trail
        evidence = [
            EvidenceItem(id="ev_m1", attribute_name="power_kw", raw_value="7.5 kW", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=4, bounding_box={"x": 120, "y": 240, "w": 85, "h": 22}, snippet="Rated output: 7.5 kW (10 HP) at 50 Hz continuous duty S1 per IEC 60034-1", confidence=0.99, source_authority_score=1.0),
            EvidenceItem(id="ev_m2", attribute_name="voltage_v", raw_value="400-415 V", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=4, bounding_box={"x": 120, "y": 265, "w": 90, "h": 22}, snippet="Rated voltage: 400 V Delta / 690 V Star ±10% at 50 Hz", confidence=0.98, source_authority_score=1.0),
            EvidenceItem(id="ev_m3", attribute_name="current_a", raw_value="14.2 A", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=4, bounding_box={"x": 120, "y": 290, "w": 70, "h": 22}, snippet="Full load current IN = 14.2 A at 400 V rated voltage", confidence=0.96, source_authority_score=1.0),
            EvidenceItem(id="ev_m6", attribute_name="speed_rpm", raw_value="1465 r/min", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=4, bounding_box={"x": 120, "y": 315, "w": 95, "h": 22}, snippet="Nominal operating speed n = 1465 RPM at rated load (2.33% slip)", confidence=0.98, source_authority_score=1.0),
            EvidenceItem(id="ev_m7", attribute_name="efficiency_class", raw_value="IE3 Premium", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=2, bounding_box={"x": 450, "y": 110, "w": 110, "h": 28}, snippet="Efficiency class IE3 according to IEC 60034-30-1 with 90.4% nominal efficiency at 100% load", confidence=0.97, source_authority_score=1.0),
            EvidenceItem(id="ev_m13", attribute_name="weight_kg", raw_value="45 kg", source_type="oem_datasheet", source_name="ABB M3BP Primary Technical Datasheet Rev C (2024)", page_number=8, bounding_box={"x": 340, "y": 520, "w": 80, "h": 20}, snippet="Net weight: 45 kg (Cast iron stator and end shields for heavy duty applications)", confidence=0.99, source_authority_score=1.0),
            EvidenceItem(id="ev_m14", attribute_name="weight_kg", raw_value="42 kg", source_type="distributor_catalog", source_name="RS Components Catalog (2021 Edition)", page_number=142, bounding_box={"x": 210, "y": 480, "w": 75, "h": 20}, snippet="Product mass: 42 kg (Preliminary aluminum housing specification)", confidence=0.85, source_authority_score=0.7)
        ]

        # 3. VALIDATE: Engineering Consistency & Physics Rule Engine
        issues, checks, trust_score = EngineeringValidator.validate_product("Industrial Motor", enriched_attributes)

        # 4. PROVE: Multi-Source Conflict Resolution & 5-Step Reasoning Chain
        conflict = ConflictResolutionEngine.resolve_attribute_conflict(
            attribute_name="weight",
            sources=[
                {"source_name": "RS Components Catalog", "source_type": "authorized_distributor", "value": 42, "unit": "kg", "date": 2021, "authority_score": 0.70, "notes": "Legacy 2021 distributor listing"},
                {"source_name": "ABB Primary Datasheet Rev C", "source_type": "oem_datasheet", "value": 45, "unit": "kg", "date": 2024, "authority_score": 1.00, "notes": "Current active OEM specification with cast-iron frame"}
            ],
            product_category="Industrial Motor"
        )

        # Truth Table with Rule-Based Uncertainty States
        truth_table = EvidenceQualityEngine.generate_truth_table(enriched_attributes, evidence, [conflict], checks)
        history = TemporalHistoryEngine.get_revision_history("M3BP 160MLA 4")

        # Commerce Metadata
        commerce = CommerceGenerator.generate_commerce_profile(
            part_number="M3BP 160MLA 4",
            manufacturer="ABB",
            category="Industrial Motor",
            product_family="M3BP Process Performance",
            attributes=enriched_attributes
        )

        return Product(
            id="prod_abb_m3bp_160",
            part_number="M3BP 160MLA 4",
            clean_part_number="M3BP160MLA4",
            manufacturer="ABB",
            product_family="M3BP Process Performance",
            category="Industrial Motor",
            industry="Power Transmission & Heavy Machinery",
            series="M3BP Severe Duty",
            title="ABB 7.5 kW IE3 Process Performance Motor (M3BP 160MLA 4)",
            status="VERIFIED",
            trust_score=98.5,
            fingerprint=fingerprint,
            sources_discovered=sources_report,
            schema_audit=schema_audit,
            attributes=enriched_attributes,
            truth_table=truth_table,
            revision_history=history,
            missing_attributes=schema_audit.missing_attribute_names,
            enriched_attributes=schema_audit.enriched_attribute_names,
            evidence_trail=evidence,
            conflicts=[conflict],
            validation_issues=issues,
            engineering_checks=checks,
            compatible_products=["ABB ACS880 Industrial VFD", "ABB ACS580 General Machinery Drive"],
            replacement_for=["ABB M2BA 160MLA", "ABB M3AA 132MB"],
            mating_components=["SKF 6309-2Z/C3 Drive End Bearing", "SKF 6209-2Z Non-Drive End Bearing"],
            commerce=commerce
        )

    @classmethod
    def _build_bearing_sample(cls, part_number: str, manufacturer: str) -> Product:
        fingerprint = ProductIdentityEngine.generate_fingerprint(part_number, manufacturer, "Rolling Bearing")
        sources_report = SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

        raw_attributes = {
            "bore_diameter_mm": AttributeValue(name="bore_diameter_mm", display_name="Bore Diameter (d)", group_name="Mechanical", raw_value="25 mm", unit="mm", normalized_value=25.0, normalized_unit="mm", is_standardized=True, confidence=1.0, evidence_ids=["ev_b1"]),
            "outer_diameter_mm": AttributeValue(name="outer_diameter_mm", display_name="Outer Diameter (D)", group_name="Mechanical", raw_value="52 mm", unit="mm", normalized_value=52.0, normalized_unit="mm", is_standardized=True, confidence=1.0, evidence_ids=["ev_b2"]),
            "width_mm": AttributeValue(name="width_mm", display_name="Width (B)", group_name="Mechanical", raw_value="15 mm", unit="mm", normalized_value=15.0, normalized_unit="mm", is_standardized=True, confidence=1.0, evidence_ids=["ev_b3"]),
            "dynamic_load_c_kn": AttributeValue(name="dynamic_load_c_kn", display_name="Dynamic Load Rating (C)", group_name="Mechanical", raw_value="14.8 kN", unit="kN", normalized_value=14.8, normalized_unit="kN", is_standardized=True, confidence=0.98, evidence_ids=["ev_b4"]),
            "static_load_c0_kn": AttributeValue(name="static_load_c0_kn", display_name="Static Load Rating (C0)", group_name="Mechanical", raw_value="7.8 kN", unit="kN", normalized_value=7.8, normalized_unit="kN", is_standardized=True, confidence=0.98, evidence_ids=["ev_b5"]),
            "limiting_speed_rpm": AttributeValue(name="limiting_speed_rpm", display_name="Limiting Speed", group_name="Mechanical", raw_value="18000 RPM", unit="RPM", normalized_value=18000.0, normalized_unit="RPM", is_standardized=True, confidence=0.96, evidence_ids=["ev_b6"]),
            "sealing_type": AttributeValue(name="sealing_type", display_name="Sealing Enclosure", group_name="Environmental", raw_value="Contact NBR Rubber Seals (2RSH)", is_standardized=True, confidence=0.99, evidence_ids=["ev_b7"])
        }

        schema_audit, enriched_attributes = ProductOntologyEngine.audit_and_enrich_product("Rolling Bearing", raw_attributes)

        evidence = [
            EvidenceItem(id="ev_b1", attribute_name="bore_diameter_mm", raw_value="25 mm", source_type="oem_datasheet", source_name="SKF Master Catalog PUB 17000 (2024)", page_number=248, bounding_box={"x": 80, "y": 320, "w": 60, "h": 18}, snippet="Principal dimensions: d = 25 mm bore diameter per ISO 15", confidence=1.0, source_authority_score=1.0),
            EvidenceItem(id="ev_b4", attribute_name="dynamic_load_c_kn", raw_value="14.8 kN", source_type="oem_datasheet", source_name="SKF Master Catalog PUB 17000 (2024)", page_number=248, bounding_box={"x": 210, "y": 320, "w": 75, "h": 18}, snippet="Basic dynamic load rating C = 14.8 kN (Explorer class upgraded steel purity)", confidence=0.98, source_authority_score=1.0)
        ]

        issues, checks, trust_score = EngineeringValidator.validate_product("Rolling Bearing", enriched_attributes)
        truth_table = EvidenceQualityEngine.generate_truth_table(enriched_attributes, evidence, [], checks)
        history = TemporalHistoryEngine.get_revision_history("6205-2RSH")

        commerce = CommerceGenerator.generate_commerce_profile(
            part_number="6205-2RSH",
            manufacturer="SKF",
            category="Rolling Bearing",
            product_family="Explorer Deep Groove Ball Bearings",
            attributes=enriched_attributes
        )

        return Product(
            id="prod_skf_6205",
            part_number="6205-2RSH",
            clean_part_number="62052RSH",
            manufacturer="SKF",
            product_family="Explorer Deep Groove Ball Bearings",
            category="Rolling Bearing",
            industry="Precision Motion & Tribology",
            series="6200 Series",
            title="SKF 6205-2RSH Deep Groove Ball Bearing (25x52x15 mm)",
            status="VERIFIED",
            trust_score=100.0,
            fingerprint=fingerprint,
            sources_discovered=sources_report,
            schema_audit=schema_audit,
            attributes=enriched_attributes,
            truth_table=truth_table,
            revision_history=history,
            missing_attributes=schema_audit.missing_attribute_names,
            enriched_attributes=schema_audit.enriched_attribute_names,
            evidence_trail=evidence,
            conflicts=[],
            validation_issues=issues,
            engineering_checks=checks,
            compatible_products=["SKF Bearing Heater TIH 030M", "SKF LGMT 2 General Grease"],
            replacement_for=["FAG 6205.2RSR", "NSK 6205 DDU", "NTN 6205 LLU"],
            mating_components=["Shaft Tolerance h6/k5 (25mm)", "Housing Tolerance H7 (52mm)"],
            commerce=commerce
        )
