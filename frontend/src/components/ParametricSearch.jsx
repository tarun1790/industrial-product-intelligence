import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowLeftRight, CheckCircle2, ShieldCheck, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { searchParametric } from '../services/api';

export default function ParametricSearch({ catalog, onSelectProduct, onCompare }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(catalog);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Industrial Motor', 'Rolling Bearing', 'Centrifugal Pump', 'Motor Circuit Breaker', 'Pneumatic Cylinder'];
  const manufacturers = ['All', 'ABB', 'SKF', 'Siemens', 'Grundfos', 'Schneider Electric', 'Festo'];

  const handleSearch = async (overrideQ) => {
    const q = overrideQ !== undefined ? overrideQ : query;
    setLoading(true);
    try {
      const filters = {};
      if (selectedCategory !== 'All') filters.category = selectedCategory;
      if (selectedManufacturer !== 'All') filters.manufacturer = selectedManufacturer;
      const res = await searchParametric(q, filters);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      setResults(catalog);
    } else {
      setResults(catalog.filter(c => c.category === cat));
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Search Bar Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Parametric Engine
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Natural Language Parametric Search & Comparison Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Search by natural language query, electrical ratings, ISO bearing dimensions, or exact manufacturer part numbers.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Results Found</span>
            <span className="font-bold text-blue-700">{results.length} Verified SKUs</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search: e.g. 7.5 kW 400V IE3 motor, 25mm bore ball bearing, 10 m3/h pump..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            <span>Search</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500 whitespace-nowrap">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Part Number</th>
                <th className="py-3 px-4 font-semibold">Manufacturer</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Key Standardized Specs</th>
                <th className="py-3 px-4 font-semibold text-center">Trust Rating</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                    {prod.part_number}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 font-sans">
                    {prod.manufacturer}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    {prod.category}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-sans">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {Object.entries(prod.attributes || {}).slice(0, 3).map(([k, v]) => (
                        <span key={k} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono">
                          {k}: {v.normalized_value !== null ? `${v.normalized_value}${v.normalized_unit || ''}` : String(v.raw_value)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-700">
                    {prod.trust_score}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="px-3 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold cursor-pointer transition-all"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
