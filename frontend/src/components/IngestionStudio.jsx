import React, { useState } from 'react';
import { Upload, FileText, Database, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, CheckCircle2, ChevronRight, Filter, Plus, Check, Sparkles } from 'lucide-react';
import { ingestPartNumber, ingestText } from '../services/api';

export default function IngestionStudio({ selectedProduct, setSelectedProduct, catalog, onNavigateTab, activeIndustry, setActiveIndustry, industriesList }) {
  const [partInput, setPartInput] = useState('ABB M3BP 160MLA 4');
  const [loading, setLoading] = useState(false);
  const [newAttrName, setNewAttrName] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handlePartIngest = async (overridePart) => {
    const p = overridePart || partInput;
    if (!p) return;
    setLoading(true);
    try {
      const prod = await ingestPartNumber(p);
      setSelectedProduct(prod);
    } catch (err) {
      console.error('Ingestion failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomAttribute = () => {
    if (!newAttrName || !newAttrVal || !selectedProduct) return;
    const updated = { ...selectedProduct };
    updated.attributes[newAttrName.toLowerCase().replace(/ /g, '_')] = {
      name: newAttrName.toLowerCase().replace(/ /g, '_'),
      display_name: newAttrName,
      group_name: "Custom Specs",
      raw_value: newAttrVal,
      normalized_value: isNaN(parseFloat(newAttrVal)) ? null : parseFloat(newAttrVal),
      normalized_unit: newAttrVal.replace(/[^a-zA-Z°%]/g, '').trim() || null,
      is_standardized: true,
      confidence: 1.0,
      evidence_ids: []
    };
    setSelectedProduct(updated);
    setNewAttrName('');
    setNewAttrVal('');
    setShowCustomModal(false);
  };

  const p = selectedProduct;
  const filteredCatalog = activeIndustry === 'All Industries'
    ? catalog
    : catalog.filter(c => c.industry === activeIndustry);

  return (
    <div className="space-y-6 w-full font-sans">
      {/* 1. Industry Sector Filter Header */}
      <div className="premium-card p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Industrial Sector Catalogs
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-blue-600 font-mono">{filteredCatalog.length}</strong> of {catalog.length} verified products
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {industriesList.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeIndustry === ind
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25 ring-1 ring-blue-700'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Ingestion Workbench Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Quick Ingest Controls */}
        <div className="xl:col-span-4 premium-card p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600" />
                Live Ingestion Input
              </span>
              <span className="text-[11px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                Pillar 1: Extract
              </span>
            </div>

            {/* Part Number Input with Search Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Enter Part Number or Model Code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partInput}
                  onChange={(e) => setPartInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePartIngest()}
                  placeholder="e.g. M3BP 160MLA 4, 6205-2RSH, CR 10-06..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono transition-all"
                />
                <button
                  onClick={() => handlePartIngest()}
                  disabled={loading}
                  className="btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Extract</span>
                </button>
              </div>
            </div>

            {/* Pre-Loaded Models Selection List */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block">Or Select Catalog Model:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {filteredCatalog.map((prod) => {
                  const isSelected = p?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => { setSelectedProduct(prod); setPartInput(prod.part_number); }}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold ring-1 ring-blue-400/30'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-slate-900 truncate">{prod.manufacturer}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{prod.part_number}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong className="text-blue-600 font-semibold">Engine Online</strong></span>
            <span>IEC / ISO Standard Compliant</span>
          </div>
        </div>

        {/* Right Column: Ingested Product Overview */}
        <div className="xl:col-span-8 premium-card p-5 flex flex-col justify-between space-y-4">
          {p ? (
            <>
              {/* Product Header Card */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                      {p.industry || p.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      ID: <span className="font-mono text-slate-700 font-semibold">{p.id}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5 leading-snug tracking-tight">{p.title}</h3>
                  <div className="text-xs text-slate-600 mt-1">
                    Manufacturer: <span className="font-bold text-slate-900">{p.manufacturer}</span> • Part Number: <span className="font-bold text-slate-900 font-mono">{p.part_number}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-right shadow-2xs">
                    <span className="text-[10px] text-slate-500 block font-medium">Trust Score</span>
                    <span className="text-sm font-extrabold text-blue-600 font-mono">{p.trust_score}% Verified</span>
                  </div>
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Spec</span>
                  </button>
                </div>
              </div>

              {/* Extracted & Standardized Specifications Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Standardized Parameters ({Object.keys(p.attributes || {}).length} Attributes)</span>
                  <span className="text-slate-400 font-normal text-[11px]">SI Units & ISO Norms</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(p.attributes || {}).map(([key, attr]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/90 space-y-0.5 hover:border-blue-300 transition-colors">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block truncate">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <div className="text-xs font-bold text-slate-900 truncate font-mono">
                        {attr.normalized_value !== null && attr.normalized_value !== undefined
                          ? `${attr.normalized_value} ${attr.normalized_unit || ''}`
                          : String(attr.raw_value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Pillars Quick Navigation Tabs */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
                <button
                  onClick={() => onNavigateTab('sources')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 flex items-center justify-between transition-all cursor-pointer font-semibold shadow-2xs"
                >
                  <span>1. Sources</span>
                  <span className="text-[10px] font-extrabold text-blue-600 font-mono">
                    {p.sources_discovered?.ranked_sources?.length || 5}
                  </span>
                </button>

                <button
                  onClick={() => onNavigateTab('truth_table')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 flex items-center justify-between transition-all cursor-pointer font-semibold shadow-2xs"
                >
                  <span>2. Truth Table</span>
                  <span className="text-[10px] font-extrabold text-blue-600 font-mono">
                    {p.truth_table?.length || 13}
                  </span>
                </button>

                <button
                  onClick={() => onNavigateTab('validation')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 flex items-center justify-between transition-all cursor-pointer font-semibold shadow-2xs"
                >
                  <span>3. Physics Checks</span>
                  <span className="text-[10px] font-extrabold text-blue-600 font-mono">
                    {p.engineering_checks?.length || 4}
                  </span>
                </button>

                <button
                  onClick={() => onNavigateTab('commerce')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 flex items-center justify-between transition-all cursor-pointer font-semibold shadow-2xs"
                >
                  <span>4. JSON-LD PIM</span>
                  <span className="text-[10px] font-extrabold text-blue-600">EXPORT</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select or extract an industrial product to view details.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Custom Attribute */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">Add Custom Engineering Parameter</h4>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-700 text-sm cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Parameter Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Shaft Diameter, Duty Cycle, IP Rating..."
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Value & Unit:</label>
                <input
                  type="text"
                  placeholder="e.g. 42 mm, S1 Continuous, IP66..."
                  value={newAttrVal}
                  onChange={(e) => setNewAttrVal(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowCustomModal(false)} className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer">Cancel</button>
              <button onClick={handleAddCustomAttribute} className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">Add Parameter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
