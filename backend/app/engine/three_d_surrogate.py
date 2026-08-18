import math
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class MeshComponent3D(BaseModel):
    component_id: str
    label: str
    geometry_type: str # "CYLINDER", "BOX", "DISC", "FINNED_SHELL"
    spatial_coords_xyz: List[float] # [x, y, z] center
    dimensions_xyz: List[float] # [length, radius/width, height]
    material_render_color: str
    telemetry_variable: str
    operating_temperature_c: float
    stress_status: str # "NOMINAL", "ELEVATED", "HOTSPOT"
    subassembly_hierarchy: str

class DigitalTwin3DReport(BaseModel):
    part_number: str
    mesh_resolution: str
    rotational_velocity_rad_s: float
    current_rpm: float
    is_cutaway_view_available: bool
    components: List[MeshComponent3D]
    global_thermal_gradient: Dict[str, float]
    stream_fps: int

class ThreeDSurrogateEngine:
    @classmethod
    def generate_3d_digital_twin(cls, part_number: str = "M3BP 160MLA 4", load_factor: float = 85.0) -> DigitalTwin3DReport:
        rpm = 1465.0 * (load_factor / 100.0)
        omega = (rpm * 2.0 * math.pi) / 60.0 # rad/s

        components = [
            MeshComponent3D(
                component_id="COMP-STATOR-BODY",
                label="Cast-Iron Stator Housing & Fins",
                geometry_type="FINNED_SHELL",
                spatial_coords_xyz=[0.0, 0.0, 0.0],
                dimensions_xyz=[330.0, 160.0, 395.0],
                material_render_color="#334155",
                telemetry_variable="Housing_Surface_Temp",
                operating_temperature_c=52.4,
                stress_status="NOMINAL",
                subassembly_hierarchy="Enclosure"
            ),
            MeshComponent3D(
                component_id="COMP-COPPER-WINDING",
                label="Stator Copper Winding End-Turns",
                geometry_type="CYLINDER",
                spatial_coords_xyz=[0.0, 0.0, 0.0],
                dimensions_xyz=[260.0, 110.0, 110.0],
                material_render_color="#ef4444",
                telemetry_variable="Winding_Hotspot_Temp",
                operating_temperature_c=88.6,
                stress_status="HOTSPOT",
                subassembly_hierarchy="Electromagnetic"
            ),
            MeshComponent3D(
                component_id="COMP-ROTOR-SHAFT",
                label="42CrMo4 Tempered Rotor Shaft Ø42mm",
                geometry_type="CYLINDER",
                spatial_coords_xyz=[50.0, 0.0, 0.0],
                dimensions_xyz=[612.0, 21.0, 21.0],
                material_render_color="#38bdf8",
                telemetry_variable="Shaft_Speed_RPM",
                operating_temperature_c=64.2,
                stress_status="NOMINAL",
                subassembly_hierarchy="Mechanical_Drive"
            ),
            MeshComponent3D(
                component_id="COMP-DRIVE-BEARING",
                label="Drive-End Deep Groove Ball Bearing 6309 C3",
                geometry_type="DISC",
                spatial_coords_xyz=[160.0, 0.0, 0.0],
                dimensions_xyz=[25.0, 50.0, 50.0],
                material_render_color="#f59e0b",
                telemetry_variable="Vibration_RMS_Velocity",
                operating_temperature_c=68.1,
                stress_status="NOMINAL",
                subassembly_hierarchy="Tribology"
            ),
            MeshComponent3D(
                component_id="COMP-COOLING-FAN",
                label="Bi-Directional Polypropylene Cooling Fan",
                geometry_type="DISC",
                spatial_coords_xyz=[-200.0, 0.0, 0.0],
                dimensions_xyz=[40.0, 140.0, 140.0],
                material_render_color="#0284c7",
                telemetry_variable="Airflow_Volume_m3s",
                operating_temperature_c=38.0,
                stress_status="NOMINAL",
                subassembly_hierarchy="Thermal_Management"
            )
        ]

        return DigitalTwin3DReport(
            part_number=part_number,
            mesh_resolution="HIGH_POLY_ISOMETRIC_SURROGATE",
            rotational_velocity_rad_s=round(omega, 2),
            current_rpm=round(rpm, 1),
            is_cutaway_view_available=True,
            components=components,
            global_thermal_gradient={"min_c": 38.0, "mean_c": 62.3, "max_hotspot_c": 88.6},
            stream_fps=60
        )
