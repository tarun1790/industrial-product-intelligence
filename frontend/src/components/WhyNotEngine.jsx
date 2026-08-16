import React, { useState, useEffect } from 'react';
import { HelpCircle, AlertCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { evaluateWhyNot } from '../services/api';

export default function WhyNotEngine({ product }) {
  const [candidatePart, setCandidatePart] = useState('6204-2RS (Undersized 20mm Bore)');
  const [candidateMfg, setCandidateMfg] = useState('Alternative Supplier');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: '6204 (Undersized 20mm Bore)', query: '6204-2RS', mfg: 'Generic OEM' },
    { label: '6205-2Z (Non-Contact Metal Shield)', query: '6205-2Z Metal Shield', mfg: 'NSK' },
    { label: '132S 5.5kW (Undersized Motor Frame)', query: '132S 5.5KW Motor', mfg: 'Siemens' },
    { label: 'IE2 Standard Efficiency (Derated)', query: 'IE2 Standard Efficiency', mfg: 'WEG' },
    { label: 'Timken 6205-2RS (Compatible Equivalent)', query: 'Timken 6205-2RS', mfg: 'Timken' }
  ];

  useEffect(() => {
    runEvaluation();
  }, [product]);

  const runEvaluation = async (overridePart, overrideMfg) => {
    const part = overridePart || candidatePart;
    const mfg = overrideMfg || candidateMfg;
    if (!part || !product) return;
    setLoading(true);
    try {
      const res = await evaluateWhyNot({
        base_product_id: product.id,
        candidate_part_number: part,
        candidate_manufacturer: mfg
      });
      setEvaluation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (p) => {
    setCandidatePart(p.query);
    setCandidateMfg(p.mfg);
    runEvaluation(p.query, p.mfg);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Pillar 3 • Rejection Diagnostics
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                "Why Not?" Alternative Rejection & Diagnostic Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Provides concrete engineering failure reasons when an alternative candidate fails fitment, thermal rating, load capacity, or efficiency standards.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[10px]">Reference Spec</span>
            <span className="font-semibold text-slate-900">{product?.manufacturer} {product?.part_number}</span>
          </div>
        </div>

        {/* Input & Presets */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={candidatePart}
              onChange={(e) => setCandidatePart(e.target.value)}
              placeholder="Enter alternative candidate part number to test..."
              className="flex-1 px-4 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={() => runEvaluation()}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              Evaluate Candidate
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] text-slate-500 whitespace-nowrap">Test Scenarios:</span>
            {presets.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(pr)}
                className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] border border-slate-200 transition-all whitespace-nowrap cursor-pointer"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Verdict Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Interchange Tier</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                evaluation.verdict === 'RECOMMENDED'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : evaluation.verdict === 'CONDITIONAL'
                  ? 'bg-slate-100 text-slate-700 border border-slate-300'
                  : 'bg-slate-100 text-slate-900 border border-slate-300'
              }`}>
                {evaluation.verdict}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <span className="text-slate-500 text-[10px] block">Overall Fit Rating</span>
              <div className="text-2xl font-bold font-mono text-slate-900">
                {evaluation.overall_fit_score}% Fit
              </div>
              <span className="text-[11px] text-slate-600 block">
                {evaluation.interchange_tier.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <span className="text-slate-900 font-bold block mb-1">Executive Verdict:</span>
              {evaluation.summary_verdict}
            </div>
          </div>

          {/* Right 2 Columns: Detailed Rejection / Acceptance Diagnostics */}
          <div className="xl:col-span-2 space-y-4">
            {/* Rejected Criteria (Failures) */}
            {evaluation.rejected_criteria?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-slate-600" /> Mechanical & Operational Incompatibilities ({evaluation.rejected_criteria.length} Parameters)
                </div>

                <div className="space-y-2">
                  {evaluation.rejected_criteria.map((fail, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-900 block">{fail.parameter}</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{fail.failure_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Criteria */}
            {evaluation.matched_criteria?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Compatible Technical Criteria ({evaluation.matched_criteria.length} Matched)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evaluation.matched_criteria.map((match, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{match}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
