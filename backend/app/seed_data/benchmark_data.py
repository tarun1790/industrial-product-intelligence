from typing import List, Dict
from app.models.schemas import Product, AttributeValue, EvidenceItem, ConflictRecord, ValidationIssue, EngineeringSanityCheck
from app.engine.extractor import MultiModalExtractor
from app.engine.commerce_generator import CommerceGenerator
from app.core.normalizer import IndustrialNormalizer
from app.engine.validator import EngineeringValidator
from app.engine.conflict_resolver import ConflictResolutionEngine

def get_benchmark_catalog() -> List[Product]:
    # 1. ABB M3BP 160MLA 4 (IE3 Motor with resolved conflict)
    p1 = MultiModalExtractor._build_motor_sample("M3BP 160MLA 4")
    
    # 2. SKF 6205-2RSH (Bearing)
    p2 = MultiModalExtractor._build_bearing_sample("6205-2RSH")
    
    # 3. Grundfos CR 10-06 (Pump)
    p3 = MultiModalExtractor._build_pump_sample("CR 10-06")
    
    # 4. Siemens 3RV2011 (Breaker)
    p4 = MultiModalExtractor._build_breaker_sample("3RV2011")
    
    # 5. Festo DNC-50-200 (Actuator)
    p5 = MultiModalExtractor._build_actuator_sample("DNC-50-200")
    
    # 6. Siemens 1LE1003-1DB2 (11 kW IE3 Industrial Motor)
    attrs_siemens = {
        "rated_power": "11.0 kW",
        "rated_voltage": "400 V",
        "rated_frequency": "50 Hz",
        "number_of_phases": 3,
        "rated_speed_rpm": "1470 RPM",
        "rated_current": "20.5 A",
        "efficiency_class": "IE3",
        "efficiency_percentage": "91.4%",
        "power_factor": "0.85",
        "ip_rating": "IP55",
        "insulation_class": "Class 155(F)",
        "frame_size": "160M",
        "weight": "84 kg",
        "ambient_temp_max": "40 °C",
        "duty_type": "S1 Continuous"
    }
    norm_siemens = {}
    for k, v in attrs_siemens.items():
        n = IndustrialNormalizer.normalize_attribute(k, v)
        norm_siemens[k] = AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=n.get("unit"), normalized_value=n.get("normalized_value"), normalized_unit=n.get("normalized_unit"), confidence=0.97)
    
    issues_s, checks_s, trust_s = EngineeringValidator.validate_product("Industrial Motor", norm_siemens)
    comm_s = CommerceGenerator.generate_commerce_profile("1LE1003-1DB2", "Siemens", "Industrial Motor", "SIMOTICS GP 1LE1", norm_siemens)
    p6 = Product(
        id="prod_siemens_1le1",
        part_number="1LE1003-1DB22-2AA4",
        clean_part_number="1LE10031DB222AA4",
        manufacturer="Siemens",
        product_family="SIMOTICS GP General Purpose Motors",
        category="Industrial Motor",
        series="1LE1003 Series",
        title="Siemens SIMOTICS GP 11.0 kW IE3 Motor (1LE1003-1DB2)",
        status="VERIFIED",
        trust_score=trust_s,
        attributes=norm_siemens,
        evidence_trail=[
            EvidenceItem(
                id="ev_siem_01",
                attribute_name="rated_power",
                raw_value="11 kW",
                source_type="datasheet_pdf",
                source_name="Siemens Catalog D 81.1 SIMOTICS Low-Voltage Motors",
                page_number=45,
                snippet="Frame 160M: Rated power 11 kW at 50 Hz, 4 poles",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=issues_s,
        engineering_checks=checks_s,
        compatible_products=["Siemens SINAMICS G120 Inverter", "Siemens SIRIUS 3RW Soft Starter"],
        replacement_for=["Siemens 1LA7 163-4AA"],
        mating_components=["SKF 6309 C3 Drive End Bearing"],
        commerce=comm_s
    )

    # 7. Timken 6205-2RS (Ball bearing variant)
    attrs_timken = {
        "bore_diameter": "25 mm",
        "outer_diameter": "52 mm",
        "width": "15 mm",
        "dynamic_load_rating_c": "14.0 kN",
        "static_load_rating_c0": "7.88 kN",
        "limiting_speed_rpm": "15000 RPM",
        "seal_type": "2RS Rubber Contact Seals",
        "cage_material": "Steel",
        "weight": "0.13 kg"
    }
    norm_timken = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, confidence=0.96) for k, v in attrs_timken.items()}
    comm_timken = CommerceGenerator.generate_commerce_profile("6205-2RS", "Timken", "Rolling Bearing", "Deep Groove Ball Bearings", norm_timken)
    p7 = Product(
        id="prod_timken_6205",
        part_number="6205-2RS",
        clean_part_number="62052RS",
        manufacturer="Timken",
        product_family="Deep Groove Ball Bearings",
        category="Rolling Bearing",
        series="6200 Metric Series",
        title="Timken 6205-2RS Deep Groove Ball Bearing (25x52x15mm)",
        status="VERIFIED",
        trust_score=97.5,
        attributes=norm_timken,
        evidence_trail=[],
        conflicts=[],
        validation_issues=[],
        engineering_checks=[],
        compatible_products=["Timken Industrial Grease GR217"],
        replacement_for=["SKF 6205-2RSH", "NTN 6205 LLU"],
        mating_components=["Standard 25mm Shaft"],
        commerce=comm_timken
    )

    return [p1, p2, p3, p4, p5, p6, p7]
