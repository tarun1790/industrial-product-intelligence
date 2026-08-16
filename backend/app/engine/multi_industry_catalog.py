from typing import List, Dict, Any
from app.models.schemas import Product, AttributeValue, EvidenceItem, ProductIdentityFingerprint, SourceDiscoveryReport, SchemaCompletenessAudit, TruthTableEntry, EngineeringSanityCheck, CommerceListing

def get_expanded_multi_industry_catalog() -> List[Product]:
    """
    Returns an expanded multi-industry enterprise catalog spanning 10 global industrial sectors:
    1. Power Transmission & Heavy Machinery (ABB, Siemens)
    2. Precision Motion & Tribology (SKF, FAG, Timken)
    3. Fluid Power & Process Hydraulics (Grundfos, Flowserve, Danfoss)
    4. Electrical Power & Switchgear (Schneider Electric, Eaton)
    5. Industrial Automation & Pneumatics (Festo, SMC)
    6. Process Instrumentation & Sensing (IFM Efector, Endress+Hauser)
    7. Sanitary Food & Bio-Pharma (Alfa Laval, Bürkert)
    8. Oil & Gas / Petrochemical (Emerson Fisher, Flowserve)
    9. Aerospace & Defense Actuation (Moog, Parker)
    10. Cryogenic LNG & Clean Energy (Chart Industries, Nikkiso)
    """
    catalog: List[Product] = []

    # 1. Power: ABB M3BP 160MLA 4
    # (Pre-existing standard)
    
    # 7. Sanitary Pharma: Alfa Laval LKH-10 Hygienic Centrifugal Pump
    p_sanitary = Product(
        id="prod_alfalaval_lkh10",
        part_number="LKH-10/140",
        clean_part_number="LKH10140",
        manufacturer="Alfa Laval",
        product_family="LKH Premium Hygienic Pumps",
        category="Sanitary Centrifugal Pump",
        industry="Sanitary Food & Bio-Pharma",
        series="LKH Series",
        title="Alfa Laval LKH-10 Premium Sanitary Centrifugal Pump (3-A / EHEDG)",
        status="VERIFIED",
        trust_score=99.2,
        attributes={
            "flow_rate_nominal": AttributeValue(name="flow_rate_nominal", display_name="Nominal Flow (Q)", raw_value="25 m³/h", unit="m³/h", normalized_value=25.0, normalized_unit="m³/h"),
            "head_nominal": AttributeValue(name="head_nominal", display_name="Nominal Head (H)", raw_value="42 m", unit="m", normalized_value=42.0, normalized_unit="m"),
            "surface_roughness_ra": AttributeValue(name="surface_roughness_ra", display_name="Surface Finish (Ra)", raw_value="0.5 µm", unit="µm", normalized_value=0.5, normalized_unit="µm"),
            "wetted_material": AttributeValue(name="wetted_material", display_name="Wetted Steel Grade", raw_value="AISI 316L (1.4404) Electropolished"),
            "elastomer_type": AttributeValue(name="elastomer_type", display_name="Elastomer Seal", raw_value="EPDM (FDA / USP Class VI compliant)"),
            "cip_sip_capable": AttributeValue(name="cip_sip_capable", display_name="Steam Sterilization CIP/SIP", raw_value="140°C Continuous (30 min)")
        },
        engineering_checks=[
            EngineeringSanityCheck(passed=True, formula_tested="EHEDG Cleanability Index", calculated_value="Ra = 0.5 µm ≤ 0.8 µm", stated_value="0.5 µm", details="Electropolished wetted surfaces meet stringent 3-A sanitary standard")
        ],
        compatible_products=["ABB M3BP 160MLA 4 (Sanitary White Washdown)", "Bürkert 2000 Sanitary Angle Seat Valve"],
        replacement_for=["Fristam FPX 712", "SPX Flow W+ 22/20"],
        mating_components=["Tri-Clamp 2.0 inch (ISO 2852)", "Aseptic Single Mechanical Seal SiC/Carbon"],
        commerce=CommerceListing(
            title="Alfa Laval LKH-10 Premium Sanitary Pump 25 m3/h",
            subtitle="EHEDG & 3-A Certified Food/Pharma Centrifugal Pump",
            short_description="High-efficiency sanitary pump designed for food, beverage, dairy, and biotechnology applications.",
            key_features=["316L Electropolished stainless steel", "FDA & USP Class VI compliant elastomers", "CIP/SIP cleanable up to 140°C"],
            applications=["Dairy Processing", "Brewing & Beverage", "Pharmaceutical Media Transfer"],
            target_industries=["Sanitary Food & Bio-Pharma"],
            seo_meta_title="Alfa Laval LKH-10 Sanitary Pump - 3-A / EHEDG Certified",
            seo_meta_description="Order Alfa Laval LKH-10 hygienic pump with 316L stainless steel and FDA EPDM seals.",
            seo_keywords=["Alfa Laval LKH", "Sanitary Pump", "EHEDG Pump", "3-A Dairy Pump"],
            json_ld_schema={"@context": "https://schema.org/", "@type": "Product", "name": "Alfa Laval LKH-10 Sanitary Centrifugal Pump", "brand": "Alfa Laval"},
            canonical_category="Sanitary Centrifugal Pump"
        )
    )
    catalog.append(p_sanitary)

    # 8. Oil & Gas: Emerson Fisher ET High-Pressure Control Valve
    p_oilgas = Product(
        id="prod_emerson_fisher_et",
        part_number="Fisher ET-6-CL600",
        clean_part_number="FISHERET6CL600",
        manufacturer="Emerson Fisher",
        product_family="easy-e ET Globe Control Valves",
        category="Process Control Valve",
        industry="Oil & Gas / Petrochemical",
        series="Fisher ET Series",
        title="Emerson Fisher ET 6-inch Class 600 Heavy-Duty Process Control Valve (NACE MR0175)",
        status="VERIFIED",
        trust_score=99.8,
        attributes={
            "nominal_size": AttributeValue(name="nominal_size", display_name="Nominal Size (NPS)", raw_value="6 inch (DN 150)"),
            "pressure_class": AttributeValue(name="pressure_class", display_name="ASME Pressure Rating", raw_value="Class 600 (100 bar)"),
            "body_material": AttributeValue(name="body_material", display_name="Body Casting Material", raw_value="ASTM A216 WCC Carbon Steel"),
            "trim_material": AttributeValue(name="trim_material", display_name="Trim Hardening", raw_value="CoCr-A (Stellite 6) Hard-Faced 316SS"),
            "shutoff_class": AttributeValue(name="shutoff_class", display_name="FCI 70-2 Seat Leakage", raw_value="Class V (Tight Shutoff)"),
            "sour_gas_compliance": AttributeValue(name="sour_gas_compliance", display_name="NACE Sour Service", raw_value="NACE MR0175 / ISO 15156 Compliant (< 22 HRC)")
        },
        engineering_checks=[
            EngineeringSanityCheck(passed=True, formula_tested="ASME B16.34 Shell Burst Pressure", calculated_value="150 bar Hydrotest (1.5x MAWP)", stated_value="150 bar", details="Hydrostatic pressure containment validated per API 598")
        ],
        compatible_products=["Fisher FIELDVUE DVC6200 Digital Valve Controller", "Fisher 667 Diaphragm Actuator"],
        replacement_for=["Flowserve Valtek Mark One", "Masoneilan 21000 Series"],
        mating_components=["ASME B16.5 Class 600 Raised Face Flange", "Spiral Wound Gasket 316SS/Graphite"],
        commerce=CommerceListing(
            title="Emerson Fisher ET 6-inch Class 600 Severe Duty Globe Valve",
            subtitle="API / NACE MR0175 Sour Gas Certified Control Valve",
            short_description="Heavy-duty globe control valve designed for throttling liquid and gas applications in oil refineries and petrochemical facilities.",
            key_features=["Class 600 ASME B16.34 rating", "NACE MR0175 sour service certified", "Stellite 6 hard-faced trim"],
            applications=["Refinery Distillation", "High-Pressure Gas Chokes", "Offshore Separator Units"],
            target_industries=["Oil & Gas / Petrochemical"],
            seo_meta_title="Fisher ET Class 600 Control Valve - NACE Sour Service",
            seo_meta_description="Fisher ET 6-inch globe control valve for severe duty refinery and chemical process lines.",
            seo_keywords=["Fisher ET Valve", "Class 600 Valve", "NACE MR0175 Control Valve", "Emerson Valve"],
            json_ld_schema={"@context": "https://schema.org/", "@type": "Product", "name": "Emerson Fisher ET Control Valve", "brand": "Emerson Fisher"},
            canonical_category="Process Control Valve"
        )
    )
    catalog.append(p_oilgas)

    # 9. Aerospace: Moog 30 Series Electrohydraulic Servo Valve
    p_aero = Product(
        id="prod_moog_g761",
        part_number="G761-3001B",
        clean_part_number="G7613001B",
        manufacturer="Moog Aerospace",
        product_family="G761 Series High-Response Servo Valves",
        category="Electrohydraulic Servo Valve",
        industry="Aerospace & Defense Actuation",
        series="Moog 30 Series",
        title="Moog G761-3001B Aerospace High-Response 2-Stage Electrohydraulic Servo Valve",
        status="VERIFIED",
        trust_score=100.0,
        attributes={
            "rated_flow": AttributeValue(name="rated_flow", display_name="Rated Flow (Δp=70 bar)", raw_value="19 L/min", unit="L/min", normalized_value=19.0, normalized_unit="L/min"),
            "max_operating_pressure": AttributeValue(name="max_operating_pressure", display_name="Supply Pressure", raw_value="315 bar (4500 psi)", unit="bar", normalized_value=315.0, normalized_unit="bar"),
            "response_frequency": AttributeValue(name="response_frequency", display_name="Dynamic Response (90° Phase)", raw_value="200 Hz", unit="Hz", normalized_value=200.0, normalized_unit="Hz"),
            "operating_temp_range": AttributeValue(name="operating_temp_range", display_name="Environmental Temperature", raw_value="-55°C to +135°C"),
            "vibration_survival": AttributeValue(name="vibration_survival", display_name="Vibration Tolerance", raw_value="30 G (20 Hz - 2000 Hz) per MIL-STD-810H")
        },
        engineering_checks=[
            EngineeringSanityCheck(passed=True, formula_tested="DO-160G §8 Random Vibration", calculated_value="30 G-RMS Survival", stated_value="30 G", details="Validated for flight-critical fly-by-wire flight control surfaces")
        ],
        compatible_products=["Moog Digital Axis Controller (MSC II)", "Parker Aviation Hydraulic Filter"],
        replacement_for=["Abex 410 Series", "Parker Aerospace Servovalve 3200"],
        mating_components=["Subplate Mounting ISO 10372-04-04-0-92", "Mil-Spec Connector MS3106A-14S-2S"],
        commerce=CommerceListing(
            title="Moog G761-3001B Aerospace Servo Valve 19 L/min",
            subtitle="DO-160G Qualified High-Frequency Flight Control Actuator",
            short_description="Precision two-stage mechanical feedback servovalve for flight simulators, primary flight controls, and defense weapon systems.",
            key_features=["200 Hz dynamic frequency response", "315 bar continuous operating pressure", "-55°C to +135°C temperature envelope"],
            applications=["Flight Control Actuation", "Thrust Vectoring", "High-G Motion Simulators"],
            target_industries=["Aerospace & Defense Actuation"],
            seo_meta_title="Moog G761 Aerospace Servovalve - 200 Hz Response",
            seo_meta_description="Order Moog G761 aerospace electrohydraulic servovalve with MIL-STD-810H qualification.",
            seo_keywords=["Moog Servovalve", "Aerospace Hydraulic Valve", "DO-160 Servovalve", "Moog G761"],
            json_ld_schema={"@context": "https://schema.org/", "@type": "Product", "name": "Moog G761 Aerospace Servovalve", "brand": "Moog Aerospace"},
            canonical_category="Electrohydraulic Servo Valve"
        )
    )
    catalog.append(p_aero)

    # 10. Cryogenic LNG: Chart Industries Cryogenic Vacuum Insulated Valve
    p_cryo = Product(
        id="prod_chart_cryo_valve",
        part_number="VIP-CV-050-LNG",
        clean_part_number="VIPCV050LNG",
        manufacturer="Chart Industries",
        product_family="VIP Cryogenic Vacuum Insulated Valves",
        category="Cryogenic Process Valve",
        industry="Cryogenic LNG & Clean Energy",
        series="VIP Series",
        title="Chart Industries 2-inch Vacuum Insulated Cryogenic Globe Valve (-196°C LNG / Liquid Hydrogen)",
        status="VERIFIED",
        trust_score=99.5,
        attributes={
            "service_fluid": AttributeValue(name="service_fluid", display_name="Cryogenic Process Media", raw_value="LNG (-162°C) / Liquid Hydrogen (-253°C) / Liquid Nitrogen"),
            "min_design_temperature": AttributeValue(name="min_design_temperature", display_name="Minimum Design Temp", raw_value="-253 °C (20 Kelvin)", unit="°C", normalized_value=-253.0, normalized_unit="°C"),
            "vacuum_jacket_pressure": AttributeValue(name="vacuum_jacket_pressure", display_name="Annular Insulation Vacuum", raw_value="10⁻⁵ Torr High Vacuum"),
            "pressure_rating": AttributeValue(name="pressure_rating", display_name="Cold Working Pressure", raw_value="50 bar (725 psi)", unit="bar", normalized_value=50.0, normalized_unit="bar"),
            "stem_extension_length": AttributeValue(name="stem_extension_length", display_name="Extended Vapor Column Stem", raw_value="450 mm (Thermal Barrier)")
        },
        engineering_checks=[
            EngineeringSanityCheck(passed=True, formula_tested="ISO 28921-1 Cryogenic Helium Leak Rate", calculated_value="1 x 10⁻⁶ mbar·L/s (Class A Bubble Tight)", stated_value="< 1 x 10⁻⁶", details="Helium mass spectrometer leak test validated at 77K liquid nitrogen cold soak")
        ],
        compatible_products=["Chart VIP Vacuum Insulated Pipe", "Nikkiso Cryogenic Submerged LNG Pump"],
        replacement_for=["Bestobell Cryogenic Globe Valve", "Herose Type 01251 Cryogenic Valve"],
        mating_components=["Butt Weld Ends ASME B16.25", "Vacuum Seal-Off Valve SV-04"],
        commerce=CommerceListing(
            title="Chart Industries VIP 2-inch Cryogenic Vacuum Jacketed Valve",
            subtitle="LNG & Liquid Hydrogen (-253°C) Bubble-Tight Cryogenic Valve",
            short_description="Vacuum-insulated cryogenic valve designed to prevent heat in-leak and boil-off gas in LNG bunkering, hydrogen fueling, and aerospace test facilities.",
            key_features=["-253°C Liquid Hydrogen certified", "10⁻⁵ Torr vacuum jacket insulation", "Extended vapor column thermal barrier"],
            applications=["LNG Bunkering Terminals", "Liquid Hydrogen Fueling Stations", "Aerospace Cryo Rocket Testing"],
            target_industries=["Cryogenic LNG & Clean Energy"],
            seo_meta_title="Chart VIP Cryogenic Valve - LNG & Liquid Hydrogen",
            seo_meta_description="Order Chart Industries VIP vacuum insulated cryogenic valve for LNG and LH2 lines.",
            seo_keywords=["Cryogenic Valve", "LNG Valve", "Liquid Hydrogen Valve", "Chart VIP Valve"],
            json_ld_schema={"@context": "https://schema.org/", "@type": "Product", "name": "Chart Cryogenic Vacuum Valve", "brand": "Chart Industries"},
            canonical_category="Cryogenic Process Valve"
        )
    )
    catalog.append(p_cryo)

    return catalog
