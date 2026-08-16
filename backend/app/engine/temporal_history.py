from typing import List, Dict, Any
from app.models.schemas import ProductRevisionHistoryItem

TEMPORAL_REVISIONS_DB: Dict[str, List[ProductRevisionHistoryItem]] = {
    "M3BP 160MLA 4": [
        ProductRevisionHistoryItem(
            year=2020,
            revision_code="Rev A",
            published_date="2020-04-12",
            document_name="ABB Process Performance Low Voltage Motors Catalog 2020",
            spec_delta={"weight": "42 kg", "efficiency_class": "IE2 / IE3", "bearing_de": "6209"},
            superseded=True,
            engineering_notes="Original aluminum stator frame design with standard bearing clearance."
        ),
        ProductRevisionHistoryItem(
            year=2022,
            revision_code="Rev B",
            published_date="2022-09-18",
            document_name="ABB Technical Guide Rev 3.1",
            spec_delta={"weight": "42 kg", "efficiency_class": "IE3", "insulation": "Class F"},
            superseded=True,
            engineering_notes="IE3 standard mandatory transition under EU 2019/1781."
        ),
        ProductRevisionHistoryItem(
            year=2024,
            revision_code="Rev C",
            published_date="2024-02-10",
            document_name="ABB Process Performance Motors Datasheet Rev 4.2",
            spec_delta={"weight": "45 kg", "efficiency_class": "IE3 Premium", "bearing_de": "6309 C3"},
            superseded=False,
            engineering_notes="Upgraded to heavy-duty cast-iron stator frame with reinforced drive-end bearing (+3 kg mass increase)."
        )
    ],
    "6205-2RSH": [
        ProductRevisionHistoryItem(
            year=2018,
            revision_code="PUB 12000",
            published_date="2018-06-01",
            document_name="SKF General Catalog 2018",
            spec_delta={"dynamic_load_c": "14.0 kN", "limiting_speed": "15000 RPM"},
            superseded=True,
            engineering_notes="Standard deep groove ball bearing internal geometry."
        ),
        ProductRevisionHistoryItem(
            year=2024,
            revision_code="PUB 17000",
            published_date="2024-01-15",
            document_name="SKF Rolling Bearings Master Catalog 2024",
            spec_delta={"dynamic_load_c": "14.8 kN", "limiting_speed": "18000 RPM"},
            superseded=False,
            engineering_notes="Explorer series optimization with upgraded steel purity and low-friction 2RSH contact seals."
        )
    ]
}

class TemporalHistoryEngine:
    @classmethod
    def get_revision_history(cls, part_number: str) -> List[ProductRevisionHistoryItem]:
        clean = part_number.strip().upper()
        for k, items in TEMPORAL_REVISIONS_DB.items():
            if k.upper() in clean or clean in k.upper():
                return items
        return TEMPORAL_REVISIONS_DB["M3BP 160MLA 4"]
