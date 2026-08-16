import React, { useState } from 'react';
import { Upload, FileText, Database, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw, CheckCircle2, ChevronRight, Filter, Plus, Check } from 'lucide-react';
import { ingestPartNumber, ingestText } from '../services/api';

export default function IngestionStudio({ selectedProduct, setSelectedProduct, catalog, onNavigateTab, activeIndustry, setActiveIndustry, industriesList }) {
  const [partInput, setPartInput] = useState('ABB M3BP 160MLA 4');
  const [rawTextInput, setRawTextInput] = useState('');
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
    <div className="space-y-6 w-full">
      {/* 1. Industry Sector Filter Chips */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Industrial Sector Catalogs
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Showing {filteredCatalog.length} of {catalog.length} verified products
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {industriesList.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeIndustry === ind
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Ingestion Action Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Quick Ingest Controls */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                Live Ingestion Input
              </span>
              <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                Pillar 1: Extract
              </span>
            </div>

            {/* Part Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Enter Part Number or Model Code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={partInput}
                  onChange={(e) => setPartInput(e.target.value)}
                  placeholder="e.g. M3BP 160MLA 4, 6205-2RSH, CR 10-06..."
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={() => handlePartIngest()}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>Ingest</span>
                </button>
              </div>
            </div>

            {/* Catalog Selector Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600 block">Or Select Catalog Model:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredCatalog.map((prod) => {
                  const isSelected = p?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => { setSelectedProduct(prod); setPartInput(prod.part_number); }}
                      className={`text-left p-2 rounded-lg border text-xs transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 truncate">{prod.manufacturer}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{prod.part_number}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: <strong className="text-blue-700">Ready for Ingest</strong></span>
            <span>IEC / ISO / DIN Standards</span>
          </div>
        </div>

        {/* Right Column: Ingested Product Overview */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          {p ? (
            <>
              {/* Product Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                      {p.industry || p.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      ID: <span className="font-mono text-slate-700">{p.id}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">{p.title}</h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Manufacturer: <span className="font-semibold text-slate-900">{p.manufacturer}</span> • Part Number: <span className="font-semibold text-slate-900 font-mono">{p.part_number}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-right">
                    <span className="text-[10px] text-slate-500 block">Trust Rating</span>
                    <span className="text-sm font-bold text-blue-700">{p.trust_score}% Verified</span>
                  </div>
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Spec</span>
                  </button>
                </div>
              </div>

              {/* Extracted & Standardized Specifications Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Standardized Engineering Attributes ({Object.keys(p.attributes || {}).length} Parameters)</span>
                  <span className="text-slate-500 font-normal">SI Units & ISO Norms</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(p.attributes || {}).map(([key, attr]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide block truncate">
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

              {/* 4 Pillars Quick Navigation Bar */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  onClick={() => onNavigateTab('evidence')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-medium flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>1. Citations</span>
                  <span className="text-[10px] font-bold text-blue-600 font-mono">{p.evidence_trail?.length || 0}</span>
                </button>

                <button
                  onClick={() => onNavigateTab('conflicts')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-medium flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>2. Conflicts</span>
                  <span className="text-[10px] font-bold text-blue-600 font-mono">{p.conflicts?.length || 0}</span>
                </button>

                <button
                  onClick={() => onNavigateTab('validation')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-medium flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>3. Physics</span>
                  <span className="text-[10px] font-bold text-blue-600 font-mono">{p.engineering_checks?.length || 0}</span>
                </button>

                <button
                  onClick={() => onNavigateTab('commerce')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-medium flex items-center justify-between transition-all cursor-pointer"
                >
                  <span>4. JSON-LD</span>
                  <span className="text-[10px] font-bold text-blue-600">PIM</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select or ingest an industrial product above to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Custom Attribute */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-bold text-slate-900">Add Custom Engineering Parameter</h4>
              <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Parameter Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Shaft Diameter, Duty Cycle, IP Rating..."
                  value={newAttrName}
                  onChange={(e) => setNewAttrName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-700 font-medium block mb-1">Value & Unit:</label>
                <input
                  type="text"
                  placeholder="e.g. 42 mm, S1 Continuous, IP66..."
                  value={newAttrVal}
                  onChange={(e) => setNewAttrVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setShowCustomModal(false)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs cursor-pointer">Cancel</button>
              <button onClick={handleAddCustomAttribute} className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs">Add Parameter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
