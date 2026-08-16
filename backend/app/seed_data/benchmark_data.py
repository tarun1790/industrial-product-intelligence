from typing import List, Dict
from app.models.schemas import Product, AttributeValue, EvidenceItem, ConflictRecord, ValidationIssue, EngineeringSanityCheck
from app.engine.extractor import MultiModalExtractor
from app.engine.commerce_generator import CommerceGenerator
from app.core.normalizer import IndustrialNormalizer
from app.engine.validator import EngineeringValidator
from app.engine.conflict_resolver import ConflictResolutionEngine

def get_benchmark_catalog() -> List[Product]:
    catalog: List[Product] = []

    # 1. ABB M3BP 160MLA 4 (Power Transmission - With resolved 42kg vs 45kg conflict)
    p1 = MultiModalExtractor._build_motor_sample("M3BP 160MLA 4")
    p1.industry = "Power Transmission & Heavy Machinery"
    catalog.append(p1)

    # 2. Siemens SIMOTICS GP 11.0 kW IE3 Motor
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
    norm_siemens = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.98) for k, v in attrs_siemens.items()}
    issues_s, checks_s, trust_s = EngineeringValidator.validate_product("Industrial Motor", norm_siemens)
    comm_s = CommerceGenerator.generate_commerce_profile("1LE1003-1DB2", "Siemens", "Industrial Motor", "SIMOTICS GP 1LE1", norm_siemens)
    p2 = Product(
        id="prod_siemens_1le1",
        part_number="1LE1003-1DB22-2AA4",
        clean_part_number="1LE10031DB222AA4",
        manufacturer="Siemens",
        product_family="SIMOTICS GP General Purpose Motors",
        category="Industrial Motor",
        industry="Power Transmission & Heavy Machinery",
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
                confidence=0.99,
                source_authority_score=1.0
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
    catalog.append(p2)

    # 3. WEG W22 Super Premium 5.5 kW IE4 Motor
    attrs_weg = {
        "rated_power": "5.5 kW",
        "rated_voltage": "415 V",
        "rated_frequency": "50 Hz",
        "number_of_phases": 3,
        "rated_speed_rpm": "1460 RPM",
        "rated_current": "10.1 A",
        "efficiency_class": "IE4",
        "efficiency_percentage": "91.9%",
        "power_factor": "0.86",
        "ip_rating": "IP55",
        "insulation_class": "Class F",
        "frame_size": "132S",
        "weight": "54 kg",
        "ambient_temp_max": "40 °C",
        "duty_type": "S1 Continuous"
    }
    norm_weg = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.97) for k, v in attrs_weg.items()}
    issues_w, checks_w, trust_w = EngineeringValidator.validate_product("Industrial Motor", norm_weg)
    comm_weg = CommerceGenerator.generate_commerce_profile("W22-5.5KW-IE4", "WEG", "Industrial Motor", "W22 Super Premium", norm_weg)
    p3 = Product(
        id="prod_weg_w22",
        part_number="W22-5.5KW-4P-IE4",
        clean_part_number="W2255KW4PIE4",
        manufacturer="WEG",
        product_family="W22 Super Premium Cast Iron",
        category="Industrial Motor",
        industry="Power Transmission & Heavy Machinery",
        series="W22 IE4 Super Premium",
        title="WEG W22 Super Premium 5.5 kW IE4 Cast Iron Motor",
        status="VERIFIED",
        trust_score=trust_w,
        attributes=norm_weg,
        evidence_trail=[
            EvidenceItem(
                id="ev_weg_01",
                attribute_name="efficiency_class",
                raw_value="IE4 Super Premium",
                source_type="datasheet_pdf",
                source_name="WEG W22 Global Line Technical Catalog",
                page_number=18,
                snippet="Super Premium Efficiency IE4 according to IEC 60034-30-1",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=issues_w,
        engineering_checks=checks_w,
        compatible_products=["WEG CFW11 Variable Frequency Drive"],
        replacement_for=["WEG W21 Standard"],
        mating_components=["SKF 6208 C3 Bearing"],
        commerce=comm_weg
    )
    catalog.append(p3)

    # 4. SKF 6205-2RSH (Precision Motion & Tribology)
    p4 = MultiModalExtractor._build_bearing_sample("6205-2RSH")
    p4.industry = "Precision Motion & Tribology"
    catalog.append(p4)

    # 5. Timken 6205-2RS (Precision Motion & Tribology)
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
    norm_timken = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.96) for k, v in attrs_timken.items()}
    comm_timken = CommerceGenerator.generate_commerce_profile("6205-2RS", "Timken", "Rolling Bearing", "Deep Groove Ball Bearings", norm_timken)
    p5 = Product(
        id="prod_timken_6205",
        part_number="6205-2RS",
        clean_part_number="62052RS",
        manufacturer="Timken",
        product_family="Deep Groove Ball Bearings",
        category="Rolling Bearing",
        industry="Precision Motion & Tribology",
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
    catalog.append(p5)

    # 6. Schaeffler FAG 22212-E1 (Spherical Roller Bearing for Heavy Industrial Duty)
    attrs_fag = {
        "bore_diameter": "60 mm",
        "outer_diameter": "110 mm",
        "width": "28 mm",
        "dynamic_load_rating_c": "156 kN",
        "static_load_rating_c0": "166 kN",
        "limiting_speed_rpm": "6300 RPM",
        "reference_speed_rpm": "4800 RPM",
        "cage_material": "Sheet Steel (E1 Design)",
        "radial_internal_clearance": "Normal (CN)",
        "weight": "1.12 kg"
    }
    norm_fag = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.99) for k, v in attrs_fag.items()}
    comm_fag = CommerceGenerator.generate_commerce_profile("22212-E1-XL", "Schaeffler FAG", "Rolling Bearing", "Spherical Roller Bearings", norm_fag)
    p6 = Product(
        id="prod_fag_22212",
        part_number="22212-E1-XL",
        clean_part_number="22212E1XL",
        manufacturer="Schaeffler FAG",
        product_family="X-life Spherical Roller Bearings",
        category="Rolling Bearing",
        industry="Precision Motion & Tribology",
        series="22200 Series",
        title="Schaeffler FAG 22212-E1-XL Spherical Roller Bearing (60x110x28 mm)",
        status="VERIFIED",
        trust_score=99.0,
        attributes=norm_fag,
        evidence_trail=[
            EvidenceItem(
                id="ev_fag_01",
                attribute_name="dynamic_load_rating_c",
                raw_value="156 kN",
                source_type="datasheet_pdf",
                source_name="Schaeffler HR 1 Rolling Bearings Handbook",
                page_number=480,
                snippet="X-life design basic dynamic load rating Cr = 156 kN, C0r = 166 kN",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=[],
        engineering_checks=[
            EngineeringSanityCheck(
                passed=True,
                formula_tested="ISO 76 Spherical Roller Load Rating Ratio",
                calculated_value="C0 = 166 kN",
                stated_value="C0 = 166 kN",
                details="Spherical roller geometry verified for self-aligning heavy radial loads"
            )
        ],
        compatible_products=["Schaeffler Arcanol MULTITOP Grease", "FAG Hydraulic Nut HMV 12E"],
        replacement_for=["SKF 22212 E", "NSK 22212 EAE4"],
        mating_components=["Shaft Tolerance m5 (60mm)", "Plummer Block Housing SNL 512"],
        commerce=comm_fag
    )
    catalog.append(p6)

    # 7. Grundfos CR 10-06 (Fluid Power & Process Hydraulics)
    p7 = MultiModalExtractor._build_pump_sample("CR 10-06")
    p7.industry = "Fluid Power & Process Hydraulics"
    catalog.append(p7)

    # 8. Flowserve Mark 3 ANSI Chemical Process Pump
    attrs_flowserve = {
        "flow_rate_nominal": "45 m³/h",
        "head_nominal": "75 m",
        "motor_power": "15.0 kW",
        "max_operating_pressure": "20 bar",
        "inlet_port_size": "DN 80 (3 inch)",
        "outlet_port_size": "DN 50 (2 inch)",
        "liquid_temp_max": "180 °C",
        "impeller_material": "Hastelloy C-276 / 316SS",
        "efficiency_pump": "78%"
    }
    norm_flowserve = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.98) for k, v in attrs_flowserve.items()}
    issues_fs, checks_fs, trust_fs = EngineeringValidator.validate_product("Centrifugal Pump", norm_flowserve)
    comm_flowserve = CommerceGenerator.generate_commerce_profile("Durco Mark 3 ANSI 3x2-8", "Flowserve", "Centrifugal Pump", "Durco Chemical Process Pumps", norm_flowserve)
    p8 = Product(
        id="prod_flowserve_mark3",
        part_number="Durco Mark 3 ANSI 3x2-8",
        clean_part_number="DURCOMARK3ANSI3X28",
        manufacturer="Flowserve",
        product_family="Durco Mark 3 Chemical Process Pumps",
        category="Centrifugal Pump",
        industry="Fluid Power & Process Hydraulics",
        series="ANSI B73.1 Process Pumps",
        title="Flowserve Durco Mark 3 ANSI Chemical Pump – 15 kW, 75m Head, Hastelloy C",
        status="VERIFIED",
        trust_score=trust_fs,
        attributes=norm_flowserve,
        evidence_trail=[
            EvidenceItem(
                id="ev_fs_01",
                attribute_name="max_operating_pressure",
                raw_value="20 bar (285 psi)",
                source_type="datasheet_pdf",
                source_name="Flowserve Durco Mark 3 Technical Bulletin PS-10-13",
                page_number=12,
                snippet="Pressure containment rating 20 bar at elevated temperature up to 180°C",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=issues_fs,
        engineering_checks=checks_fs,
        compatible_products=["Flowserve ISC2 Dual Cartridge Seal", "Siemens 15 kW Cast Iron Motor"],
        replacement_for=["Goulds 3196 ANSI 3x2-8", "Peerless 8196"],
        mating_components=["ANSI Class 150 RF Flanges", "Cartridge Mechanical Seal ISC2PP"],
        commerce=comm_flowserve
    )
    catalog.append(p8)

    # 9. Siemens SIRIUS 3RV2011 (Electrical Power & Switchgear)
    p9 = MultiModalExtractor._build_breaker_sample("3RV2011")
    p9.industry = "Electrical Power & Switchgear"
    catalog.append(p9)

    # 10. Schneider Electric TeSys GV3P Motor Circuit Breaker (65A, 100kA)
    attrs_schneider = {
        "rated_current": "65 A",
        "rated_voltage": "690 V",
        "breaking_capacity_icu": "100 kA",
        "number_of_poles": 3,
        "tripping_characteristic": "Thermal-Magnetic Class 10",
        "mounting_type": "DIN Rail 35mm / Screw",
        "ip_rating": "IP20"
    }
    norm_schneider = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.99) for k, v in attrs_schneider.items()}
    comm_schneider = CommerceGenerator.generate_commerce_profile("GV3P65", "Schneider Electric", "Circuit Breaker", "TeSys GV3 Motor Starter Protectors", norm_schneider)
    p10 = Product(
        id="prod_schneider_gv3",
        part_number="GV3P65",
        clean_part_number="GV3P65",
        manufacturer="Schneider Electric",
        product_family="TeSys Deca / GV3 Motor Circuit Breakers",
        category="Circuit Breaker",
        industry="Electrical Power & Switchgear",
        series="TeSys GV3 Series",
        title="Schneider Electric TeSys GV3P65 Motor Circuit Breaker (48-65 A, 100 kA)",
        status="VERIFIED",
        trust_score=99.5,
        attributes=norm_schneider,
        evidence_trail=[
            EvidenceItem(
                id="ev_sch_01",
                attribute_name="breaking_capacity_icu",
                raw_value="100 kA @ 400V",
                source_type="datasheet_pdf",
                source_name="Schneider Electric TeSys Catalog 2024",
                page_number=88,
                snippet="Icu = 100 kA at 400/415 V AC conforming to IEC 60947-2",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=[],
        engineering_checks=[
            EngineeringSanityCheck(
                passed=True,
                formula_tested="IEC 60947-2 Breaking Capacity",
                calculated_value="100 kA @ 415V",
                stated_value="100 kA",
                details="Class 10 thermal magnetic trip coordination validated"
            )
        ],
        compatible_products=["Schneider TeSys LC1D50A Contactor", "GV3S Terminal Shroud"],
        replacement_for=["Schneider GV2P Legacy", "Eaton PKZM4-63"],
        mating_components=["EverLink Power Connectors 50mm²"],
        commerce=comm_schneider
    )
    catalog.append(p10)

    # 11. Festo DNC-50-200 (Industrial Automation & Pneumatics)
    p11 = MultiModalExtractor._build_actuator_sample("DNC-50-200")
    p11.industry = "Industrial Automation & Pneumatics"
    catalog.append(p11)

    # 12. IFM Efector IGS204 Inductive Proximity Sensor (Process Instrumentation & Sensing)
    attrs_ifm = {
        "sensing_range": "8 mm",
        "output_type": "PNP Normally Open (NO)",
        "supply_voltage": "10 - 30 VDC",
        "switching_frequency": "400 Hz",
        "ip_rating": "IP67 / IP69K",
        "operating_temp_range": "-40 to 85 °C",
        "housing_material": "Stainless Steel 316L (1.4404)",
        "connection_type": "M12 Connector 4-pin"
    }
    norm_ifm = {k: AttributeValue(name=k, display_name=k.replace('_', ' ').title(), raw_value=v, unit=IndustrialNormalizer.normalize_attribute(k, v).get("unit"), normalized_value=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_value"), normalized_unit=IndustrialNormalizer.normalize_attribute(k, v).get("normalized_unit"), confidence=0.99) for k, v in attrs_ifm.items()}
    comm_ifm = CommerceGenerator.generate_commerce_profile("IGS204", "IFM Efector", "Industrial Sensor", "IGS Full Metal Inductive Sensors", norm_ifm)
    p12 = Product(
        id="prod_ifm_igs204",
        part_number="IGS204",
        clean_part_number="IGS204",
        manufacturer="IFM Efector",
        product_family="IGS Stainless Steel Proximity Sensors",
        category="Industrial Sensor",
        industry="Process Instrumentation & Sensing",
        series="IGS Series M18",
        title="IFM Efector IGS204 Flush Stainless Steel Inductive Sensor (8mm Sn, IP69K)",
        status="VERIFIED",
        trust_score=100.0,
        attributes=norm_ifm,
        evidence_trail=[
            EvidenceItem(
                id="ev_ifm_01",
                attribute_name="ip_rating",
                raw_value="IP67 / IP69K Washdown",
                source_type="datasheet_pdf",
                source_name="IFM Efector Position Sensors Catalog",
                page_number=64,
                snippet="High resistance to cleaning agents, IP 68 / IP 69K per DIN 40050-9",
                confidence=0.99
            )
        ],
        conflicts=[],
        validation_issues=[],
        engineering_checks=[
            EngineeringSanityCheck(
                passed=True,
                formula_tested="IEC 60947-5-2 Sensing Distance Sn",
                calculated_value="Effective operating distance 0 - 6.48 mm",
                stated_value="Sn = 8 mm",
                details="Stainless steel flush mounting correction factors verified"
            )
        ],
        compatible_products=["IFM EVT001 M12 Connecting Cable 5m", "EVC004 M12 Socket"],
        replacement_for=["Pepperl+Fuchs NBB8-18GM50-E2", "Turck BI8U-M18-AP6X"],
        mating_components=["M18 Mounting Bracket E10711"],
        commerce=comm_ifm
    )
    catalog.append(p12)

    return catalog
