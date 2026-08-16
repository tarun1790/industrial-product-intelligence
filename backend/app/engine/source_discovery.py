from typing import List, Dict, Any
from app.models.schemas import DiscoveredSource, SourceDiscoveryReport

DISCOVERY_REGISTRY: Dict[str, List[DiscoveredSource]] = {
    "M3BP 160MLA 4": [
        DiscoveredSource(
            id="src_oem_datasheet_2024",
            source_type="OEM_DATASHEET_PDF",
            source_name="ABB Process Performance Motors Technical Datasheet Rev C",
            uri_or_pub_id="ABB-DOC-3GZF500730-160M-REV-C",
            publication_year=2024,
            authority_score=1.00,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=14,
            notes="Primary OEM engineering release with IEC 60034-30-1 verified test report."
        ),
        DiscoveredSource(
            id="src_oem_portal",
            source_type="OEM_PRIMARY_PAGE",
            source_name="ABB Official Product Portal Catalog",
            uri_or_pub_id="https://new.abb.com/products/3GBP161410-BDL/m3bp-160mla-4",
            publication_year=2024,
            authority_score=1.00,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=9,
            notes="Live manufacturer commerce and dimensional drawing portal."
        ),
        DiscoveredSource(
            id="src_oem_manual",
            source_type="TECHNICAL_MANUAL",
            source_name="ABB Low Voltage Motors Installation & Maintenance Manual",
            uri_or_pub_id="ABB-MAN-LV-2023-EN",
            publication_year=2023,
            authority_score=0.95,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=6,
            notes="Contains lubrication intervals, terminal connection diagrams, and bearing specs."
        ),
        DiscoveredSource(
            id="src_distributor_catalog",
            source_type="DISTRIBUTOR_CATALOG",
            source_name="RS Components Industrial Drive & Motor Catalog",
            uri_or_pub_id="RS-CAT-2021-SEC4",
            publication_year=2021,
            authority_score=0.70,
            status="DERATED",
            extracted_parameters_count=5,
            notes="Legacy listing with older 42kg weight listing prior to cast-iron housing upgrade."
        ),
        DiscoveredSource(
            id="src_historical_archive",
            source_type="HISTORICAL_ARCHIVE",
            source_name="ABB Motor Engineering Archive 2020",
            uri_or_pub_id="ABB-ARCHIVE-2020-M3BP",
            publication_year=2020,
            authority_score=0.80,
            status="ARCHIVED",
            extracted_parameters_count=8,
            notes="Reference for historical lifecycle tracking and ECN changelog."
        )
    ],
    "6205-2RSH": [
        DiscoveredSource(
            id="src_skf_pub17000",
            source_type="OEM_DATASHEET_PDF",
            source_name="SKF Rolling Bearings Master Catalog PUB 17000",
            uri_or_pub_id="SKF-PUB-17000-1-EN-2024",
            publication_year=2024,
            authority_score=1.00,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=12,
            notes="Authoritative ISO 15 / ISO 281 reference with Explorer steel upgrade ratings."
        ),
        DiscoveredSource(
            id="src_skf_portal",
            source_type="OEM_PRIMARY_PAGE",
            source_name="SKF Product Online Knowledge Base",
            uri_or_pub_id="https://www.skf.com/group/products/rolling-bearings/ball-bearings/deep-groove-ball-bearings/productid-6205-2RSH",
            publication_year=2024,
            authority_score=1.00,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=8,
            notes="Live CAD model and bearing calculation tool source."
        ),
        DiscoveredSource(
            id="src_motion_dist",
            source_type="DISTRIBUTOR_CATALOG",
            source_name="Motion Industries Power Transmission Catalog",
            uri_or_pub_id="MOTION-CAT-2023-BRG",
            publication_year=2023,
            authority_score=0.70,
            status="ACTIVE_HARVESTED",
            extracted_parameters_count=5,
            notes="MRO distributor inventory feed."
        )
    ]
}

class SourceDiscoveryEngine:
    @classmethod
    def discover_sources_for_product(
        cls,
        part_number: str,
        manufacturer: str = "ABB"
    ) -> SourceDiscoveryReport:
        clean_part = part_number.strip().upper()
        
        # Check in discovery registry
        for key, sources in DISCOVERY_REGISTRY.items():
            if key.upper() in clean_part or clean_part in key.upper():
                return SourceDiscoveryReport(
                    product_identity=f"{manufacturer} {part_number}",
                    total_sources_discovered=len(sources),
                    ranked_sources=sources,
                    discovery_method="MULTI_MODAL_AGENTIC_REGISTRY"
                )

        # Fallback generated sources
        fallback_sources = [
            DiscoveredSource(
                id="src_gen_oem",
                source_type="OEM_DATASHEET_PDF",
                source_name=f"{manufacturer} Technical Datasheet & Drawing",
                uri_or_pub_id=f"OEM-DOC-{clean_part.replace(' ', '-')}-2024",
                publication_year=2024,
                authority_score=1.00,
                status="ACTIVE_HARVESTED",
                extracted_parameters_count=8,
                notes="Primary manufacturer technical documentation."
            ),
            DiscoveredSource(
                id="src_gen_dist",
                source_type="DISTRIBUTOR_CATALOG",
                source_name="Authorized Industrial Supply Master Index",
                uri_or_pub_id="IND-DIST-CAT-2023",
                publication_year=2023,
                authority_score=0.70,
                status="ACTIVE_HARVESTED",
                extracted_parameters_count=4,
                notes="Secondary distributor technical parameters."
            )
        ]
        
        return SourceDiscoveryReport(
            product_identity=f"{manufacturer} {part_number}",
            total_sources_discovered=len(fallback_sources),
            ranked_sources=fallback_sources,
            discovery_method="MULTI_MODAL_AGENTIC_REGISTRY"
        )
