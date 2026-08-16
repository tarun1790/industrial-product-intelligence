import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Share2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { fetchKnowledgeGraph } from '../services/api';

export default function KnowledgeGraphView({ onSelectProduct }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await fetchKnowledgeGraph();
      setGraphData(data);
    } catch (err) {
      console.error('Failed to load graph:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Clean industrial muted palette
    const groupColors = {
      product: { background: '#2563eb', border: '#60a5fa' },
      manufacturer: { background: '#d97706', border: '#fbbf24' },
      category: { background: '#059669', border: '#34d399' },
      family: { background: '#475569', border: '#94a3b8' },
      accessory: { background: '#334155', border: '#64748b' },
      legacy: { background: '#dc2626', border: '#f87171' },
      mating: { background: '#0d9488', border: '#2dd4bf' }
    };

    const visNodes = graphData.nodes.map(n => ({
      id: n.id,
      label: n.label,
      title: n.title,
      color: groupColors[n.group] || { background: '#334155', border: '#64748b' },
      font: { color: '#f8fafc', face: 'JetBrains Mono, monospace', size: 11 },
      shape: n.group === 'category' ? 'box' : n.group === 'manufacturer' ? 'hexagon' : 'dot',
      size: (n.value || 2) * 7,
      shadow: { enabled: false }
    }));

    const visEdges = graphData.edges.map((e, idx) => ({
      id: `e_${idx}`,
      from: e.from_node,
      to: e.to_node,
      label: e.label,
      arrows: 'to',
      color: { color: '#334155', highlight: '#f59e0b', opacity: 0.8 },
      font: { color: '#94a3b8', size: 9, face: 'monospace', align: 'middle', background: '#020617' },
      smooth: { type: 'continuous' }
    }));

    const data = {
      nodes: new DataSet(visNodes),
      edges: new DataSet(visEdges)
    };

    const options = {
      physics: {
        stabilization: { iterations: 120 },
        barnesHut: {
          gravitationalConstant: -3500,
          springLength: 95,
          springConstant: 0.04
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);

    networkRef.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeObj = graphData.nodes.find(n => n.id === nodeId);
        setSelectedNode(nodeObj);
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      if (networkRef.current) networkRef.current.destroy();
    };
  }, [graphData]);

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                ONTOLOGY GRAPH
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-400" />
                Industrial Knowledge Graph Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-relational graph connecting industrial equipment, manufacturers, product families, mating mechanical seals, and legacy replacements.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">● Product</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">⬡ Manufacturer</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">■ Category</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">● Family</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">● Legacy</span>
          </div>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div ref={containerRef} className="network-graph-container" />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-lg">
          <button
            onClick={() => networkRef.current?.moveTo({ scale: (networkRef.current.getScale() || 1) * 1.2 })}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => networkRef.current?.moveTo({ scale: (networkRef.current.getScale() || 1) * 0.8 })}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={loadGraph}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            title="Reset Simulation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Node Inspector */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 max-w-sm p-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-amber-400 font-bold">
                {selectedNode.group}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-sm font-bold text-white">{selectedNode.label}</div>
            {selectedNode.title && (
              <p className="text-slate-400 whitespace-pre-line text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                {selectedNode.title}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
