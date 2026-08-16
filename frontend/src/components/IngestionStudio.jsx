import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, AlertTriangle, FileText, Upload, Sparkles, RefreshCw, Filter, Plus, Save } from 'lucide-react';
import { ingestPartNumber, ingestText } from '../services/api';

export default function IngestionStudio({
  selectedProduct,
  setSelectedProduct,
  catalog,
  onNavigateTab,
  activeIndustry,
  setActiveIndustry,
  industriesList
}) {
  const [inputText, setInputText] = useState('ABB M3BP 160MLA 4');
  const [loading, setLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const [showAddAttr, setShowAddAttr] = useState(false);

  const filteredCatalog = activeIndustry === 'All Industries' || !activeIndustry
    ? catalog
    : catalog.filter(p => p.industry?.toLowerCase() === activeIndustry.toLowerCase());

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

  const handleAddCustomAttribute = () => {
    if (!newAttrName || !newAttrValue || !selectedProduct) return;
    const updated = { ...selectedProduct };
    updated.attributes[newAttrName.toLowerCase().replace(/\s+/g, '_')] = {
      name: newAttrName.toLowerCase().replace(/\s+/g, '_'),
      display_name: newAttrName,
      raw_value: newAttrValue,
      normalized_value: parseFloat(newAttrValue) || null,
      normalized_unit: newAttrValue.match(/[a-zA-Z°³µ\/\"\'-]+/)?.[0] || '',
      confidence: 0.99,
      is_enriched: true,
      evidence_ids: []
    };
    setSelectedProduct(updated);
    setNewAttrName('');
    setNewAttrValue('');
    setShowAddAttr(false);
  };

  const p = selectedProduct;

  return (
    <div className="space-y-6 w-full">
      {/* Industry Sector Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Filter by Industrial Sector:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {industriesList.map((ind) => {
            const isSelected = (activeIndustry || 'All Industries') === ind;
            return (
              <button
                key={ind}
                onClick={() => setActiveIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Ingestion Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Multi-Modal Technical Extraction Engine
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Ingests raw part numbers, technical datasheets (PDF), nameplate data, and builds verified canonical records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">PIPELINE:</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">1. Extract</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">2. Enrich</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">3. Validate</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">4. Prove</span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter part number or engineering spec (e.g., 'ABB M3BP 160MLA 4', 'SKF 6205', 'CR 10-06', '3RV2011', 'GV3P65')..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            onClick={() => handleIngest()}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Ingest & Verify</span>
          </button>
        </div>

        {/* Dynamic Catalog Quick Selectors from Current Filtered Industry */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-mono mb-2">
            Available Verified Equipment in {activeIndustry || 'Catalog'} ({filteredCatalog.length} records):
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredCatalog.map((prod) => {
              const isSelected = selectedProduct?.id === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setInputText(prod.part_number);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-white border-amber-500/80 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-amber-400 font-semibold">{prod.manufacturer}</span> {prod.part_number}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Spec Inspection Area */}
      {p && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Product Identity & Verified Ecosystem */}
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-amber-400 border border-slate-800">
                    {p.industry || p.category}
                  </span>
                  <h3 className="text-base font-bold font-mono text-white mt-2 leading-tight">{p.title}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Part #: <span className="text-slate-200 font-semibold">{p.part_number}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono text-emerald-400">{p.trust_score}%</div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Trust Score</span>
                </div>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">OEM Manufacturer</span>
                  <span className="font-semibold text-white mt-0.5 block truncate">{p.manufacturer}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Product Family</span>
                  <span className="font-semibold text-white mt-0.5 block truncate">{p.product_family}</span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="pt-2 flex flex-col gap-2 font-mono">
                {p.conflicts && p.conflicts.length > 0 && (
                  <button
                    onClick={() => onNavigateTab('conflicts')}
                    className="w-full py-2 px-3 rounded bg-amber-950/30 border border-amber-800/60 text-amber-300 hover:bg-amber-900/40 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      {p.conflicts.length} Source Conflict Reconciled
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => onNavigateTab('evidence')}
                  className="w-full py-2 px-3 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Inspect Evidence ({p.evidence_trail?.length || 0} Citations)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ecosystem & Interoperability Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Interoperability & Mating Parts
              </h4>

              {p.compatible_products?.length > 0 && (
                <div>
                  <div className="text-[11px] text-slate-400 font-mono mb-1.5">Compatible Subsystems:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.compatible_products.map((c) => (
                      <span key={c} className="px-2 py-1 rounded bg-slate-950 text-slate-300 text-xs border border-slate-800 font-mono">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.replacement_for?.length > 0 && (
                <div>
                  <div className="text-[11px] text-slate-400 font-mono mb-1.5">Replaces Legacy Models:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.replacement_for.map((r) => (
                      <span key={r} className="px-2 py-1 rounded bg-slate-950 text-amber-300 text-xs border border-slate-800 font-mono">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.mating_components?.length > 0 && (
                <div>
                  <div className="text-[11px] text-slate-400 font-mono mb-1.5">Mating Tolerances & Components:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.mating_components.map((m) => (
                      <span key={m} className="px-2 py-1 rounded bg-slate-950 text-emerald-300 text-xs border border-slate-800 font-mono">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 2 Columns: Extracted Specifications Table */}
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-mono text-white">
                  Standardized Technical Specifications ({Object.keys(p.attributes || {}).length} Parameters)
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Normalized to standard SI units per IEC/ISO ontologies.
                </p>
              </div>

              <button
                onClick={() => setShowAddAttr(!showAddAttr)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Spec</span>
              </button>
            </div>

            {/* Dynamic Attribute Adder Box */}
            {showAddAttr && (
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row gap-2 items-center font-mono text-xs">
                <input
                  type="text"
                  placeholder="Attribute Name (e.g. Max Torque)"
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white w-full sm:w-1/2"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 48.5 Nm)"
                  value={newAttrValue}
                  onChange={(e) => setNewAttrValue(e.target.value)}
                  className="px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white w-full sm:w-1/2"
                />
                <button
                  onClick={handleAddCustomAttribute}
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold whitespace-nowrap cursor-pointer"
                >
                  Save Spec
                </button>
              </div>
            )}

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Specification</th>
                    <th className="py-2.5 px-4 font-semibold">Raw Stated</th>
                    <th className="py-2.5 px-4 font-semibold">Canonical (SI)</th>
                    <th className="py-2.5 px-4 font-semibold">Confidence</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {Object.entries(p.attributes || {}).map(([key, attr]) => (
                    <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-4 font-semibold text-slate-200">
                        {attr.display_name || key}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        {String(attr.raw_value)}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-bold">
                          {attr.normalized_value !== null && attr.normalized_value !== undefined
                            ? `${attr.normalized_value} ${attr.normalized_unit || ''}`
                            : String(attr.raw_value)}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-semibold">
                        {(attr.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {attr.evidence_ids && attr.evidence_ids.length > 0 ? (
                          <button
                            onClick={() => onNavigateTab('evidence')}
                            className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-[11px] transition-all cursor-pointer"
                          >
                            Trace →
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">Ontology Inferred</span>
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
