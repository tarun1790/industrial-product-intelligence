import React from 'react';
import { Table, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, ShieldAlert, FileText, Award } from 'lucide-react';

export default function AttributeTruthTable({ product }) {
  if (!product) return null;

  const truthTable = product.truth_table || [];

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'VERIFIED':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      case 'PROBABLE':
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
      case 'CONDITIONAL':
        return 'bg-slate-100 text-slate-700 border-slate-300 font-medium';
      case 'CONFLICTING':
        return 'bg-slate-100 text-slate-900 border-slate-300 font-bold';
      case 'UNVERIFIED':
        return 'bg-slate-50 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-200';
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
                Pillar 2 • Attribute Intelligence
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-600" />
                Attribute Truth Table & Uncertainty Taxonomy
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Enforces <span className="text-slate-900 font-bold">Extracted ≠ Normalized ≠ Validated</span>. Every parameter is audited with Evidence Quality Assessment (EQA) and explicit rule-based uncertainty states.
            </p>
          </div>

          {/* Uncertainty Tiers Legend */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">● VERIFIED</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">● PROBABLE</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">● CONDITIONAL</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">● CONFLICTING</span>
          </div>
        </div>
      </div>

      {/* Main Truth Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Attribute Verification Ledger ({truthTable.length} Tracked Parameters)
            </h3>
            <span className="text-xs text-slate-500">Spec: {product.manufacturer} {product.part_number}</span>
          </div>

          <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200 font-bold">
            Average Quality Index: {(truthTable.reduce((acc, t) => acc + (t.quality_assessment?.overall_quality_index || 95), 0) / Math.max(1, truthTable.length)).toFixed(1)}%
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Attribute</th>
                <th className="py-3 px-4 font-semibold">1. Extracted Raw</th>
                <th className="py-3 px-4 font-semibold">2. Normalized (SI)</th>
                <th className="py-3 px-4 font-semibold">3. Physics Valid</th>
                <th className="py-3 px-4 font-semibold">4. Source Origin</th>
                <th className="py-3 px-4 font-semibold">5. Uncertainty State</th>
                <th className="py-3 px-4 font-semibold text-right">EQA Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {truthTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-sans">
                    {row.display_name}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    "{row.extracted_raw}"
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200 font-bold">
                      {row.normalized_canonical}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {row.validation_status === 'PASSED' ? (
                      <span className="text-blue-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Passed
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-slate-500" /> Standard
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    <span className="truncate block max-w-[160px] text-[11px]" title={row.evidence_source_name}>
                      {row.evidence_source_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${getTierBadge(row.uncertainty_tier)}`}>
                      {row.uncertainty_tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-blue-700 text-xs">
                      {row.quality_assessment?.quality_level || 'HIGH'}
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
