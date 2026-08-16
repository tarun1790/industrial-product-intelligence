from typing import List, Dict, Any
from app.models.schemas import KnowledgeGraphData, KnowledgeGraphNode, KnowledgeGraphEdge, Product

class KnowledgeGraphEngine:
    @classmethod
    def build_graph_from_products(cls, products: List[Product]) -> KnowledgeGraphData:
        nodes_dict: Dict[str, KnowledgeGraphNode] = {}
        edges: List[KnowledgeGraphEdge] = []

        for p in products:
            # 1. Product Node
            p_node_id = f"prod_{p.id}"
            nodes_dict[p_node_id] = KnowledgeGraphNode(
                id=p_node_id,
                label=f"{p.manufacturer} {p.part_number}",
                group="product",
                title=f"Category: {p.category}\nTrust Score: {p.trust_score}%",
                value=3
            )

            # 2. Manufacturer Node
            m_node_id = f"mfg_{p.manufacturer.lower().replace(' ', '_')}"
            if m_node_id not in nodes_dict:
                nodes_dict[m_node_id] = KnowledgeGraphNode(
                    id=m_node_id,
                    label=p.manufacturer,
                    group="manufacturer",
                    title="Industrial OEM Manufacturer",
                    value=4
                )
            edges.append(KnowledgeGraphEdge(
                from_node=p_node_id,
                to_node=m_node_id,
                label="MANUFACTURED_BY"
            ))

            # 3. Category Node
            c_node_id = f"cat_{p.category.lower().replace(' ', '_')}"
            if c_node_id not in nodes_dict:
                nodes_dict[c_node_id] = KnowledgeGraphNode(
                    id=c_node_id,
                    label=p.category,
                    group="category",
                    title="Equipment Taxonomy Class",
                    value=5
                )
            edges.append(KnowledgeGraphEdge(
                from_node=p_node_id,
                to_node=c_node_id,
                label="BELONGS_TO"
            ))

            # 4. Product Family Node
            if p.product_family:
                f_node_id = f"fam_{p.product_family.lower().replace(' ', '_')}"
                if f_node_id not in nodes_dict:
                    nodes_dict[f_node_id] = KnowledgeGraphNode(
                        id=f_node_id,
                        label=p.product_family,
                        group="family",
                        title=f"Series / Product Line of {p.manufacturer}",
                        value=3
                    )
                    edges.append(KnowledgeGraphEdge(
                        from_node=f_node_id,
                        to_node=m_node_id,
                        label="SERIES_OF"
                    ))
                edges.append(KnowledgeGraphEdge(
                    from_node=p_node_id,
                    to_node=f_node_id,
                    label="PART_OF_SERIES"
                ))

            # 5. Compatible accessories / mating parts
            for comp in p.compatible_products:
                comp_node_id = f"comp_{comp.lower().replace(' ', '_')}"
                if comp_node_id not in nodes_dict:
                    nodes_dict[comp_node_id] = KnowledgeGraphNode(
                        id=comp_node_id,
                        label=comp,
                        group="accessory",
                        title="Compatible Industrial Subsystem / Drive",
                        value=2
                    )
                edges.append(KnowledgeGraphEdge(
                    from_node=p_node_id,
                    to_node=comp_node_id,
                    label="COMPATIBLE_WITH"
                ))

            for repl in p.replacement_for:
                repl_node_id = f"repl_{repl.lower().replace(' ', '_')}"
                if repl_node_id not in nodes_dict:
                    nodes_dict[repl_node_id] = KnowledgeGraphNode(
                        id=repl_node_id,
                        label=f"{repl} (Legacy)",
                        group="legacy",
                        title="Obsolete / Legacy Model",
                        value=2
                    )
                edges.append(KnowledgeGraphEdge(
                    from_node=p_node_id,
                    to_node=repl_node_id,
                    label="REPLACES"
                ))

            for mate in p.mating_components:
                mate_node_id = f"mate_{mate.lower().replace(' ', '_')}"
                if mate_node_id not in nodes_dict:
                    nodes_dict[mate_node_id] = KnowledgeGraphNode(
                        id=mate_node_id,
                        label=mate,
                        group="mating",
                        title="Mating Bearing / Mechanical Seal",
                        value=2
                    )
                edges.append(KnowledgeGraphEdge(
                    from_node=p_node_id,
                    to_node=mate_node_id,
                    label="MATES_WITH"
                ))

        return KnowledgeGraphData(
            nodes=list(nodes_dict.values()),
            edges=edges
        )
