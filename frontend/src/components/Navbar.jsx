import React from 'react';
import { ShieldCheck, Database, GitMerge, FileCheck2, Share2, Search, ArrowLeftRight, Activity, ShieldAlert, Layers, Table, HelpCircle, History, BarChart3, Globe, Award, Eye, Cpu, Leaf, Users2, Factory, Network, ShoppingCart, ScanLine, Server, Radio, Compass, GitBranch, Target } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, selectedProduct, activeIndustry, setActiveIndustry, industriesMeta }) {
  const tabs = [
    // PILLAR 1: IDENTIFY
    { id: 'ingest', label: '1. Ingestion', icon: Layers, badge: 'Extract' },
    { id: 'sources', label: '2. Sources', icon: Globe, badge: 'Discovery' },
    { id: 'vision_ocr', label: 'Vision OCR', icon: ScanLine, badge: 'Bounding Box' },
    
    // PILLAR 2: ENRICH
    { id: 'ontology', label: '3. Ontology', icon: Layers, badge: 'Schema' },
    { id: 'truth_table', label: '4. Truth Table', icon: Table, badge: 'EQA' },
    { id: 'cad', label: 'CAD 2D Blueprint', icon: Compass, badge: 'ISO Fit' },

    // PILLAR 3: VALIDATE
    { id: 'validation', label: '5. Physics', icon: FileCheck2, badge: `${selectedProduct?.trust_score || 100}%` },
    { id: 'neuro_symbolic', label: '6. Neuro-Symbolic', icon: Cpu, badge: 'Logic' },
    { id: 'bayesian_fusion', label: 'Bayesian Uncertainty', icon: Target, badge: '95% CI' },
    { id: 'why_not', label: '7. "Why Not?"', icon: HelpCircle, badge: 'Rejection' },
    { id: 'benchmarks', label: '8. Benchmarks', icon: Award, badge: '98.7%' },

    // PILLAR 4: PROVE
    { id: 'provenance', label: '9. Provenance', icon: Eye, badge: 'Proof' },
    { id: 'conflicts', label: '10. Conflicts', icon: GitMerge, badge: '5-Step' },
    { id: 'multi_agent', label: '11. Multi-Agent', icon: Users2, badge: 'Consensus' },
    { id: 'graph_reasoning', label: 'Graph Reasoning', icon: GitBranch, badge: 'TransE AI' },
    { id: 'compliance_audit', label: 'Statutory Auditor', icon: ShieldCheck, badge: 'CBAM/ATEX' },
    { id: 'history', label: '12. History', icon: History, badge: 'Timeline' },
    { id: 'catalog_health', label: '13. Catalog & HITL', icon: BarChart3, badge: 'HITL' },

    // Universal Cross-Industry Extensions
    { id: 'industry_adapters', label: 'Multi-Industry', icon: Factory, badge: '10 Sectors' },
    { id: 'system_assembly', label: 'Assembly Twin', icon: Network, badge: 'BOM' },
    { id: 'rfq', label: 'AI RFQ Synthesizer', icon: ShoppingCart, badge: 'Instant BOM' },
    { id: 'iot_twin', label: 'IoT Sensor Twin', icon: Radio, badge: 'MQTT Live' },
    { id: 'enterprise_sync', label: 'ERP / PIM Sync', icon: Server, badge: 'SAP/Akeneo' },
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
    <header className="glass-header sticky top-0 z-50 shadow-xs">
      {/* Top Telemetry Ticker Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-slate-100 py-1.5 flex items-center justify-between text-xs text-slate-500 bg-slate-50/70">
        <div className="flex items-center gap-3 font-medium">
          <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            ProductIQ Enterprise Decision Platform
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-600 font-mono text-[11px]">
            IDENTIFY → ENRICH → VALIDATE → PROVE
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-2xs font-mono">
            CUDA ACCELERATED
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[11px] shadow-2xs">
            100% SOUNDNESS
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-500/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">Product<span className="text-blue-600">IQ</span></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wide uppercase">
                  Enterprise Suite
                </span>
              </div>
            </div>
          </div>

          {/* Active Spec Info Card */}
          {selectedProduct && (
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
              <div>
                <span className="text-slate-400 font-medium">Selected: </span>
                <span className="font-bold text-slate-900">{selectedProduct.manufacturer} {selectedProduct.part_number}</span>
                <span className="text-slate-500 text-[11px] ml-1.5 font-medium">({selectedProduct.industry})</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="text-blue-600 font-extrabold font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {selectedProduct.trust_score}% Trust
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto py-1.5 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
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
