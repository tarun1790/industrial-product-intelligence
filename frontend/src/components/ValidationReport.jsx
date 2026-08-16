import React, { useState } from 'react';
import { FileCheck2, AlertCircle, CheckCircle2, AlertTriangle, Calculator, Zap } from 'lucide-react';

export default function ValidationReport({ product }) {
  const [calcPower, setCalcPower] = useState(7.5);
  const [calcVolt, setCalcVolt] = useState(415);
  const [calcCurr, setCalcCurr] = useState(14.2);
  const [calcPf, setCalcPf] = useState(0.84);
  const [calcEff, setCalcEff] = useState(90.4);

  if (!product) return null;

  const checks = product.engineering_checks || [];
  const issues = product.validation_issues || [];

  const theoreticalOutput = (Math.sqrt(3) * calcVolt * calcCurr * calcPf * (calcEff / 100)) / 1000;
  const liveDiscrepancy = Math.abs(theoreticalOutput - calcPower) / calcPower * 100;
  const isPhysicallyValid = liveDiscrepancy <= 20.0;

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                Pillar 3: VALIDATE
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
                Technical & Physical Sanity Verification
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic validation of Ohm's laws, 3-phase electromagnetic power equations, synchronous speed slip bounds, and ISO load ratings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-slate-950 rounded-lg border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 block">Physics Sanity:</span>
              <div className="text-xs font-bold text-emerald-400">
                {issues.filter(i => i.is_physics_violation).length === 0 ? '100% Compliant' : 'Issues Flagged'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Stated Product Rule Checks */}
        <div className="xl:col-span-2 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Automated Engineering Rule Checks for {product.part_number}
          </div>

          <div className="space-y-3">
            {checks.length === 0 ? (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                No formal physics equations required for this mechanical component.
              </div>
            ) : (
              checks.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    c.passed ? 'bg-slate-900 border-slate-800' : 'bg-rose-950/20 border-rose-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-bold text-xs text-white">{c.formula_tested}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.passed ? 'bg-slate-950 text-emerald-400 border border-slate-800' : 'bg-slate-950 text-rose-400 border border-rose-800'
                    }`}>
                      {c.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-2.5 border-t border-slate-800 text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Calculated Theoretical:</span>
                      <span className="font-bold text-amber-300">{c.calculated_value}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Stated Datasheet:</span>
                      <span className="font-bold text-white">{c.stated_value}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{c.details}</span>
                    {c.discrepancy_percentage !== null && (
                      <span className="text-slate-300 font-semibold">
                        Tolerance Discrepancy: {c.discrepancy_percentage}%
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Validation Issues / Flags */}
            {issues.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Advisory Notes & Tolerances
                </div>
                {issues.map((iss) => (
                  <div key={iss.id} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> {iss.title}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500">{iss.category}</span>
                    </div>
                    <p className="text-slate-300 pt-0.5">{iss.message}</p>
                    {iss.suggested_correction && (
                      <p className="text-amber-300/90 text-[11px] pt-0.5">
                        Correction: {iss.suggested_correction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Physics Sandbox */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Live Physics Sandbox (Ohm / Power Laws)
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Zap className="w-4 h-4" /> 3-Phase Electromagnetic Power Verifier
            </div>
            <div className="text-[11px] text-slate-400">
              Formula: P(kW) = √3 × V × I × cos(φ) × η / 1000
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Stated Power (kW):</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcPower}
                  onChange={(e) => setCalcPower(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Voltage (V):</label>
                  <input
                    type="number"
                    value={calcVolt}
                    onChange={(e) => setCalcVolt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Current (A):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcCurr}
                    onChange={(e) => setCalcCurr(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Power Factor (cos φ):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcPf}
                    onChange={(e) => setCalcPf(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">Efficiency η (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcEff}
                    onChange={(e) => setCalcEff(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Result Card */}
            <div className={`p-3.5 rounded-lg border mt-3 space-y-1.5 text-xs ${
              isPhysicallyValid ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950 border-rose-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calculated Power:</span>
                <span className="font-bold text-white">{theoreticalOutput.toFixed(2)} kW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Formula Variance:</span>
                <span className={`font-bold ${isPhysicallyValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {liveDiscrepancy.toFixed(1)}%
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 text-[11px]">
                {isPhysicallyValid ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Physical parameters balanced
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Inconsistency flagged (&gt;20% delta)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
