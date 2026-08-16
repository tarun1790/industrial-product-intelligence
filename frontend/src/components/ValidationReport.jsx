import React, { useState } from 'react';
import { FileCheck2, AlertCircle, CheckCircle2, AlertTriangle, ShieldCheck, Calculator, RefreshCw, Zap } from 'lucide-react';

export default function ValidationReport({ product }) {
  // Live interactive calculator state
  const [calcPower, setCalcPower] = useState(7.5);
  const [calcVolt, setCalcVolt] = useState(415);
  const [calcCurr, setCalcCurr] = useState(14.2);
  const [calcPf, setCalcPf] = useState(0.84);
  const [calcEff, setCalcEff] = useState(90.4);

  if (!product) return null;

  const checks = product.engineering_checks || [];
  const issues = product.validation_issues || [];

  // Theoretical 3-phase calculation: sqrt(3) * V * I * pf * eff / 1000
  const theoreticalOutput = (Math.sqrt(3) * calcVolt * calcCurr * calcPf * (calcEff / 100)) / 1000;
  const liveDiscrepancy = Math.abs(theoreticalOutput - calcPower) / calcPower * 100;
  const isPhysicallyValid = liveDiscrepancy <= 20.0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                Pillar 3: VALIDATE
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-cyan-400" />
                Technical & Physical Sanity Verification
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic validation of Ohm's laws, 3-phase electromagnetic power equations, synchronous speed slip bounds, and ISO load ratings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-right font-mono">
              <span className="text-xs text-slate-400">Physics Sanity:</span>
              <div className="text-base font-bold text-emerald-400">
                {issues.filter(i => i.is_physics_violation).length === 0 ? '100% Compliant' : 'Issues Flagged'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stated Product Checks */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
            Automated Engineering Rule Checks for {product.part_number}
          </h3>

          <div className="space-y-3">
            {checks.length === 0 ? (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                No formal physics equations required for this mechanical component.
              </div>
            ) : (
              checks.map((c, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border ${
                    c.passed ? 'bg-slate-900 border-slate-800' : 'bg-rose-950/30 border-rose-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                      )}
                      <span className="font-mono font-bold text-sm text-white">{c.formula_tested}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      c.passed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {c.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Theoretical Calculated:</span>
                      <span className="font-bold text-cyan-300">{c.calculated_value}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block">Stated Datasheet:</span>
                      <span className="font-bold text-white">{c.stated_value}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 font-mono flex items-center justify-between">
                    <span>{c.details}</span>
                    {c.discrepancy_percentage !== null && (
                      <span className="text-slate-300 font-semibold">
                        Discrepancy: {c.discrepancy_percentage}%
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Validation Issues / Flags */}
            {issues.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Advisory Notes & Tolerances
                </h4>
                {issues.map((iss) => (
                  <div key={iss.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> {iss.title}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500">{iss.category}</span>
                    </div>
                    <p className="text-slate-300 pt-1">{iss.message}</p>
                    {iss.suggested_correction && (
                      <p className="text-cyan-400 text-[11px] pt-1">
                        Recommendation: {iss.suggested_correction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Interactive Physics Simulator */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
            Live Physics Sandbox (Ohm / Power Laws)
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <Zap className="w-4 h-4" /> 3-Phase Mechanical Power Verifier
            </div>
            <p className="text-[11px] text-slate-400">
              Formula: \( P = \sqrt{'{3}'} \times V \times I \times \cos\phi \times \eta \)
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Stated Power (kW):</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcPower}
                  onChange={(e) => setCalcPower(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Voltage (V):</label>
                  <input
                    type="number"
                    value={calcVolt}
                    onChange={(e) => setCalcVolt(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Current (A):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcCurr}
                    onChange={(e) => setCalcCurr(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Power Factor (\(\cos\phi\)):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calcPf}
                    onChange={(e) => setCalcPf(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Efficiency \(\eta\) (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcEff}
                    onChange={(e) => setCalcEff(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Live Result Card */}
            <div className={`p-4 rounded-xl border mt-4 space-y-2 font-mono ${
              isPhysicallyValid ? 'bg-slate-950 border-emerald-500/60' : 'bg-rose-950/40 border-rose-500'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Theoretical Power Output:</span>
                <span className="font-bold text-white text-sm">{theoreticalOutput.toFixed(2)} kW</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Formula Discrepancy:</span>
                <span className={`font-bold ${isPhysicallyValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {liveDiscrepancy.toFixed(1)}%
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] flex items-center gap-1.5">
                {isPhysicallyValid ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Physics equations balanced within tolerance
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Physical inconsistency flagged (&gt;20% mismatch)
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
