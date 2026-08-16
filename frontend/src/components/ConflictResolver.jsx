import React from 'react';
import { GitMerge, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Clock, FileCheck } from 'lucide-react';

export default function ConflictResolver({ product }) {
  if (!product) return null;

  const conflicts = product.conflicts || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-amber-950 text-amber-400 border border-amber-800">
                Pillar 3 & 4: CONFLICT RESOLUTION
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <GitMerge className="w-6 h-6 text-amber-400" />
                Multi-Source Specification Conflict Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Industrial catalogs frequently have outdated revisions or distributor discrepancies. ProductIQ automatically reconciles conflicting sources using OEM authority and revision hierarchy.
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-amber-950/40 border border-amber-800 text-right">
            <span className="text-xs text-amber-400 font-mono">Discrepancy Status:</span>
            <div className="text-sm font-bold text-white font-mono">
              {conflicts.length} Reconciled Discrepancies
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancy Flow Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
          Conflict Resolution Decision Architecture
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block">1. Conflict</span>
            <span className="text-[10px] text-slate-400">Multi-source mismatch</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">2. Compare</span>
            <span className="text-[10px] text-slate-400">Extract stated vals</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">3. Revision Date</span>
            <span className="text-[10px] text-slate-400">2024 Rev vs 2021</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">4. Authority</span>
            <span className="text-[10px] text-slate-400">OEM 1.0 vs Dist 0.7</span>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block">5. Variant Context</span>
            <span className="text-[10px] text-slate-400">B3 Foot vs B5 Flange</span>
          </div>
          <div className="p-3 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
            <span className="font-bold block">6. Resolution ✓</span>
            <span className="text-[10px] text-emerald-400">Canonically chosen</span>
          </div>
        </div>
      </div>

      {/* Conflicts Cards List */}
      <div className="space-y-4">
        {conflicts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white">All Sources Corroborated</h4>
            <p className="text-xs text-slate-400 mt-1">
              No conflicting values detected across ingested technical catalogs for this product.
            </p>
          </div>
        ) : (
          conflicts.map((conf) => (
            <div key={conf.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
              {/* Conflict Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-amber-950 text-amber-400 border border-amber-800">
                      ATTRIBUTE: {conf.attribute_name.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                      STATUS: {conf.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Specification Conflict: Stated Weight Mismatch Detected
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono">Resolved Canonical Value:</span>
                  <div className="text-xl font-mono font-bold text-emerald-400">
                    {conf.chosen_value} {conf.chosen_unit || ''}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Sources Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conf.detected_discrepancies.map((src, idx) => {
                  const isWinner = String(src.value) === String(conf.chosen_value);
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border relative transition-all ${
                        isWinner
                          ? 'bg-slate-950 border-emerald-500/80 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-950/60 border-slate-800 opacity-75'
                      }`}
                    >
                      {isWinner && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                          SELECTED CANONICAL SOURCE
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <FileCheck className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-slate-200">{src.source_name}</span>
                      </div>

                      <div className="mt-3 flex items-baseline gap-2 font-mono">
                        <span className="text-2xl font-bold text-white">{src.value}</span>
                        <span className="text-slate-400">{src.unit || 'kg'}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs font-mono text-slate-400">
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

              {/* AI Reasoning Resolution Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                  <Sparkles className="w-4 h-4" /> AI Provenance & Resolution Reasoning:
                </div>
                <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded border border-slate-800">
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
