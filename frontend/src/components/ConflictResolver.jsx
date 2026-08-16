import React from 'react';
import { GitMerge, AlertTriangle, CheckCircle2, ArrowRight, Clock, FileCheck } from 'lucide-react';

export default function ConflictResolver({ product }) {
  if (!product) return null;

  const conflicts = product.conflicts || [];

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                Pillars 3 & 4: CONFLICT RESOLUTION
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-amber-400" />
                Multi-Source Specification Conflict Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Industrial catalogs frequently have outdated revisions or distributor discrepancies. ProductIQ automatically reconciles conflicting sources using OEM authority and revision hierarchy.
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block">Reconciliation Audit:</span>
            <div className="text-xs font-bold text-amber-400">
              {conflicts.length} Discrepancies Resolved
            </div>
          </div>
        </div>
      </div>

      {/* Decision Architecture Steps */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Automated Discrepancy Resolution Protocol
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block">1. Detect</span>
            <span className="text-[10px] text-slate-500">Multi-source delta</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block">2. Compare</span>
            <span className="text-[10px] text-slate-500">Extract stated values</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block">3. Revision Date</span>
            <span className="text-[10px] text-slate-500">2024 Rev vs 2021</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block">4. Authority</span>
            <span className="text-[10px] text-slate-500">OEM 1.0 vs Dist 0.7</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-bold block">5. Mounting</span>
            <span className="text-[10px] text-slate-500">B3 Foot vs B5 Flange</span>
          </div>
          <div className="p-2.5 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold">
            <span>6. Resolution ✓</span>
            <span className="text-[10px] text-emerald-400 block font-normal">Canonically chosen</span>
          </div>
        </div>
      </div>

      {/* Conflicts Cards List */}
      <div className="space-y-4">
        {conflicts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">All Ingested Sources Corroborated</h4>
            <p className="text-xs text-slate-400 mt-1">
              No conflicting values detected across technical catalogs for this product.
            </p>
          </div>
        ) : (
          conflicts.map((conf) => (
            <div key={conf.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              {/* Conflict Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                      PARAMETER: {conf.attribute_name.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                      STATUS: {conf.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">
                    Specification Discrepancy: Weight Parameter Variance
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Resolved Canonical Value:</span>
                  <div className="text-base font-bold text-emerald-400">
                    {conf.chosen_value} {conf.chosen_unit || ''}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Sources Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conf.detected_discrepancies.map((src, idx) => {
                  const isWinner = String(src.value) === String(conf.chosen_value);
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border relative transition-all ${
                        isWinner
                          ? 'bg-slate-950 border-emerald-500/70 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-80'
                      }`}
                    >
                      {isWinner && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-emerald-300 border border-emerald-700">
                          SELECTED CANONICAL VALUE
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs">
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span className="font-semibold text-slate-200">{src.source_name}</span>
                      </div>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">{src.value}</span>
                        <span className="text-slate-400 text-xs">{src.unit || 'kg'}</span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Source Type:</span>
                          <span className="text-slate-200">{src.source_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revision Date:</span>
                          <span className="text-slate-200">{src.date || 'Historical'}</span>
                        </div>
                        {src.notes && (
                          <div className="mt-1 text-[11px] text-amber-300/90 italic bg-slate-900 p-2 rounded border border-slate-800">
                            Context: {src.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Provenance Reasoning */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="text-amber-400 font-bold">
                  Resolution Decision Rationale:
                </div>
                <p className="text-slate-300 leading-relaxed pt-0.5">
                  {conf.resolution_reasoning}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
