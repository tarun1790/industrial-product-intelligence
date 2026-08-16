import React from 'react';
import { ShieldCheck, Database, GitMerge, FileCheck2, Share2, Search, ArrowLeftRight, Activity, ShieldAlert, Layers, Table, HelpCircle, History, BarChart3, Globe, Award, Eye, Cpu, Leaf, Users2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedProduct, activeIndustry, setActiveIndustry, industriesMeta }) {
  const tabs = [
    // PILLAR 1: IDENTIFY
    { id: 'ingest', label: '1. Ingest', icon: Layers, badge: 'Identify' },
    { id: 'sources', label: '2. Sources', icon: Globe, badge: 'Discover' },
    
    // PILLAR 2: ENRICH
    { id: 'ontology', label: '3. Ontology', icon: Layers, badge: 'Schema' },
    { id: 'truth_table', label: '4. Truth Table', icon: Table, badge: 'EQA' },

    // PILLAR 3: VALIDATE
    { id: 'validation', label: '5. Physics', icon: FileCheck2, badge: `${selectedProduct?.trust_score || 100}%` },
    { id: 'neuro_symbolic', label: '6. Neuro-Symbolic', icon: Cpu, badge: 'Z3 Logic' },
    { id: 'why_not', label: '7. "Why Not?"', icon: HelpCircle, badge: 'Diagnostics' },
    { id: 'benchmarks', label: '8. Benchmarks', icon: Award, badge: '98.7%' },

    // PILLAR 4: PROVE
    { id: 'provenance', label: '9. Provenance', icon: Eye, badge: 'Proof' },
    { id: 'conflicts', label: '10. Conflicts', icon: GitMerge, badge: '5-Step' },
    { id: 'multi_agent', label: '11. Multi-Agent', icon: Users2, badge: 'Consensus' },
    { id: 'history', label: '12. History', icon: History, badge: 'Timeline' },
    { id: 'catalog_health', label: '13. Catalog & HITL', icon: BarChart3, badge: 'HITL' },

    // Advanced Frontier Extensions
    { id: 'dpp', label: 'EU ESPR Passport', icon: Leaf },
    { id: 'weibull', label: 'Weibull Reliability', icon: Activity },
    { id: 'interchange', label: 'Cross-Ref', icon: ArrowLeftRight },
    { id: 'curves', label: 'Curves & L10h', icon: Activity },
    { id: 'compliance', label: 'HazLoc ATEX', icon: ShieldAlert },
    { id: 'commerce', label: 'Commerce PIM', icon: Database },
    { id: 'graph', label: 'Graph', icon: Share2 },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      {/* Top Telemetry Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-900 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            PRODUCTIQ: NEURO-SYMBOLIC INDUSTRIAL DECISION ENGINE
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">
            LOGIC SOLVER: Z3 FOL AXIOMS VERIFIED
          </span>
          <span className="hidden lg:inline text-slate-700">|</span>
          <span className="hidden lg:inline text-emerald-400 font-bold">
            BENCHMARK: 98.7% F1 SCORE • 25.4X SPEEDUP
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            GPU: CUDA READY
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
            ESPR / DPP: CERTIFIED
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
                  NEURO-SYMBOLIC
                </span>
              </div>
            </div>
          </div>

          {/* Active Spec Info */}
          {selectedProduct && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500">COMPONENT: </span>
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
