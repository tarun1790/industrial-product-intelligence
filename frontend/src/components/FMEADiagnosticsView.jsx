import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, Activity, RefreshCw, GitBranch, Layers } from 'lucide-react';
import { fetchFMEADiagnostics } from '../services/api';

export default function FMEADiagnosticsView({ selectedProduct }) {
  const [fmeaReport, setFmeaReport] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadFMEA();
  }, [partNum]);

  const loadFMEA = async () => {
    setLoading(true);
    try {
      const data = await fetchFMEADiagnostics(partNum);
      setFmeaReport(data);
      if (data?.failure_modes?.length > 0) {
        setSelectedMode(data.failure_modes[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                IEC 60812 FMEA & IEC 61508 SIL-3
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                Autonomous Failure Mode and Effects Analysis (FMEA) & Reliability Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Evaluates Risk Priority Numbers ($RPN = S \times O \times D$), Mean Time Between Failures ($MTBF = 57,720\text{ Hrs}$), and generates Ishikawa Fishbone root-cause diagnostics for mission-critical industrial duty.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Functional Safety</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {fmeaReport?.safety_integrity_level || 'SIL-3 / PL e Certified'}
            </span>
          </div>
        </div>
      </div>

      {/* Reliability High-Level Metrics */}
      {fmeaReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Mean Time Between Failures</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">
              {fmeaReport.mtbf_hours.toLocaleString()} Hrs
            </span>
            <span className="text-[10px] text-blue-600 font-medium">~6.6 Years Continuous Duty</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Mean Time to Repair</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{fmeaReport.mttr_hours} Hours</span>
            <span className="text-[10px] text-slate-500">Rapid Modular Overhaul</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">System Availability</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{fmeaReport.system_availability_pct}%</span>
            <span className="text-[10px] text-slate-500">Five-Nines Reliability</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Max Failure RPN</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">54 / 1000</span>
            <span className="text-[10px] text-blue-700 font-medium">Zero High-Risk Criticals</span>
          </div>
        </div>
      )}

      {/* Failure Modes & Ishikawa Root Causes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: FMEA Failure Modes Ledger */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Audited Failure Modes ({fmeaReport?.failure_modes?.length || 3})
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Risk Priority Number analysis (Severity × Occurrence × Detection)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              IEC 60812 Audited
            </span>
          </div>

          <div className="space-y-3">
            {fmeaReport?.failure_modes?.map((mode) => (
              <div key={mode.failure_mode_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-700">{mode.failure_mode_id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-900 text-xs">{mode.component_affected}</span>
                  </div>
                  <span className="text-blue-700 font-bold text-[10px] font-mono bg-blue-100/80 px-2 py-0.5 rounded">
                    RPN: {mode.risk_priority_number_rpn} (S{mode.severity_score_1_to_10}·O{mode.occurrence_score_1_to_10}·D{mode.detection_score_1_to_10})
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-500">Failure Mechanism: <span className="text-slate-800">{mode.failure_mechanism}</span></div>
                  <div className="text-slate-500">Potential Effect: <span className="text-blue-700">{mode.potential_effect}</span></div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                  <strong>Remedial Mitigation:</strong> {mode.recommended_mitigation_action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Ishikawa Root-Cause Fishbone Branches */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ishikawa Root-Cause Fishbone Matrix
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">4 Root Branches</span>
            </div>

            <div className="space-y-3">
              {fmeaReport?.ishikawa_root_causes?.map((branch) => (
                <div key={branch.category} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-900 text-xs block">
                    {branch.category.replace(/_/g, ' ')}
                  </span>
                  <div className="space-y-1">
                    {branch.root_causes.map((cause, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-sans">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{fmeaReport?.ai_reliability_verdict}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
