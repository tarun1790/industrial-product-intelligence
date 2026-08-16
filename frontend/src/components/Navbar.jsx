import React from 'react';
import { ShieldCheck, Database, GitMerge, FileCheck2, Share2, Search, ArrowLeftRight, Activity, ShieldAlert, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedProduct, activeIndustry, setActiveIndustry, industriesMeta }) {
  const tabs = [
    { id: 'ingest', label: '1. Ingestion', icon: Layers, badge: 'Extract' },
    { id: 'evidence', label: '2. Evidence', icon: ShieldCheck, badge: 'Prove' },
    { id: 'conflicts', label: '3. Conflicts', icon: GitMerge, badge: selectedProduct?.conflicts?.length ? `${selectedProduct.conflicts.length} Resolved` : null },
    { id: 'validation', label: '4. Physics', icon: FileCheck2, badge: `${selectedProduct?.trust_score || 100}% Trust` },
    { id: 'interchange', label: '5. Cross-Ref', icon: ArrowLeftRight, badge: 'Drop-In' },
    { id: 'curves', label: '6. Curves & L10h', icon: Activity, badge: 'Simulate' },
    { id: 'compliance', label: '7. HazLoc / ATEX', icon: ShieldAlert, badge: 'Safety' },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'commerce', label: 'Commerce PIM', icon: Database },
    { id: 'search', label: 'Parametric Search', icon: Search },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      {/* Top Telemetry Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-900 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ENGINE: ONLINE
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">
            CATALOG: {industriesMeta?.total_catalog_size || 12} VERIFIED SPECS
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:inline text-slate-400">
            PHYSICS & FATIGUE VERIFIER: ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            GPU: CUDA READY
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            SPEC: ISO/IEC ENFORCED
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo with Mechanical Wrench SVG */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white font-mono">Product<span className="text-amber-400">IQ</span></span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                  ENTERPRISE
                </span>
              </div>
            </div>
          </div>

          {/* Active Spec Info */}
          {selectedProduct && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500">SPEC: </span>
                <span className="font-bold text-white">{selectedProduct.manufacturer} {selectedProduct.part_number}</span>
                <span className="text-slate-500 text-[11px] ml-1.5">({selectedProduct.industry})</span>
              </div>
              <div className="h-3.5 w-px bg-slate-800"></div>
              <div className="text-emerald-400 font-bold">
                {selectedProduct.trust_score}% Trust
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-900 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                    isActive ? 'bg-slate-800 text-amber-300 border border-slate-700' : 'bg-slate-900 text-slate-500'
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
