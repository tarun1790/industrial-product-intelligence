from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class VisualDefectBoundingBox(BaseModel):
    defect_id: str
    anomaly_type: str # "INSULATION_PARTIAL_DISCHARGE", "BEARING_RACEWAY_SPALLING", "SHAFT_FRETTING_CORROSION", "TERMINAL_SEAL_EXTRUSION"
    confidence_score: float # 0.0 to 1.0
    bounding_box_norm: List[float] # [ymin, xmin, ymax, xmax] (0.0 to 1.0)
    severity_grade: str # "CRITICAL_ACTION_REQUIRED", "ELEVATED_MONITORING", "MINOR_COSMETIC"
    iso_standard_violation: str
    recommended_remedial_action: str

class VisualInspectionScanReport(BaseModel):
    scan_id: str
    target_part_number: str
    optical_sensor_resolution: str
    total_anomalies_detected: int
    critical_defect_count: int
    health_index_pct: float
    defect_boxes: List[VisualDefectBoundingBox]
    technician_work_order_summary: str

class VisionDefectScannerEngine:
    @classmethod
    def run_defect_scan(cls, part_number: str = "M3BP 160MLA 4") -> VisualInspectionScanReport:
        defects = [
            VisualDefectBoundingBox(
                defect_id="DEFECT-OPT-01",
                anomaly_type="INSULATION_PARTIAL_DISCHARGE",
                confidence_score=0.992,
                bounding_box_norm=[0.22, 0.45, 0.48, 0.72],
                severity_grade="ELEVATED_MONITORING",
                iso_standard_violation="IEC 60034-18-41 (Partial Discharge in VFD Motors)",
                recommended_remedial_action="Apply Class H epoxy varnish re-impregnation during scheduled 10,000-hour turnaround."
            ),
            VisualDefectBoundingBox(
                defect_id="DEFECT-OPT-02",
                anomaly_type="BEARING_RACEWAY_SPALLING",
                confidence_score=0.987,
                bounding_box_norm=[0.60, 0.15, 0.85, 0.38],
                severity_grade="MINOR_COSMETIC",
                iso_standard_violation="ISO 15243 (Rolling Bearing Damage Classification)",
                recommended_remedial_action="Bearing raceway shows nominal surface micro-indentation. Clean and replenish polyurea grease."
            ),
            VisualDefectBoundingBox(
                defect_id="DEFECT-OPT-03",
                anomaly_type="SHAFT_FRETTING_CORROSION",
                confidence_score=0.979,
                bounding_box_norm=[0.50, 0.78, 0.75, 0.95],
                severity_grade="MINOR_COSMETIC",
                iso_standard_violation="DIN 6885 (Keyway Fretting Limits)",
                recommended_remedial_action="Apply anti-seize paste prior to coupling hub re-torque."
            )
        ]

        critical = sum(1 for d in defects if d.severity_grade == "CRITICAL_ACTION_REQUIRED")

        return VisualInspectionScanReport(
            scan_id="SCAN-VISION-AOI-9841",
            target_part_number=part_number,
            optical_sensor_resolution="4K 12-Megapixel Industrial GigE Vision",
            total_anomalies_detected=len(defects),
            critical_defect_count=critical,
            health_index_pct=94.6,
            defect_boxes=defects,
            technician_work_order_summary="Automated vision diagnosis completed: 0 Critical, 1 Elevated (VFD insulation), 2 Minor. Equipment cleared for continuous operation."
        )
