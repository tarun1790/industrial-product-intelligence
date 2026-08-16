import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, CheckCircle2, Filter, Eye, CheckSquare, Square, RefreshCw, BarChart2 } from 'lucide-react';
import { searchParametric, compareProducts } from '../services/api';

export default function ParametricSearch({ catalog, onSelectProduct, onCompare }) {
  const [query, setQuery] = useState('Find me a 5-10 kW three-phase motor suitable for continuous industrial operation at 415 V with IE3 efficiency');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const sampleQueries = [
    'Find me a 5-10 kW three-phase motor suitable for continuous industrial operation at 415 V with IE3 efficiency',
    'Deep groove ball bearing 25mm bore high speed',
    'Grundfos vertical multistage pump 10 m3/h',
    'Schneider TeSys motor circuit breaker 65A',
    'Stainless steel inductive sensor IP69K flush',
    'Festo pneumatic cylinder 50mm bore'
  ];

  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q) return;
    setLoading(true);
    try {
      const res = await searchParametric(q, {});
      setResults(res.results || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectForCompare = (productId) => {
    if (selectedForCompare.includes(productId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== productId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 products at once.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, productId]);
    }
  };

  const handleRunCompare = async () => {
    if (selectedForCompare.length < 2) return;
    setCompareLoading(true);
    try {
      const res = await compareProducts(selectedForCompare);
      setComparisonResult(res);
    } catch (err) {
      console.error('Compare error:', err);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Search Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
              AI PARAMETRIC SEARCH
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              Natural Language Industrial Query Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Converts unstructured engineering requests into multi-dimensional parametric filters, power limits, and physics-matched catalog rankings.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type engineering query (e.g. '5-10 kW 3-phase motor 415V IE3', '25mm bore bearing')..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Catalog</span>
          </button>
        </div>

        {/* Preset Sample Queries */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-slate-500 whitespace-nowrap">Examples:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(sq); handleSearch(sq); }}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 transition-all whitespace-nowrap cursor-pointer"
            >
              {sq.length > 40 ? `${sq.slice(0, 40)}...` : sq}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Floating Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/50 shadow-xl flex items-center justify-between sticky top-20 z-40">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-white">
              {selectedForCompare.length} Selected for Spec Matrix
            </span>
            <span className="text-slate-400 text-[11px]">(Select 2 to 4 products)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForCompare([])}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleRunCompare}
              disabled={selectedForCompare.length < 2 || compareLoading}
              className="px-3.5 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {compareLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BarChart2 className="w-3.5 h-3.5" />}
              <span>Compare Spec Matrix</span>
            </button>
          </div>
        </div>
      )}

      {/* Comparison Matrix Drawer */}
      {comparisonResult && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                SPEC COMPARISON MATRIX
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Side-by-Side Parametric & Trade-Off Analysis</h3>
            </div>
            <button
              onClick={() => setComparisonResult(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕ Close Matrix
            </button>
          </div>

          {/* Trade-Off Synthesis */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-400">
              Engineering Evaluation Synthesis:
            </div>
            <p className="text-slate-300 leading-relaxed pt-0.5">
              {comparisonResult.ai_tradeoff_summary}
            </p>
          </div>

          {/* Side-by-Side Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 w-48 text-slate-400">Specification</th>
                  {comparisonResult.products.map(p => (
                    <th key={p.id} className="py-2.5 px-4 min-w-[200px]">
                      <div className="font-bold text-white text-xs">{p.manufacturer} {p.part_number}</div>
                      <div className="text-[10px] text-amber-400 font-normal">{p.category}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {comparisonResult.attribute_keys.map(attrKey => (
                  <tr key={attrKey} className="hover:bg-slate-800/30">
                    <td className="py-2 px-4 font-semibold text-slate-400 capitalize">
                      {attrKey.replace(/_/g, ' ')}
                    </td>
                    {comparisonResult.products.map(p => {
                      const attr = p.attributes[attrKey];
                      const valStr = attr ? (attr.normalized_value !== null ? `${attr.normalized_value} ${attr.normalized_unit || ''}` : String(attr.raw_value)) : '-';
                      return (
                        <td key={p.id} className="py-2 px-4 text-slate-200">
                          {valStr}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Search Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">
            Matching Equipment ({results.length > 0 ? results.length : catalog.length} records)
          </span>
          <span className="text-slate-500">Sorted by Intent & Parametric Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(results.length > 0 ? results : catalog.map(p => ({ product: p, relevance_score: 95.0, matched_criteria: ['Standard Catalog Spec'] }))).map((item) => {
            const p = item.product;
            const isChecked = selectedForCompare.includes(p.id);

            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleSelectForCompare(p.id)}
                      className="mt-0.5 text-slate-400 hover:text-amber-400 cursor-pointer"
                      title="Select for Comparison"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                        {p.industry || p.category}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-1 leading-snug">{p.title}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        OEM: <span className="text-slate-200">{p.manufacturer}</span> | Part #: <span className="text-slate-200">{p.part_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-400">{p.trust_score}%</span>
                  </div>
                </div>

                {/* Key Spec Snippets */}
                <div className="grid grid-cols-3 gap-1.5 text-xs pt-2 border-t border-slate-800">
                  {Object.entries(p.attributes || {}).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[9px] text-slate-500 block truncate">{k.replace(/_/g, ' ')}</span>
                      <span className="font-bold text-white text-[11px] truncate block">{String(v.raw_value)}</span>
                    </div>
                  ))}
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {p.evidence_trail?.length || 0} Citations
                  </span>
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 hover:border-slate-700 flex items-center gap-1 transition-all cursor-pointer font-bold"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
