from typing import Dict, List, Any

# Expanded Comprehensive Multi-Industry Industrial Ontologies
CATEGORY_ONTOLOGY: Dict[str, Dict[str, Any]] = {
    "Industrial Motor": {
        "industry": "Power Transmission & Heavy Machinery",
        "required_attributes": [
            "rated_power",
            "rated_voltage",
            "rated_frequency",
            "number_of_phases",
            "rated_speed_rpm",
            "rated_current",
            "efficiency_class",
            "efficiency_percentage",
            "power_factor",
            "ip_rating",
            "insulation_class",
            "frame_size",
            "mounting_type",
            "weight",
            "ambient_temp_max",
            "duty_type"
        ],
        "attribute_definitions": {
            "rated_power": {"display": "Rated Power", "canonical_unit": "kW", "units": ["kW", "W", "HP", "MW"]},
            "rated_voltage": {"display": "Rated Voltage", "canonical_unit": "V", "units": ["V", "kV"]},
            "rated_frequency": {"display": "Rated Frequency", "canonical_unit": "Hz", "units": ["Hz"]},
            "number_of_phases": {"display": "Phases", "canonical_unit": "", "units": []},
            "rated_speed_rpm": {"display": "Rated Speed", "canonical_unit": "RPM", "units": ["RPM", "rpm", "1/min"]},
            "rated_current": {"display": "Rated Current", "canonical_unit": "A", "units": ["A", "mA"]},
            "efficiency_class": {"display": "Efficiency Class", "canonical_unit": "", "units": []},
            "efficiency_percentage": {"display": "Efficiency", "canonical_unit": "%", "units": ["%"]},
            "power_factor": {"display": "Power Factor (cos φ)", "canonical_unit": "", "units": []},
            "ip_rating": {"display": "Ingress Protection", "canonical_unit": "", "units": []},
            "insulation_class": {"display": "Insulation Class", "canonical_unit": "", "units": []},
            "frame_size": {"display": "Frame Size", "canonical_unit": "", "units": []},
            "mounting_type": {"display": "Mounting Configuration", "canonical_unit": "", "units": []},
            "weight": {"display": "Net Weight", "canonical_unit": "kg", "units": ["kg", "g", "lbs", "lb"]},
            "ambient_temp_max": {"display": "Max Ambient Temp", "canonical_unit": "°C", "units": ["°C", "K", "°F"]},
            "duty_type": {"display": "Duty Rating", "canonical_unit": "", "units": []},
        },
        "standards": ["IEC 60034-1", "IEC 60034-30-1", "NEMA MG 1", "IEEE 841", "ISO 10816"]
    },
    "Rolling Bearing": {
        "industry": "Precision Motion & Tribology",
        "required_attributes": [
            "bore_diameter",
            "outer_diameter",
            "width",
            "dynamic_load_rating_c",
            "static_load_rating_c0",
            "limiting_speed_rpm",
            "reference_speed_rpm",
            "seal_type",
            "cage_material",
            "radial_internal_clearance",
            "weight"
        ],
        "attribute_definitions": {
            "bore_diameter": {"display": "Bore Diameter (d)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "outer_diameter": {"display": "Outer Diameter (D)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "width": {"display": "Width (B)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "dynamic_load_rating_c": {"display": "Dynamic Load Rating (C)", "canonical_unit": "kN", "units": ["kN", "N", "lbf"]},
            "static_load_rating_c0": {"display": "Static Load Rating (C0)", "canonical_unit": "kN", "units": ["kN", "N", "lbf"]},
            "reference_speed_rpm": {"display": "Reference Thermal Speed", "canonical_unit": "RPM", "units": ["RPM", "rpm", "r/min"]},
            "limiting_speed_rpm": {"display": "Limiting Kinematic Speed", "canonical_unit": "RPM", "units": ["RPM", "rpm", "r/min"]},
            "seal_type": {"display": "Sealing Shielding", "canonical_unit": "", "units": []},
            "cage_material": {"display": "Cage Material", "canonical_unit": "", "units": []},
            "radial_internal_clearance": {"display": "Internal Clearance", "canonical_unit": "", "units": []},
            "weight": {"display": "Mass", "canonical_unit": "kg", "units": ["kg", "g", "lbs"]}
        },
        "standards": ["ISO 15", "ISO 281", "ISO 76", "DIN 625", "ABMA Std 9"]
    },
    "Centrifugal Pump": {
        "industry": "Fluid Power & Process Hydraulics",
        "required_attributes": [
            "flow_rate_nominal",
            "head_nominal",
            "motor_power",
            "max_operating_pressure",
            "inlet_port_size",
            "outlet_port_size",
            "liquid_temp_max",
            "impeller_material",
            "efficiency_pump",
            "npsh_required"
        ],
        "attribute_definitions": {
            "flow_rate_nominal": {"display": "Nominal Flow Rate (Q)", "canonical_unit": "m³/h", "units": ["m³/h", "l/min", "GPM", "m3/h"]},
            "head_nominal": {"display": "Nominal Dynamic Head (H)", "canonical_unit": "m", "units": ["m", "ft", "bar"]},
            "motor_power": {"display": "Drive Motor Power (P2)", "canonical_unit": "kW", "units": ["kW", "HP", "W"]},
            "max_operating_pressure": {"display": "Max Working Pressure (PN)", "canonical_unit": "bar", "units": ["bar", "MPa", "psi"]},
            "inlet_port_size": {"display": "Suction Port / Flange", "canonical_unit": "DN", "units": ["DN", "inch", "mm"]},
            "outlet_port_size": {"display": "Discharge Port / Flange", "canonical_unit": "DN", "units": ["DN", "inch", "mm"]},
            "liquid_temp_max": {"display": "Max Fluid Temperature", "canonical_unit": "°C", "units": ["°C", "°F"]},
            "impeller_material": {"display": "Impeller Metallurgy", "canonical_unit": "", "units": []},
            "efficiency_pump": {"display": "Hydraulic Efficiency", "canonical_unit": "%", "units": ["%"]},
            "npsh_required": {"display": "NPSH Required", "canonical_unit": "m", "units": ["m", "ft"]}
        },
        "standards": ["ISO 5199", "ISO 9906 Grade 2B", "DIN EN 733", "HI 14.6"]
    },
    "Circuit Breaker": {
        "industry": "Electrical Power & Switchgear",
        "required_attributes": [
            "rated_current",
            "rated_voltage",
            "breaking_capacity_icu",
            "number_of_poles",
            "tripping_characteristic",
            "mounting_type",
            "utilization_category",
            "ip_rating"
        ],
        "attribute_definitions": {
            "rated_current": {"display": "Rated Current (In)", "canonical_unit": "A", "units": ["A", "mA"]},
            "rated_voltage": {"display": "Rated Operational Voltage (Ue)", "canonical_unit": "V", "units": ["V", "kV"]},
            "breaking_capacity_icu": {"display": "Short-Circuit Breaking Capacity (Icu)", "canonical_unit": "kA", "units": ["kA", "A"]},
            "number_of_poles": {"display": "Number of Poles", "canonical_unit": "P", "units": ["P", "poles"]},
            "tripping_characteristic": {"display": "Tripping Characteristic Curve", "canonical_unit": "", "units": []},
            "mounting_type": {"display": "Mounting Standard", "canonical_unit": "", "units": []},
            "utilization_category": {"display": "Utilization Category", "canonical_unit": "", "units": []},
            "ip_rating": {"display": "Terminal Protection Degree", "canonical_unit": "", "units": []}
        },
        "standards": ["IEC 60947-2", "IEC 60898-1", "UL 489", "CSA C22.2"]
    },
    "Pneumatic Actuator": {
        "industry": "Industrial Automation & Pneumatics",
        "required_attributes": [
            "bore_size",
            "stroke_length",
            "operating_pressure",
            "port_size",
            "cushioning",
            "theoretical_force_6bar",
            "ambient_temp_max",
            "piston_rod_thread"
        ],
        "attribute_definitions": {
            "bore_size": {"display": "Piston Bore (Ø)", "canonical_unit": "mm", "units": ["mm", "in", "inch"]},
            "stroke_length": {"display": "Stroke Length", "canonical_unit": "mm", "units": ["mm", "in", "inch"]},
            "operating_pressure": {"display": "Operating Pressure Range", "canonical_unit": "bar", "units": ["bar", "MPa", "psi"]},
            "port_size": {"display": "Pneumatic Port Connection", "canonical_unit": "", "units": []},
            "cushioning": {"display": "End-Position Cushioning", "canonical_unit": "", "units": []},
            "theoretical_force_6bar": {"display": "Theoretical Force @ 6 bar", "canonical_unit": "N", "units": ["N", "kN", "lbf"]},
            "ambient_temp_max": {"display": "Max Operating Temp", "canonical_unit": "°C", "units": ["°C", "°F"]},
            "piston_rod_thread": {"display": "Rod Thread", "canonical_unit": "", "units": []}
        },
        "standards": ["ISO 15552", "ISO 6431", "DIN ISO 6432", "VDMA 24562"]
    },
    "Industrial Sensor": {
        "industry": "Process Instrumentation & Sensing",
        "required_attributes": [
            "sensing_range",
            "output_type",
            "supply_voltage",
            "switching_frequency",
            "ip_rating",
            "operating_temp_range",
            "housing_material",
            "connection_type"
        ],
        "attribute_definitions": {
            "sensing_range": {"display": "Nominal Sensing Range (Sn)", "canonical_unit": "mm", "units": ["mm", "m", "cm"]},
            "output_type": {"display": "Output Function (PNP/NPN/Analog)", "canonical_unit": "", "units": []},
            "supply_voltage": {"display": "Operating Supply Voltage", "canonical_unit": "V", "units": ["V", "VDC", "VAC"]},
            "switching_frequency": {"display": "Switching Frequency", "canonical_unit": "Hz", "units": ["Hz", "kHz"]},
            "ip_rating": {"display": "Enclosure Rating", "canonical_unit": "", "units": []},
            "operating_temp_range": {"display": "Operating Temperature Range", "canonical_unit": "°C", "units": ["°C", "°F"]},
            "housing_material": {"display": "Housing Metallurgy / Resin", "canonical_unit": "", "units": []},
            "connection_type": {"display": "Electrical Connection", "canonical_unit": "", "units": []}
        },
        "standards": ["IEC 60947-5-2", "EN 61000-6-2", "cULus Listed", "IP69K DIN 40050-9"]
    }
}

INDUSTRIES_LIST = [
    "All Industries",
    "Power Transmission & Heavy Machinery",
    "Precision Motion & Tribology",
    "Fluid Power & Process Hydraulics",
    "Electrical Power & Switchgear",
    "Industrial Automation & Pneumatics",
    "Process Instrumentation & Sensing"
]
