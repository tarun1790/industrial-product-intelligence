import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2, AlertTriangle, FileText, Upload, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { ingestPartNumber, ingestText } from '../services/api';

export default function IngestionStudio({ selectedProduct, setSelectedProduct, catalog, onNavigateTab }) {
  const [inputText, setInputText] = useState('ABB M3BP 160MLA 4');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(4); // 1: Extract, 2: Enrich, 3: Validate, 4: Prove

  const presets = [
    { label: 'ABB M3BP Motor (Datasheet Conflict)', query: 'ABB M3BP 160MLA 4' },
    { label: 'SKF 6205 Bearing (ISO 15)', query: 'SKF 6205-2RSH' },
    { label: 'Grundfos CR 10 Pump', query: 'Grundfos CR 10-06' },
    { label: 'Siemens SIRIUS Breaker', query: 'Siemens 3RV2011' },
    { label: 'Festo ISO Cylinder', query: 'Festo DNC-50-200' },
  ];

  const handleIngest = async (queryToRun) => {
    const q = queryToRun || inputText;
    if (!q) return;
    setLoading(true);
    try {
      const res = await ingestPartNumber(q);
      setSelectedProduct(res);
    } catch (err) {
      console.error('Ingest error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (p) => {
    setInputText(p.query);
    handleIngest(p.query);
  };

  const p = selectedProduct;

  return (
    <div className="space-y-6">
      {/* 4-Pillar Pipeline Visualizer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Multi-Modal Product Intelligence Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated ingestion across PDF datasheets, nameplate OCR, HTML catalogs, and manufacturer engineering ontologies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Pillars:</span>
            <div className="flex items-center gap-1">
              {['1. Extract', '2. Enrich', '3. Validate', '4. Prove'].map((step, idx) => (
                <span key={step} className="px-2 py-0.5 text-[11px] font-mono rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter part number, product model, or industrial query (e.g. 'ABB M3BP 160MLA 4', 'SKF 6205')..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={() => handleIngest()}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Ingest & Verify</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar md:col-span-4 pt-1">
            <span className="text-xs text-slate-400 font-mono">Sample Scenarios:</span>
            {presets.map((pr) => (
              <button
                key={pr.label}
                onClick={() => handlePresetClick(pr)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700/80 transition-all font-mono whitespace-nowrap cursor-pointer"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Spec Inspection Area */}
      {p && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Product Summary & Intelligence Highlights */}
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-slate-800 text-cyan-400 border border-slate-700">
                    {p.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2 leading-tight">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Part Number: <span className="text-slate-200">{p.part_number}</span></p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-400">{p.trust_score}%</div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Trust Score</span>
                </div>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Manufacturer</div>
                  <div className="font-semibold text-white mt-0.5">{p.manufacturer}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400">Series / Family</div>
                  <div className="font-semibold text-white mt-0.5">{p.product_family}</div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="mt-4 pt-3 flex flex-col gap-2">
                {p.conflicts && p.conflicts.length > 0 && (
                  <button
                    onClick={() => onNavigateTab('conflicts')}
                    className="w-full py-2 px-3 rounded bg-amber-950/40 border border-amber-800/80 text-amber-300 hover:bg-amber-900/50 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      {p.conflicts.length} Source Conflict Detected & Resolved
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('evidence')}
                  className="w-full py-2 px-3 rounded bg-cyan-950/40 border border-cyan-800/80 text-cyan-300 hover:bg-cyan-900/50 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Inspect Evidence Trail ({p.evidence_trail?.length || 0} Sources)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Compatible Ecosystem & Replacements */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Ecosystem & Interoperability
              </h4>
              <div>
                <div className="text-xs text-slate-400 mb-1.5 font-mono">Compatible Drives / Accessories:</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.compatible_products?.map((c) => (
                    <span key={c} className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-xs border border-slate-700 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1.5 font-mono">Legacy Replacement For:</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.replacement_for?.map((r) => (
                    <span key={r} className="px-2 py-1 rounded bg-slate-800/80 text-amber-300 text-xs border border-slate-700/80 font-mono">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1.5 font-mono">Mating Components:</div>
                <div className="flex flex-wrap gap-1.5">
                  {p.mating_components?.map((m) => (
                    <span key={m} className="px-2 py-1 rounded bg-slate-800 text-emerald-300 text-xs border border-slate-700 font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Extracted & Standardized Specifications Table */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Extracted & Standardized Specifications</h3>
                <p className="text-xs text-slate-400">
                  Deterministic unit normalization, ISO/IEC ontology alignment, and confidence scoring.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {Object.keys(p.attributes || {}).length} Attributes
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Attribute</th>
                    <th className="py-3 px-4">Raw Stated Value</th>
                    <th className="py-3 px-4">Normalized (Canonical)</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4 text-right">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {Object.entries(p.attributes || {}).map(([key, attr]) => (
                    <tr key={key} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-200">
                        {attr.display_name || key}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {String(attr.raw_value)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold">
                          {attr.normalized_value !== null && attr.normalized_value !== undefined
                            ? `${attr.normalized_value} ${attr.normalized_unit || ''}`
                            : String(attr.raw_value)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-semibold">
                          {(attr.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {attr.evidence_ids && attr.evidence_ids.length > 0 ? (
                          <button
                            onClick={() => onNavigateTab('evidence')}
                            className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 hover:bg-cyan-900/60 border border-slate-700 text-[11px] transition-all cursor-pointer"
                          >
                            Trace Source →
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Inferred</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
