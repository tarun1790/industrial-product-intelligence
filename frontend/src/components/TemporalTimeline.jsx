import React, { useState, useEffect } from 'react';
import { History, Calendar, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { fetchProductHistory } from '../services/api';

export default function TemporalTimeline({ product }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.part_number) {
      loadHistory(product.part_number);
    }
  }, [product]);

  const loadHistory = async (partNo) => {
    setLoading(true);
    try {
      const res = await fetchProductHistory(partNo);
      setHistory(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                TEMPORAL INTELLIGENCE
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                Product Revision History & Specification Evolution Timeline
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracks how physical specifications and energy standards evolved across historical datasheet revisions, answering: <span className="text-slate-200 font-bold">"What was the specification in 2021?"</span> vs <span className="text-slate-200 font-bold">"What is the latest 2024 standard?"</span>
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px]">Tracked Component</span>
            <span className="font-bold text-white">{product?.manufacturer} {product?.part_number}</span>
          </div>
        </div>
      </div>

      {/* Horizontal / Vertical Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">
            Datasheet Revisions & Engineering Changes ({history.length} Iterations)
          </h3>
          <span className="text-xs text-emerald-400 font-bold">
            Latest: {history.find(h => !h.superseded)?.revision_code || 'Rev C'} (Active Production)
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {history.map((rev, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline Marker Dot */}
              <div className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 ${
                !rev.superseded
                  ? 'bg-emerald-500 border-slate-950 ring-4 ring-emerald-950'
                  : 'bg-slate-700 border-slate-950'
              }`}></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{rev.year} • {rev.revision_code}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    !rev.superseded
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}>
                    {!rev.superseded ? 'CURRENT ACTIVE SPEC' : 'SUPERSEDED'}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{rev.published_date}</span>
              </div>

              <div className="text-xs text-slate-400">
                Source Document: <span className="text-slate-300 font-semibold">{rev.document_name}</span>
              </div>

              {/* Spec Delta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {Object.entries(rev.spec_delta || {}).map(([k, v]) => (
                  <div key={k} className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-white text-[11px]">{String(v)}</span>
                  </div>
                ))}
              </div>

              {/* Engineering Note */}
              <div className="p-3 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block mb-0.5">Engineering Change Notice (ECN):</span>
                {rev.engineering_notes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
