import React, { useState, useEffect } from 'react';
import { History, Calendar, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { fetchProductHistory } from '../services/api';

export default function TemporalTimeline({ product }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.part_number) {
      loadHistory(product.part_number);
    }
  }, [product]);

  const loadHistory = async (partNumber) => {
    setLoading(true);
    try {
      const res = await fetchProductHistory(partNumber);
      setHistoryItems(res);
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
                Pillar 4 • Temporal Intelligence
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Product Revision History & Engineering Change Order (ECN) Timeline
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Tracks year-over-year specification revisions, efficiency upgrades, frame modifications, and supersession chains.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Tracked Revisions</span>
            <span className="font-bold text-blue-700">
              {historyItems.length} Formal Revisions
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-2">
          {historyItems.map((rev, idx) => {
            const isLatest = idx === 0;

            return (
              <div key={idx} className="relative pl-6">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                  isLatest ? 'border-blue-600' : 'border-slate-400'
                }`}></div>

                {/* Revision Card */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isLatest ? 'bg-blue-50/50 border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-white text-blue-700 border border-slate-300 font-mono">
                        {rev.revision_code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{rev.change_type.replace(/_/g, ' ')}</span>
                      {isLatest && (
                        <span className="px-2 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                          CURRENT PRODUCTION
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 font-mono">
                      Effective: {rev.effective_date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 pt-2.5 leading-relaxed">
                    {rev.description}
                  </p>

                  {/* Changed Attributes Box */}
                  <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-2">
                    <span className="text-slate-500 text-[10px] font-bold uppercase block">
                      Parameter Delta Comparison:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(rev.changed_attributes || {}).map(([attr, vals]) => (
                        <div key={attr} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px]">
                          <span className="text-slate-500 uppercase block text-[9px]">{attr.replace(/_/g, ' ')}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-slate-500 line-through font-mono">{vals.old_value}</span>
                            <ArrowRight className="w-3 h-3 text-blue-600" />
                            <span className="text-blue-700 font-bold font-mono">{vals.new_value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Source Document: {rev.source_document_name}</span>
                    <span>Authority: {(rev.source_authority_score * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
