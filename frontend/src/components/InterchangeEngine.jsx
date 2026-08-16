import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Zap, Layers } from 'lucide-react';
import { fetchInterchange } from '../services/api';

export default function InterchangeEngine({ product, onSelectProduct }) {
  const [interchanges, setInterchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customPart, setCustomPart] = useState('');

  useEffect(() => {
    if (product?.part_number) {
      loadInterchanges(product.part_number);
    }
  }, [product]);

  const loadInterchanges = async (partNo) => {
    setLoading(true);
    try {
      const res = await fetchInterchange(partNo);
      setInterchanges(res.matches || []);
    } catch (err) {
      console.error('Interchange error:', err);
    } finally {
      setLoading(false);
    }
  };

  const p = product;

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                SUPPLY CHAIN & MRO INTELLIGENCE
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-amber-400" />
                Cross-Manufacturer Interchangeability & Drop-In Replacement Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Find instant 100% functional drop-in equivalents across competing global OEM brands (SKF ↔ Timken ↔ NSK, ABB ↔ Siemens ↔ WEG, Grundfos ↔ Flowserve).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Base Part:</span>
            <span className="px-3 py-1 rounded bg-slate-950 text-amber-400 border border-slate-800 font-bold text-xs">
              {p ? `${p.manufacturer} ${p.part_number}` : 'None'}
            </span>
          </div>
        </div>

        {/* Custom Part Cross-Reference Input */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customPart}
            onChange={(e) => setCustomPart(e.target.value)}
            placeholder="Search any part for cross-references (e.g. 'SKF 6205', 'M3BP 160MLA', 'CR 10-06', '3RV2011')..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            onClick={() => loadInterchanges(customPart || p?.part_number)}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            Find Drop-In Equivalents
          </button>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">
            Verified Equivalent Models ({interchanges.length} direct alternatives)
          </span>
          <span className="text-slate-500">Ranked by Mechanical & Electrical Fit Score</span>
        </div>

        {interchanges.length === 0 ? (
          <div className="p-10 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
            No exact cross-reference matches found for this specific part designation. Select SKF 6205 or ABB M3BP to view verified equivalents.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {interchanges.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] uppercase bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                        {item.interchange_type.replace(/_/g, ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5">
                        {item.target_manufacturer} {item.target_part_number}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">{item.fit_score}% Fit</span>
                      <span className="text-[10px] text-slate-500 block">Match Score</span>
                    </div>
                  </div>

                  {/* Mechanical Dimensions Match */}
                  <div className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Envelope:</span>
                      <span className="text-slate-200 font-semibold">{item.dimensions_match}</span>
                    </div>
                    {item.dynamic_load_variance && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Load Variance:</span>
                        <span className="text-amber-300">{item.dynamic_load_variance}</span>
                      </div>
                    )}
                    {item.speed_limit_variance && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Speed Limit:</span>
                        <span className="text-slate-300">{item.speed_limit_variance}</span>
                      </div>
                    )}
                    {item.efficiency_match && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Efficiency:</span>
                        <span className="text-emerald-300">{item.efficiency_match}</span>
                      </div>
                    )}
                  </div>

                  {/* Engineering Verdict */}
                  <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                    <span className="text-amber-400 font-bold block mb-0.5">Engineering Analysis:</span>
                    {item.engineering_verdict}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Stock Alternate
                  </span>
                  <span className="text-[11px] text-slate-500">ISO/IEC Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
