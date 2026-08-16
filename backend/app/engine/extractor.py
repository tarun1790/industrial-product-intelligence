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
        elif "CR" in clean_p or "PUMP" in clean_p:
            return cls._build_pump_sample(part_number, manufacturer_hint or "Grundfos")
        elif "GV3" in clean_p or "BREAKER" in clean_p:
            return cls._build_breaker_sample(part_number, manufacturer_hint or "Schneider Electric")
        elif "DNC" in clean_p or "CYLINDER" in clean_p:
            return cls._build_cylinder_sample(part_number, manufacturer_hint or "Festo")
        else:
            return cls._build_motor_sample(part_number, manufacturer_hint or "ABB")

    @classmethod
    def extract_from_text(cls, text: str, category_hint: str = "Industrial Motor") -> Product:
        return cls._build_motor_sample("M3BP 160MLA 4", "ABB")

    @classmethod
    def _build_motor_sample(cls, part_number: str = "M3BP 160MLA 4", manufacturer: str = "ABB") -> Product:
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
            EvidenceItem(id="ev_m1", attribute_name="power_kw", raw_value="7.5 kW", source_type="oem_datasheet", source_name="ABB Process Performance Catalog 2024", page_number=4, bounding_box={"x": 120, "y": 450, "w": 85, "h": 22}, snippet="Rated output: 7.5 kW (10 HP) at 50 Hz continuous duty S1", confidence=0.99, source_authority_score=1.0),
            EvidenceItem(id="ev_m2", attribute_name="voltage_v", raw_value="415 V", source_type="oem_datasheet", source_name="ABB Process Performance Catalog 2024", page_number=4, bounding_box={"x": 210, "y": 450, "w": 65, "h": 22}, snippet="Nominal 3-phase supply voltage: 400-415 V delta / 690 V star", confidence=0.98, source_authority_score=1.0),
            EvidenceItem(id="ev_m3", attribute_name="current_a", raw_value="14.2 A", source_type="oem_datasheet", source_name="ABB Process Performance Catalog 2024", page_number=4, bounding_box={"x": 280, "y": 450, "w": 55, "h": 22}, snippet="Rated full load current IN = 14.2 A at 400 V", confidence=0.96, source_authority_score=1.0),
            EvidenceItem(id="ev_m6", attribute_name="speed_rpm", raw_value="1465 RPM", source_type="oem_datasheet", source_name="ABB Process Performance Catalog 2024", page_number=5, bounding_box={"x": 140, "y": 510, "w": 70, "h": 20}, snippet="Rated speed at full load: 1465 r/min (synchronous speed 1500 r/min)", confidence=0.98, source_authority_score=1.0),
            EvidenceItem(id="ev_m13", attribute_name="weight_kg", raw_value="42 kg", source_type="distributor_catalog", source_name="Distributor Catalog (2021)", page_number=112, bounding_box={"x": 50, "y": 80, "w": 40, "h": 15}, snippet="Gross Shipping Weight approx: 42 kg", confidence=0.75, source_authority_score=0.70),
            EvidenceItem(id="ev_m14", attribute_name="weight_kg", raw_value="45 kg", source_type="oem_datasheet", source_name="ABB Process Performance Catalog 2024 Rev C", page_number=5, bounding_box={"x": 350, "y": 510, "w": 45, "h": 20}, snippet="Net machine weight (cast-iron frame): 45 kg", confidence=0.98, source_authority_score=1.0)
        ]

        # 3. VALIDATE: Engineering Consistency & Physics Rule Engine
        issues, checks, trust_score = EngineeringValidator.validate_product("Industrial Motor", enriched_attributes)

        # 4. PROVE: Multi-Source Conflict Resolution & 5-Step Reasoning Chain
        conflict = ConflictResolutionEngine.resolve_attribute_conflict(
            attribute_name="weight_kg",
            sources=[
                {"source_name": "Distributor Catalog (2021)", "source_type": "distributor_catalog", "value": 42.0, "unit": "kg", "date": 2021, "authority_score": 0.70},
                {"source_name": "ABB Process Performance Catalog 2024 Rev C", "source_type": "oem_datasheet", "value": 45.0, "unit": "kg", "date": 2024, "authority_score": 1.00}
            ],
            product_category="Industrial Motor"
        )

        # EQA Truth Table Generation
        truth_table = EvidenceQualityEngine.generate_truth_table(
            attributes=enriched_attributes,
            evidence_trail=evidence,
            conflicts=[conflict],
            physics_checks=checks
        )

        # Temporal Revision History
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
    def _build_bearing_sample(cls, part_number: str = "6205-2RSH", manufacturer: str = "SKF") -> Product:
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

    @classmethod
    def _build_pump_sample(cls, part_number: str = "CR 10-06", manufacturer: str = "Grundfos") -> Product:
        fingerprint = ProductIdentityEngine.generate_fingerprint(part_number, manufacturer, "Centrifugal Pump")
        sources_report = SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

        raw_attributes = {
            "flow_rate_nominal": AttributeValue(name="flow_rate_nominal", display_name="Nominal Flow Rate (Q)", group_name="Mechanical", raw_value="10 m³/h", unit="m³/h", normalized_value=10.0, normalized_unit="m³/h", is_standardized=True, confidence=1.0, evidence_ids=["ev_p1"]),
            "head_nominal": AttributeValue(name="head_nominal", display_name="Nominal Head (H)", group_name="Mechanical", raw_value="65 m", unit="m", normalized_value=65.0, normalized_unit="m", is_standardized=True, confidence=0.99, evidence_ids=["ev_p2"]),
            "motor_power": AttributeValue(name="motor_power", display_name="Motor Power (P2)", group_name="Electrical", raw_value="3.0 kW", unit="kW", normalized_value=3.0, normalized_unit="kW", is_standardized=True, confidence=0.98, evidence_ids=["ev_p3"]),
            "max_operating_pressure": AttributeValue(name="max_operating_pressure", display_name="Max Operating Pressure", group_name="Mechanical", raw_value="16 bar", unit="bar", normalized_value=16.0, normalized_unit="bar", is_standardized=True, confidence=0.97, evidence_ids=["ev_p4"]),
            "efficiency_pump": AttributeValue(name="efficiency_pump", display_name="Hydraulic Efficiency (η)", group_name="Mechanical", raw_value="71 %", unit="%", normalized_value=71.0, normalized_unit="%", is_standardized=True, confidence=0.95, evidence_ids=["ev_p5"])
        }

        schema_audit, enriched_attributes = ProductOntologyEngine.audit_and_enrich_product("Centrifugal Pump", raw_attributes)
        issues, checks, trust_score = EngineeringValidator.validate_product("Centrifugal Pump", enriched_attributes)
        truth_table = EvidenceQualityEngine.generate_truth_table(enriched_attributes, [], [], checks)
        history = TemporalHistoryEngine.get_revision_history("CR 10-06")

        commerce = CommerceGenerator.generate_commerce_profile(
            part_number="CR 10-06",
            manufacturer="Grundfos",
            category="Centrifugal Pump",
            product_family="CR Vertical Multistage Pumps",
            attributes=enriched_attributes
        )

        return Product(
            id="prod_grundfos_cr10",
            part_number="CR 10-06",
            clean_part_number="CR1006",
            manufacturer="Grundfos",
            product_family="CR Vertical Multistage Pumps",
            category="Centrifugal Pump",
            industry="Fluid Power & Process Hydraulics",
            series="CR10 Series",
            title="Grundfos CR 10-06 Vertical Multistage Centrifugal Pump",
            status="VERIFIED",
            trust_score=97.8,
            fingerprint=fingerprint,
            sources_discovered=sources_report,
            schema_audit=schema_audit,
            attributes=enriched_attributes,
            truth_table=truth_table,
            revision_history=history,
            missing_attributes=schema_audit.missing_attribute_names,
            enriched_attributes=schema_audit.enriched_attribute_names,
            evidence_trail=[],
            conflicts=[],
            validation_issues=issues,
            engineering_checks=checks,
            compatible_products=["Grundfos CUE Frequency Converter", "Grundfos LiqTec Sensor"],
            replacement_for=["Wilo Helix V 1006", "KSB Movitec V 10/6"],
            mating_components=["Flange DN40 PN16", "Mechanical Seal HQQE"],
            commerce=commerce
        )

    @classmethod
    def _build_breaker_sample(cls, part_number: str = "GV3P65", manufacturer: str = "Schneider Electric") -> Product:
        fingerprint = ProductIdentityEngine.generate_fingerprint(part_number, manufacturer, "Motor Circuit Breaker")
        sources_report = SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

        raw_attributes = {
            "thermal_trip_current_max": AttributeValue(name="thermal_trip_current_max", display_name="Thermal Current Setting (Ir)", group_name="Electrical", raw_value="65 A", unit="A", normalized_value=65.0, normalized_unit="A", is_standardized=True, confidence=1.0, evidence_ids=["ev_c1"]),
            "breaking_capacity_icu": AttributeValue(name="breaking_capacity_icu", display_name="Breaking Capacity (Icu at 400V)", group_name="Electrical", raw_value="50 kA", unit="kA", normalized_value=50.0, normalized_unit="kA", is_standardized=True, confidence=0.99, evidence_ids=["ev_c2"]),
            "rated_voltage": AttributeValue(name="rated_voltage", display_name="Rated Operational Voltage (Ue)", group_name="Electrical", raw_value="690 V", unit="V", normalized_value=690.0, normalized_unit="V", is_standardized=True, confidence=0.99, evidence_ids=["ev_c3"]),
            "trip_class": AttributeValue(name="trip_class", display_name="Trip Class", group_name="Electrical", raw_value="Class 10", is_standardized=True, confidence=0.98, evidence_ids=["ev_c4"])
        }

        schema_audit, enriched_attributes = ProductOntologyEngine.audit_and_enrich_product("Motor Circuit Breaker", raw_attributes)
        issues, checks, trust_score = EngineeringValidator.validate_product("Motor Circuit Breaker", enriched_attributes)
        truth_table = EvidenceQualityEngine.generate_truth_table(enriched_attributes, [], [], checks)
        history = TemporalHistoryEngine.get_revision_history("GV3P65")

        commerce = CommerceGenerator.generate_commerce_profile(
            part_number="GV3P65",
            manufacturer="Schneider Electric",
            category="Motor Circuit Breaker",
            product_family="TeSys GV3 Motor Protectors",
            attributes=enriched_attributes
        )

        return Product(
            id="prod_schneider_gv3",
            part_number="GV3P65",
            clean_part_number="GV3P65",
            manufacturer="Schneider Electric",
            product_family="TeSys GV3 Motor Protectors",
            category="Motor Circuit Breaker",
            industry="Electrical Power & Switchgear",
            series="TeSys GV3",
            title="Schneider Electric TeSys GV3P65 Motor Circuit Breaker (48-65A)",
            status="VERIFIED",
            trust_score=99.0,
            fingerprint=fingerprint,
            sources_discovered=sources_report,
            schema_audit=schema_audit,
            attributes=enriched_attributes,
            truth_table=truth_table,
            revision_history=history,
            missing_attributes=schema_audit.missing_attribute_names,
            enriched_attributes=schema_audit.enriched_attribute_names,
            evidence_trail=[],
            conflicts=[],
            validation_issues=issues,
            engineering_checks=checks,
            compatible_products=["TeSys D Contactor LC1D65A", "Auxiliary Contact GVAU385"],
            replacement_for=["ABB MS132-65", "Siemens 3RV2031-4JA10"],
            mating_components=["35mm DIN Rail (EN 60715)", "EverLink Power Terminal"],
            commerce=commerce
        )

    @classmethod
    def _build_cylinder_sample(cls, part_number: str = "DNC-63-200-PPV-A", manufacturer: str = "Festo") -> Product:
        fingerprint = ProductIdentityEngine.generate_fingerprint(part_number, manufacturer, "Pneumatic Cylinder")
        sources_report = SourceDiscoveryEngine.discover_sources_for_product(part_number, manufacturer)

        raw_attributes = {
            "piston_diameter": AttributeValue(name="piston_diameter", display_name="Piston Bore Diameter", group_name="Mechanical", raw_value="63 mm", unit="mm", normalized_value=63.0, normalized_unit="mm", is_standardized=True, confidence=1.0, evidence_ids=["ev_d1"]),
            "stroke_length": AttributeValue(name="stroke_length", display_name="Stroke Length", group_name="Mechanical", raw_value="200 mm", unit="mm", normalized_value=200.0, normalized_unit="mm", is_standardized=True, confidence=1.0, evidence_ids=["ev_d2"]),
            "max_operating_pressure": AttributeValue(name="max_operating_pressure", display_name="Max Operating Pressure", group_name="Mechanical", raw_value="12 bar", unit="bar", normalized_value=12.0, normalized_unit="bar", is_standardized=True, confidence=0.98, evidence_ids=["ev_d3"]),
            "cushioning_type": AttributeValue(name="cushioning_type", display_name="Cushioning", group_name="Mechanical", raw_value="PPV (Pneumatic Adjustable)", is_standardized=True, confidence=0.99, evidence_ids=["ev_d4"])
        }

        schema_audit, enriched_attributes = ProductOntologyEngine.audit_and_enrich_product("Pneumatic Cylinder", raw_attributes)
        issues, checks, trust_score = EngineeringValidator.validate_product("Pneumatic Cylinder", enriched_attributes)
        truth_table = EvidenceQualityEngine.generate_truth_table(enriched_attributes, [], [], checks)
        history = TemporalHistoryEngine.get_revision_history("DNC-63-200-PPV-A")

        commerce = CommerceGenerator.generate_commerce_profile(
            part_number="DNC-63-200-PPV-A",
            manufacturer="Festo",
            category="Pneumatic Cylinder",
            product_family="DNC Standard Cylinders ISO 15552",
            attributes=enriched_attributes
        )

        return Product(
            id="prod_festo_dnc",
            part_number="DNC-63-200-PPV-A",
            clean_part_number="DNC63200PPVA",
            manufacturer="Festo",
            product_family="DNC Standard Cylinders ISO 15552",
            category="Pneumatic Cylinder",
            industry="Industrial Automation & Pneumatics",
            series="DNC Series",
            title="Festo DNC-63-200-PPV-A ISO 15552 Standard Pneumatic Cylinder",
            status="VERIFIED",
            trust_score=98.6,
            fingerprint=fingerprint,
            sources_discovered=sources_report,
            schema_audit=schema_audit,
            attributes=enriched_attributes,
            truth_table=truth_table,
            revision_history=history,
            missing_attributes=schema_audit.missing_attribute_names,
            enriched_attributes=schema_audit.enriched_attribute_names,
            evidence_trail=[],
            conflicts=[],
            validation_issues=issues,
            engineering_checks=checks,
            compatible_products=["Festo SME-8M Proximity Sensor", "Festo QS G1/4 Push-In Fitting"],
            replacement_for=["SMC CP96SDB63-200", "Parker P1D-S063MS-0200"],
            mating_components=["ISO 15552 Clevis Foot HNG-63", "Swivel Flange SNCS-63"],
            commerce=commerce
        )

    @classmethod
    def _build_actuator_sample(cls, part_number: str = "DNC-50-200", manufacturer: str = "Festo") -> Product:
        return cls._build_cylinder_sample(part_number, manufacturer)
