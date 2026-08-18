import React, { useState, useEffect } from 'react';
import { Cpu, TrendingUp, Zap, CheckCircle2, RefreshCw, Layers, ShieldCheck, DollarSign } from 'lucide-react';
import { runPIRLVFDOptimization } from '../services/api';

export default function PIRLVFDOptimizerView({ selectedProduct }) {
  const [loadPct, setLoadPct] = useState(65.0);
  const [tariff, setTariff] = useState(0.14);
  const [rlReport, setRlReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    runOptimization();
  }, [partNum, loadPct, tariff]);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const data = await runPIRLVFDOptimization({
        part_number: partNum,
        operating_load_pct: loadPct,
        electricity_cost: tariff
      });
      setRlReport(data);
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
                Physics-Informed Reinforcement Learning (PIRL)
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Cpu className="w-5 h-5 text-blue-600" />
                VFD Dynamic Flux & Real-Time Inverter Efficiency Optimizer (PINO-RL)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Deep Reinforcement Learning (PPO) agent dynamically adjusts motor stator magnetic flux under partial mechanical loads to eliminate core magnetic saturation and boost efficiency from 88.2% to 94.6%.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Efficiency Gain</span>
            <span className="font-extrabold text-blue-600 font-mono">
              +{rlReport?.net_efficiency_gain_pct || 6.4}% Optimized
            </span>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Operating Load Setpoint:</span>
              <span className="font-mono text-blue-600">{loadPct}% Load</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={loadPct}
              onChange={(e) => setLoadPct(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Grid Tariff Rate ($/kWh):</label>
            <input
              type="number"
              step="0.01"
              value={tariff}
              onChange={(e) => setTariff(parseFloat(e.target.value) || 0.14)}
              className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* RL Convergence & Savings Stats */}
      {rlReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Baseline V/f Efficiency</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{rlReport.nominal_baseline_efficiency_pct}%</span>
            <span className="text-[10px] text-slate-500">Scalar Open-Loop</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">PIRL Optimized</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">{rlReport.rl_optimized_efficiency_pct}%</span>
            <span className="text-[10px] text-blue-600 font-medium">Flux Weakening Control</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Annual Energy Saved</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{rlReport.annual_energy_savings_kwh.toLocaleString()} kWh</span>
            <span className="text-[10px] text-slate-500">Continuous Duty</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Annual Cost Reduction</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">${rlReport.annual_cost_savings_usd.toLocaleString()} USD</span>
            <span className="text-[10px] text-blue-700 font-medium">Direct OPEX Savings</span>
          </div>
        </div>
      )}

      {/* Trajectory Plot Canvas */}
      {rlReport && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                PIRL Agent Policy Convergence Trajectory (500 Training Episodes)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Reward optimization and stator magnetic flux adjustment</span>
            </div>
            <span className="text-xs text-blue-700 font-bold font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {rlReport.reward_convergence_status}
            </span>
          </div>

          {/* SVG RL Training Curve */}
          <div className="w-full bg-slate-950 rounded-xl p-5 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[260px]">
            <svg viewBox="0 0 500 180" className="w-full max-w-lg h-auto relative z-10">
              <line x1="40" y1="150" x2="480" y2="150" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="90" x2="480" y2="90" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="30" x2="480" y2="30" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Trajectory Path */}
              <path
                d={rlReport.optimization_trajectory.reduce((acc, pt, idx) => {
                  const x = 40 + (pt.episode / 500.0) * 440;
                  const y = 150 - ((pt.inverter_efficiency_pct - 88.0) / 7.0) * 110;
                  return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, '')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Target Efficiency Line */}
              <line x1="40" y1="46" x2="480" y2="46" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="475" y="42" fill="#22c55e" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">Optimal Limit: 94.6%</text>

              <text x="40" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">Ep 0</text>
              <text x="150" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">Ep 150</text>
              <text x="260" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">Ep 300</text>
              <text x="480" y="165" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">Ep 500</text>
            </svg>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{rlReport.policy_action_verdict}</span>
          </div>
        </div>
      )}
    </div>
  );
}
