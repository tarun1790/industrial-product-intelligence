from typing import Dict, List, Any

CATEGORY_ONTOLOGY: Dict[str, Dict[str, Any]] = {
    "Industrial Motor": {
        "required_attributes": [
            "rated_power",
            "rated_voltage",
            "rated_frequency",
            "number_of_phases",
            "rated_speed_rpm",
            "rated_current",
            "efficiency_class",
            "ip_rating",
            "insulation_class",
            "frame_size",
            "mounting_type",
            "weight"
        ],
        "attribute_definitions": {
            "rated_power": {"display": "Rated Power", "canonical_unit": "kW", "units": ["kW", "W", "HP"]},
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
            "mounting_type": {"display": "Mounting Type", "canonical_unit": "", "units": []},
            "weight": {"display": "Weight", "canonical_unit": "kg", "units": ["kg", "g", "lbs", "lb"]},
            "ambient_temp_max": {"display": "Max Ambient Temp", "canonical_unit": "°C", "units": ["°C", "K", "°F"]},
            "ambient_temp_min": {"display": "Min Ambient Temp", "canonical_unit": "°C", "units": ["°C", "K", "°F"]},
            "duty_type": {"display": "Duty Type", "canonical_unit": "", "units": []},
        },
        "standards": ["IEC 60034-1", "IEC 60034-30-1", "NEMA MG 1", "ISO 9001"]
    },
    "Rolling Bearing": {
        "required_attributes": [
            "bore_diameter",
            "outer_diameter",
            "width",
            "dynamic_load_rating_c",
            "static_load_rating_c0",
            "limiting_speed_rpm",
            "seal_type",
            "cage_material"
        ],
        "attribute_definitions": {
            "bore_diameter": {"display": "Bore Diameter (d)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "outer_diameter": {"display": "Outer Diameter (D)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "width": {"display": "Width (B)", "canonical_unit": "mm", "units": ["mm", "inch", "in"]},
            "dynamic_load_rating_c": {"display": "Dynamic Load Rating (C)", "canonical_unit": "kN", "units": ["kN", "N", "lbf"]},
            "static_load_rating_c0": {"display": "Static Load Rating (C0)", "canonical_unit": "kN", "units": ["kN", "N", "lbf"]},
            "reference_speed_rpm": {"display": "Reference Speed", "canonical_unit": "RPM", "units": ["RPM", "rpm", "r/min"]},
            "limiting_speed_rpm": {"display": "Limiting Speed", "canonical_unit": "RPM", "units": ["RPM", "rpm", "r/min"]},
            "seal_type": {"display": "Sealing", "canonical_unit": "", "units": []},
            "cage_material": {"display": "Cage Material", "canonical_unit": "", "units": []},
            "radial_internal_clearance": {"display": "Internal Clearance", "canonical_unit": "", "units": []},
            "weight": {"display": "Weight", "canonical_unit": "kg", "units": ["kg", "g", "lbs"]}
        },
        "standards": ["ISO 15", "DIN 625", "ABMA"]
    },
    "Centrifugal Pump": {
        "required_attributes": [
            "flow_rate_nominal",
            "head_nominal",
            "motor_power",
            "max_operating_pressure",
            "inlet_port_size",
            "outlet_port_size",
            "liquid_temp_max",
            "impeller_material"
        ],
        "attribute_definitions": {
            "flow_rate_nominal": {"display": "Nominal Flow Rate", "canonical_unit": "m³/h", "units": ["m³/h", "l/min", "GPM"]},
            "head_nominal": {"display": "Nominal Head", "canonical_unit": "m", "units": ["m", "ft", "bar"]},
            "motor_power": {"display": "Motor Power", "canonical_unit": "kW", "units": ["kW", "HP", "W"]},
            "max_operating_pressure": {"display": "Max Operating Pressure", "canonical_unit": "bar", "units": ["bar", "MPa", "psi"]},
            "inlet_port_size": {"display": "Inlet Flange / Port", "canonical_unit": "DN", "units": ["DN", "inch", "mm"]},
            "outlet_port_size": {"display": "Outlet Flange / Port", "canonical_unit": "DN", "units": ["DN", "inch", "mm"]},
            "liquid_temp_max": {"display": "Max Liquid Temperature", "canonical_unit": "°C", "units": ["°C", "°F"]},
            "impeller_material": {"display": "Impeller Material", "canonical_unit": "", "units": []},
            "efficiency_pump": {"display": "Hydraulic Efficiency", "canonical_unit": "%", "units": ["%"]}
        },
        "standards": ["ISO 5199", "ISO 9906", "DIN EN 733"]
    },
    "Circuit Breaker": {
        "required_attributes": [
            "rated_current",
            "rated_voltage",
            "breaking_capacity_icu",
            "number_of_poles",
            "tripping_characteristic",
            "mounting_type"
        ],
        "attribute_definitions": {
            "rated_current": {"display": "Rated Current (In)", "canonical_unit": "A", "units": ["A", "mA"]},
            "rated_voltage": {"display": "Rated Operational Voltage (Ue)", "canonical_unit": "V", "units": ["V", "kV"]},
            "breaking_capacity_icu": {"display": "Ultimate Breaking Capacity (Icu)", "canonical_unit": "kA", "units": ["kA", "A"]},
            "number_of_poles": {"display": "Number of Poles", "canonical_unit": "P", "units": ["P", "poles"]},
            "tripping_characteristic": {"display": "Trip Curve / Characteristic", "canonical_unit": "", "units": []},
            "mounting_type": {"display": "Mounting Style", "canonical_unit": "", "units": []},
            "ip_rating": {"display": "Protection Degree", "canonical_unit": "", "units": []}
        },
        "standards": ["IEC 60947-2", "IEC 60898-1", "UL 489"]
    }
}
