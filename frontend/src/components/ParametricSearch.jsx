import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowRight, CheckCircle2, Sparkles, Filter, Eye, CheckSquare, Square, RefreshCw } from 'lucide-react';
import { searchParametric, compareProducts } from '../services/api';

export default function ParametricSearch({ catalog, onSelectProduct, onCompare }) {
  const [query, setQuery] = useState('Find me a 5-10 kW three-phase motor suitable for continuous industrial operation at 415 V with IE3 efficiency');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Facet Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');

  const sampleQueries = [
    'Find me a 5-10 kW three-phase motor suitable for continuous industrial operation at 415 V with IE3 efficiency',
    'Deep groove ball bearing 25mm bore high speed',
    'Grundfos vertical multistage pump 10 m3/h',
    'Siemens 3-phase motor starter circuit breaker'
  ];

  const handleSearch = async (overrideQuery) => {
    const q = overrideQuery || query;
    if (!q) return;
    setLoading(true);
    try {
      const filters = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (manufacturerFilter) filters.manufacturer = manufacturerFilter;
      
      const res = await searchParametric(q, filters);
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
    <div className="space-y-6">
      {/* Search Bar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
              AI PARAMETRIC SEARCH
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-cyan-400" />
              Natural Language Industrial Query Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Converts unstructured engineering requests into multi-dimensional parametric filters, power limits, and physics-matched catalog rankings.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type engineering query (e.g. '5-10 kW 3-phase motor 415V IE3')..."
            className="flex-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search Catalog</span>
          </button>
        </div>

        {/* Preset Sample Queries */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs text-slate-400 font-mono">Example Queries:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(sq); handleSearch(sq); }}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-all font-mono whitespace-nowrap cursor-pointer"
            >
              {sq.length > 45 ? `${sq.slice(0, 45)}...` : sq}
            </button>
          ))}
        </div>
      </div>

      {/* Compare Floating Action Bar */}
      {selectedForCompare.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl flex items-center justify-between backdrop-blur sticky top-20 z-40">
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="font-bold text-white text-sm">
              {selectedForCompare.length} Selected for Multi-Product Spec Matrix
            </span>
            <span className="text-slate-400">(Select 2 to 4 products)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedForCompare([])}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={handleRunCompare}
              disabled={selectedForCompare.length < 2 || compareLoading}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              {compareLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Comparison Matrix Modal / Drawer if triggered */}
      {comparisonResult && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-6 shadow-2xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                  AI SPEC COMPARISON MATRIX
                </span>
                <h3 className="text-lg font-bold text-white">Side-by-Side Spec & Trade-Off Analysis</h3>
              </div>
            </div>
            <button
              onClick={() => setComparisonResult(null)}
              className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {/* AI Trade-Off Synthesis Card */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-4 h-4" /> AI Trade-off Synthesis:
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">
              {comparisonResult.ai_tradeoff_summary}
            </p>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-48 text-slate-400">Specification</th>
                  {comparisonResult.products.map(p => (
                    <th key={p.id} className="py-3 px-4 min-w-[200px]">
                      <div className="font-bold text-white text-sm">{p.manufacturer} {p.part_number}</div>
                      <div className="text-[11px] text-cyan-400 font-normal">{p.category}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {comparisonResult.attribute_keys.map(attrKey => (
                  <tr key={attrKey} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-400 capitalize">
                      {attrKey.replace(/_/g, ' ')}
                    </td>
                    {comparisonResult.products.map(p => {
                      const attr = p.attributes[attrKey];
                      const valStr = attr ? (attr.normalized_value !== null ? `${attr.normalized_value} ${attr.normalized_unit || ''}` : String(attr.raw_value)) : '-';
                      return (
                        <td key={p.id} className="py-2.5 px-4 text-slate-200">
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
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Search Matches ({results.length > 0 ? results.length : catalog.length} Products Available)
          </h3>
          <span className="text-xs font-mono text-slate-500">Sorted by Intent & Parametric Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(results.length > 0 ? results : catalog.map(p => ({ product: p, relevance_score: 95.0, matched_criteria: ['Standard Catalog Spec'] }))).map((item) => {
            const p = item.product;
            const isChecked = selectedForCompare.includes(p.id);

            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleSelectForCompare(p.id)}
                      className="mt-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer"
                      title="Select for Comparison"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-cyan-400 border border-slate-800">
                        {p.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1 leading-snug">{p.title}</h4>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        OEM: <span className="text-slate-200">{p.manufacturer}</span> | Part #: <span className="text-slate-200">{p.part_number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">{p.trust_score}% Trust</span>
                  </div>
                </div>

                {/* Matched Criteria Chips */}
                {item.matched_criteria && item.matched_criteria.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                    {item.matched_criteria.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Key Spec Snippets */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  {Object.entries(p.attributes || {}).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block truncate">{k.replace('_', ' ')}</span>
                      <span className="font-bold text-white truncate block">{String(v.raw_value)}</span>
                    </div>
                  ))}
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    {p.evidence_trail?.length || 0} Evidence Citations
                  </span>
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Inspect Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
