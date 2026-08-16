import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, CheckCircle2, AlertTriangle, ShieldCheck, Zap, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { fetchInterchange } from '../services/api';

export default function InterchangeEngine({ product, onSelectProduct }) {
  const [equivalents, setEquivalents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.part_number) {
      loadEquivalents(product.part_number);
    }
  }, [product]);

  const loadEquivalents = async (partNo) => {
    setLoading(true);
    try {
      const res = await fetchInterchange(partNo);
      setEquivalents(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Interchange Engine
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                Cross-Reference & OEM Interchange Compatibility
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Finds functionally equivalent cross-manufacturer replacements with parameter compatibility scores and drop-in fitment guarantees.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Reference Part</span>
            <span className="font-bold text-blue-700">{product?.manufacturer} {product?.part_number}</span>
          </div>
        </div>
      </div>

      {/* Equivalents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {equivalents.map((eq, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">{eq.equivalent_manufacturer}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{eq.equivalent_part_number}</h3>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-blue-700 font-mono">{(eq.compatibility_score * 100).toFixed(0)}%</span>
                  <span className="text-[9px] text-slate-500 block">Fit Score</span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tier:</span>
                  <span className="font-bold text-slate-900 uppercase">{eq.interchange_tier.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price Ratio:</span>
                  <span className="text-blue-700 font-semibold">{eq.price_delta_ratio}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stock Availability:</span>
                  <span className="text-slate-800 font-medium">{eq.availability_status}</span>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Matching Attributes:</span>
                <div className="flex flex-wrap gap-1">
                  {eq.matching_attributes?.map((attr, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                      ✓ {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-blue-700 text-[11px] font-semibold">Drop-In Replacement</span>
              <button
                onClick={() => onSelectProduct && onSelectProduct({ manufacturer: eq.equivalent_manufacturer, part_number: eq.equivalent_part_number, title: `${eq.equivalent_manufacturer} ${eq.equivalent_part_number}` })}
                className="px-3 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-semibold cursor-pointer transition-all"
              >
                Inspect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
