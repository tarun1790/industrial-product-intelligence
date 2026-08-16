import React from 'react';
import { Cpu, ShieldCheck, Database, GitMerge, FileCheck2, Share2, Search, SlidersHorizontal, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedProduct }) {
  const tabs = [
    { id: 'ingest', label: '1. Ingestion Pipeline', icon: Cpu, badge: 'Extract' },
    { id: 'evidence', label: '2. Evidence & Provenance', icon: ShieldCheck, badge: 'Prove' },
    { id: 'conflicts', label: '3. Conflict Audit', icon: GitMerge, badge: selectedProduct?.conflicts?.length ? `${selectedProduct.conflicts.length} Resolved` : null },
    { id: 'validation', label: '4. Physics Sanity', icon: FileCheck2, badge: `${selectedProduct?.trust_score || 100}% Trust` },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'commerce', label: 'Commerce Engine', icon: Database },
    { id: 'search', label: 'Parametric Search & Compare', icon: Search },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Product<span className="text-cyan-400">IQ</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  GPU ACCELERATED
                </span>
              </div>
              <p className="text-xs text-slate-400">Extract → Enrich → Validate → Prove</p>
            </div>
          </div>

          {/* Quick Metrics */}
          {selectedProduct && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <div className="text-xs">
                <span className="text-slate-400">Active Spec: </span>
                <span className="font-semibold text-white">{selectedProduct.manufacturer} {selectedProduct.part_number}</span>
              </div>
              <div className="h-4 w-px bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{selectedProduct.trust_score}% Trust Score</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-cyan-900/60 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
