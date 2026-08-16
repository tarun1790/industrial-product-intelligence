import React, { useState, useEffect } from 'react';
import { Share2, RefreshCw, Layers, Cpu, CheckCircle2, ShieldCheck, Search } from 'lucide-react';
import { fetchKnowledgeGraph } from '../services/api';

export default function KnowledgeGraphView({ onSelectProduct }) {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const g = await fetchKnowledgeGraph();
      setGraphData(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Relational Knowledge Graph
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600" />
                Industrial Ontology Knowledge Graph & Component Relationships
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Topological relationship map linking electric motors, deep groove bearings, drive inverters (VFDs), and mechanical mating standards.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Graph Topology</span>
            <span className="font-bold text-blue-700">
              {graphData.nodes?.length || 8} Entities • {graphData.edges?.length || 7} Invariant Edges
            </span>
          </div>
        </div>
      </div>

      {/* Graph Visual Canvas & Node Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Interactive Topology Representation */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Component Topological Graph Nodes
            </span>
            <span className="text-xs text-slate-500">Click a node to inspect entity details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {graphData.nodes?.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-white text-blue-700 border border-slate-200 font-mono">
                    {node.type}
                  </span>
                  <div className="font-bold text-xs text-slate-900 mt-2">{node.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{node.details}</div>
                </button>
              );
            })}
          </div>

          {/* Relationship Edges List */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Verified Inter-Component Relationships ({graphData.edges?.length || 0} Edges):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {graphData.edges?.map((edge, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-slate-900 truncate max-w-[120px]">{edge.from}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                    -- {edge.label} --&gt;
                  </span>
                  <span className="font-semibold text-slate-900 truncate max-w-[120px]">{edge.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Node Property Inspector */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Entity Property Inspector
          </h4>

          {selectedNode ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Entity Name:</span>
                <div className="text-sm font-bold text-slate-900">{selectedNode.label}</div>
                <div className="text-blue-700 font-semibold font-mono text-[11px]">{selectedNode.type}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-slate-700 leading-relaxed">
                <span className="text-slate-900 font-bold block">Technical Description:</span>
                {selectedNode.details}
              </div>

              <button
                onClick={() => onSelectProduct && onSelectProduct({ title: selectedNode.label, part_number: selectedNode.id, manufacturer: 'ABB', category: selectedNode.type })}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all cursor-pointer shadow-xs"
              >
                Inspect in Studio
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Click any entity node on the left to inspect properties and connected mechanical constraints.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
