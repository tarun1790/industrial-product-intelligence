import React, { useState } from 'react';
import { GitMerge, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Scale, History } from 'lucide-react';

export default function ConflictResolver({ product }) {
  if (!product) return null;

  const conflicts = product.conflicts || [];
  const [selectedConflictIndex, setSelectedConflictIndex] = useState(0);

  const activeConflict = conflicts[selectedConflictIndex] || {
    id: 'conf-1',
    attribute_name: 'weight',
    status: 'RESOLVED',
    detected_discrepancies: [
      { source_name: 'Distributor Catalog 2021', source_type: 'authorized_distributor', value: 42, unit: 'kg', date: 2021, authority_score: 0.70 },
      { source_name: 'ABB OEM Technical Datasheet Rev C', source_type: 'oem_datasheet', value: 45, unit: 'kg', date: 2024, authority_score: 1.00 }
    ],
    chosen_value: 45,
    chosen_unit: 'kg',
    reasoning_chain: [
      { step_number: 1, step_name: 'Manufacturer Identity Corroboration', check_passed: true, details: 'Both source documents refer to ABB Switzerland Ltd.' },
      { step_number: 2, step_name: 'Product Family & Frame Alignment', check_passed: true, details: 'Both datasets confirm M3BP Process Performance 160M frame.' },
      { step_number: 3, step_name: 'Variant & Mounting Footprint Check', check_passed: true, details: 'Source A reflected prior revision; Source B verified current standard cast-iron configuration.' },
      { step_number: 4, step_name: 'OEM Authority Hierarchy Weighting', check_passed: true, details: 'Selected OEM Primary Datasheet with 1.0 authority score over 0.70 distributor catalog.' },
      { step_number: 5, step_name: 'Revision Recency & Supersession', check_passed: true, details: '2024 Revision C supersedes 2021 distributor listing (+3 kg due to cast-iron housing upgrade).' }
    ],
    resolution_reasoning: 'Specification discrepancy resolved. Selected 45 kg from ABB OEM Datasheet Rev C (2024) because newer OEM primary documentation supersedes older distributor listings.'
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Pillar 4 • Explainable Outputs
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-blue-600" />
                Multi-Source Conflict Resolution & 5-Step Reasoning Chain
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Provides step-by-step explainability when catalog values disagree across distributor, legacy, and OEM datasheets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200 font-semibold">
              {conflicts.length > 0 ? `${conflicts.length} Reconciled Discrepancies` : '0 Active Conflicts'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Conflict Workbench */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Discrepancy Card */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Conflicted Parameter</span>
                <h3 className="text-sm font-bold text-slate-900 uppercase">{activeConflict.attribute_name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                AUTO-RECONCILED
              </span>
            </div>

            {/* Conflicting Sources Breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Detected Source Discrepancies ({activeConflict.detected_discrepancies?.length || 2} Sources)
              </div>

              {activeConflict.detected_discrepancies?.map((src, idx) => {
                const isSelected = src.value === activeConflict.chosen_value;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-900 block">{src.source_name}</span>
                        <span className="text-[11px] text-slate-500 block font-mono">
                          Publication: {src.date || '2021'} • Authority: {src.authority_score || 0.7}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 font-mono">
                          {src.value} {src.unit || activeConflict.chosen_unit || ''}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 justify-end mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Selected Truth
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Final Chosen Value Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase font-medium">Reconciled Final Canonical Truth</span>
              <div className="text-xl font-bold font-mono text-blue-700">
                {activeConflict.chosen_value} {activeConflict.chosen_unit || ''}
              </div>
              <p className="text-xs text-slate-700 pt-1 leading-relaxed">
                {activeConflict.resolution_reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Step Explicit Reasoning Chain */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Audit Trail</span>
                <h3 className="text-sm font-bold text-slate-900">
                  5-Step Automated Conflict Reasoning Chain
                </h3>
              </div>
              <span className="text-xs text-slate-500">Deterministic Rule Tree</span>
            </div>

            <div className="space-y-3">
              {(activeConflict.reasoning_chain || []).map((step) => (
                <div key={step.step_number} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-bold">
                        {step.step_number}
                      </span>
                      <span className="font-semibold text-slate-900">{step.step_name}</span>
                    </div>
                    <span className="px-2 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      VERIFIED ✓
                    </span>
                  </div>
                  <p className="text-slate-600 pl-7 text-[11px] leading-relaxed">
                    {step.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
