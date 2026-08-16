import React from 'react';
import { ShieldCheck, Database, GitMerge, FileCheck2, Share2, Search, ArrowLeftRight, Activity, ShieldAlert, Layers, Table, HelpCircle, History, BarChart3, Globe, Award, Eye, Cpu, Leaf, Users2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedProduct, activeIndustry, setActiveIndustry, industriesMeta }) {
  const tabs = [
    // PILLAR 1: IDENTIFY
    { id: 'ingest', label: '1. Ingestion', icon: Layers, badge: 'Identify' },
    { id: 'sources', label: '2. Sources', icon: Globe, badge: 'Discovery' },
    
    // PILLAR 2: ENRICH
    { id: 'ontology', label: '3. Ontology', icon: Layers, badge: 'Schema' },
    { id: 'truth_table', label: '4. Truth Table', icon: Table, badge: 'EQA' },

    // PILLAR 3: VALIDATE
    { id: 'validation', label: '5. Physics', icon: FileCheck2, badge: `${selectedProduct?.trust_score || 100}%` },
    { id: 'neuro_symbolic', label: '6. Neuro-Symbolic', icon: Cpu, badge: 'Logic' },
    { id: 'why_not', label: '7. "Why Not?"', icon: HelpCircle, badge: 'Rejection' },
    { id: 'benchmarks', label: '8. Benchmarks', icon: Award, badge: '98.7%' },

    // PILLAR 4: PROVE
    { id: 'provenance', label: '9. Provenance', icon: Eye, badge: 'Proof' },
    { id: 'conflicts', label: '10. Conflicts', icon: GitMerge, badge: '5-Step' },
    { id: 'multi_agent', label: '11. Multi-Agent', icon: Users2, badge: 'Consensus' },
    { id: 'history', label: '12. History', icon: History, badge: 'Timeline' },
    { id: 'catalog_health', label: '13. Catalog & HITL', icon: BarChart3, badge: 'HITL' },

    // Core Extensions
    { id: 'dpp', label: 'Digital Passport', icon: Leaf },
    { id: 'weibull', label: 'Reliability Curve', icon: Activity },
    { id: 'interchange', label: 'Cross-Reference', icon: ArrowLeftRight },
    { id: 'curves', label: 'Motor Curves', icon: Activity },
    { id: 'compliance', label: 'HazLoc Compliance', icon: ShieldAlert },
    { id: 'commerce', label: 'Commerce PIM', icon: Database },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'search', label: 'Parametric Search', icon: Search },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      {/* Top Formal Telemetry Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-100 py-1.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            ProductIQ Decision Engine • Online
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-600">
            Axiom Solver: Active (IEC 60034 / ISO 15)
          </span>
          <span className="hidden lg:inline text-slate-300">|</span>
          <span className="hidden lg:inline text-blue-700 font-medium">
            Benchmark Precision: 98.7% (Ground-Truth Verified)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium text-[11px]">
            CUDA Accelerated
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-medium text-[11px]">
            ESPR Ready
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo with Mechanical Wrench Tool */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">Product<span className="text-blue-600">IQ</span></span>
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Active Spec Info */}
          {selectedProduct && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Selected: </span>
                <span className="font-semibold text-slate-900">{selectedProduct.manufacturer} {selectedProduct.part_number}</span>
                <span className="text-slate-500 text-[11px] ml-1.5">({selectedProduct.industry})</span>
              </div>
              <div className="h-3.5 w-px bg-slate-300"></div>
              <div className="text-blue-700 font-bold">
                {selectedProduct.trust_score}% Trust
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-1 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isActive ? 'bg-blue-100 text-blue-800 font-semibold' : 'bg-slate-100 text-slate-500'
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
