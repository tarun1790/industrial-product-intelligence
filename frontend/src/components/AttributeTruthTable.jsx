import React from 'react';
import { Table, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, ShieldAlert, FileText, Award } from 'lucide-react';

export default function AttributeTruthTable({ product }) {
  if (!product) return null;

  const truthTable = product.truth_table || [];

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'VERIFIED':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'PROBABLE':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'CONDITIONAL':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'CONFLICTING':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      case 'UNVERIFIED':
        return 'bg-slate-900 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-500 border-slate-800';
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
                EVIDENCE-BACKED DECISION MATRIX
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-400" />
                Attribute Truth Table & Uncertainty Taxonomy
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Distinguishes <span className="text-slate-200 font-bold">Extracted ≠ Normalized ≠ Validated</span>. Every parameter is scored with a multi-factor Evidence Quality Score (EQS) and formal uncertainty state.
            </p>
          </div>

          {/* Uncertainty Tiers Legend */}
          <div className="flex flex-wrap gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">● VERIFIED</span>
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">● PROBABLE</span>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">● CONDITIONAL</span>
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">● CONFLICTING</span>
          </div>
        </div>
      </div>

      {/* Main Truth Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Attribute Verification Ledger ({truthTable.length} Tracked Parameters)
            </h3>
            <span className="text-xs text-slate-400">Spec: {product.manufacturer} {product.part_number}</span>
          </div>

          <span className="px-3 py-1 rounded bg-slate-950 text-emerald-400 text-xs border border-slate-800 font-bold">
            Average EQS: {(truthTable.reduce((acc, t) => acc + t.eqs_score, 0) / Math.max(1, truthTable.length)).toFixed(1)}%
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Attribute</th>
                <th className="py-3 px-4 font-semibold">1. Extracted Raw</th>
                <th className="py-3 px-4 font-semibold">2. Normalized (SI)</th>
                <th className="py-3 px-4 font-semibold">3. Physics Valid</th>
                <th className="py-3 px-4 font-semibold">4. Source Origin</th>
                <th className="py-3 px-4 font-semibold">5. Uncertainty State</th>
                <th className="py-3 px-4 font-semibold text-right">EQS Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {truthTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200">
                    {row.display_name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    "{row.extracted_raw}"
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-800 font-bold">
                      {row.normalized_canonical}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {row.validation_status === 'PASSED' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Warning
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="truncate block max-w-[160px] text-[11px]" title={row.evidence_source_name}>
                      {row.evidence_source_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${getTierBadge(row.uncertainty_tier)}`}>
                      {row.uncertainty_tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-emerald-400 text-xs">
                      {row.eqs_score}%
                    </span>
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
