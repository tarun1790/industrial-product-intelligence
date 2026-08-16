import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Share2, ZoomIn, ZoomOut, RefreshCw, Info, Layers } from 'lucide-react';
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

    // Group color mappings
    const groupColors = {
      product: { background: '#0284c7', border: '#38bdf8' },
      manufacturer: { background: '#7c3aed', border: '#a78bfa' },
      category: { background: '#059669', border: '#34d399' },
      family: { background: '#d97706', border: '#fbbf24' },
      accessory: { background: '#475569', border: '#94a3b8' },
      legacy: { background: '#dc2626', border: '#f87171' },
      mating: { background: '#0d9488', border: '#2dd4bf' }
    };

    const visNodes = graphData.nodes.map(n => ({
      id: n.id,
      label: n.label,
      title: n.title,
      color: groupColors[n.group] || { background: '#334155', border: '#64748b' },
      font: { color: '#f8fafc', face: 'JetBrains Mono, monospace', size: 12 },
      shape: n.group === 'category' ? 'box' : n.group === 'manufacturer' ? 'hexagon' : 'dot',
      size: (n.value || 2) * 8,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 8 }
    }));

    const visEdges = graphData.edges.map((e, idx) => ({
      id: `e_${idx}`,
      from: e.from_node,
      to: e.to_node,
      label: e.label,
      arrows: 'to',
      color: { color: '#334155', highlight: '#38bdf8', opacity: 0.8 },
      font: { color: '#94a3b8', size: 9, face: 'monospace', align: 'middle', background: '#0f172a' },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                ONTOLOGY GRAPH
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-cyan-400" />
                Industrial Knowledge Graph Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-relational graph connecting industrial equipment, manufacturers, product families, mating mechanical seals, and legacy replacements.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">● Product</span>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">⬡ Manufacturer</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">■ Category</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">● Family</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">● Legacy</span>
          </div>
        </div>
      </div>

      {/* Network Canvas */}
      <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div ref={containerRef} className="network-graph-container" />

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg shadow-lg">
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

        {/* Node Inspector Overlay */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 max-w-sm p-4 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-wider">
                Node Type: {selectedNode.group}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white text-sm"
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
