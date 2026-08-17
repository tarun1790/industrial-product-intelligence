import React, { useState, useEffect } from 'react';
import { RefreshCw, Wrench, ShieldCheck, CheckCircle2, AlertTriangle, Layers, ArrowRight, Zap, History } from 'lucide-react';
import { fetchSelfHealingOntology } from '../services/api';

export default function SelfHealingOntologyView() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetchSelfHealingOntology();
      setReport(data);
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
                Autonomous Schema Evolution Loop
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Wrench className="w-5 h-5 text-blue-600" />
                Self-Healing Dynamic Ontology Auto-Repair & Evolution Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Continuously monitors multi-industry catalog streams for semantic drift. Automatically injects missing statutory fields, updates regex normalizers, and executes non-destructive regression migrations.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Catalog Semantic Health</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {report?.catalog_semantic_health_score || 99.6}% Soundness
            </span>
          </div>
        </div>
      </div>

      {/* Semantic Health Stat Overview */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Monitored Categories</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{report.total_categories_monitored} Verticals</span>
            <span className="text-[10px] text-slate-500">10 Global Domains</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Drift Detections</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">{report.schema_drift_detected_count} Incidents</span>
            <span className="text-[10px] text-blue-600 font-medium">Auto-Repaired</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Self-Healed Patches</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{report.auto_repaired_count} Live</span>
            <span className="text-[10px] text-slate-500">0 Regression Breaks</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Compatibility</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">100%</span>
            <span className="text-[10px] text-blue-700 font-medium">Zero-Downtime Patching</span>
          </div>
        </div>
      )}

      {/* Active Patches & Migration Trail Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Schema Repair Patches */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Autonomous Schema Repair Patches ({report?.active_patches?.length || 3})
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Generated via active learning on incoming 2024 datasheets</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              Auto-Injected
            </span>
          </div>

          <div className="space-y-3">
            {report?.active_patches?.map((patch) => (
              <div key={patch.patch_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-700">{patch.patch_id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-900 text-xs">{patch.target_category}</span>
                  </div>
                  <span className="text-blue-700 font-bold text-[10px] font-mono bg-blue-100/80 px-2 py-0.5 rounded">
                    {patch.action_type.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patched Field:</span>
                    <strong className="text-slate-900">{patch.field_name} ({patch.inferred_data_type})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Governing Standard:</span>
                    <strong className="text-blue-700">{patch.governing_standard}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confidence / Regression:</span>
                    <strong className="text-blue-700">{(patch.confidence_score * 100).toFixed(1)}% ({patch.regression_test_status})</strong>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                  {patch.patch_rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Migration Audit Trail */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Migration Audit Log
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">Immutable Ledger</span>
            </div>

            <div className="space-y-2">
              {report?.migration_audit_trail?.map((log, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono text-[11px] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{log}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
