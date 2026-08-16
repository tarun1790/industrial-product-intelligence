import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertTriangle, ShieldCheck, Thermometer, Zap, RefreshCw } from 'lucide-react';
import { calculateWeibullReliability } from '../services/api';

export default function WeibullReliabilityView({ product }) {
  const [beta, setBeta] = useState(1.85);
  const [eta, setEta] = useState(65000);
  const [temp, setTemp] = useState(40.0);
  const [thd, setThd] = useState(3.0);
  const [weibullData, setWeibullData] = useState(null);

  useEffect(() => {
    loadWeibull();
  }, [beta, eta, temp, thd]);

  const loadWeibull = async () => {
    try {
      const res = await calculateWeibullReliability({
        beta_shape_factor: beta,
        eta_characteristic_life_hrs: eta,
        ambient_temp_c: temp,
        vfd_harmonic_thd_percent: thd
      });
      setWeibullData(res);
    } catch (err) {
      console.error(err);
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
                Prognostics & Reliability
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                2-Parameter Weibull Reliability Distribution & Thermal Derating
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Evaluates industrial degradation curves R(t) = exp(-(t/η)^β), Mean Time Between Failures (MTBF), and Arrhenius thermal/harmonic derating factors.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">MTBF Rating</span>
            <span className="font-bold text-blue-700">
              {weibullData?.prognostic_metrics.mtbf_mean_time_between_failures_hrs?.toLocaleString()} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols: Plot & KPIs */}
        <div className="xl:col-span-8 space-y-4">
          {/* KPI Cards */}
          {weibullData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">B10 Rating Life</span>
                <span className="text-xl font-bold text-slate-900 block font-mono">
                  {weibullData.prognostic_metrics.b10_rating_life_hrs.toLocaleString()} hrs
                </span>
                <span className="text-[10px] text-slate-500">90% Survival Bound</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">Effective MTBF</span>
                <span className="text-xl font-bold text-blue-700 block font-mono">
                  {weibullData.prognostic_metrics.mtbf_mean_time_between_failures_hrs.toLocaleString()} hrs
                </span>
                <span className="text-[10px] text-blue-700 font-medium">{weibullData.prognostic_metrics.expected_service_life_years} Service Years</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">Thermal Derating</span>
                <span className="text-xl font-bold text-slate-700 block font-mono">
                  {weibullData.derating_factors.ambient_thermal_derating}x
                </span>
                <span className="text-[10px] text-slate-500">Arrhenius Rule</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-slate-500 text-[10px] block uppercase">Combined Multiplier</span>
                <span className="text-xl font-bold text-blue-600 block font-mono">
                  {weibullData.derating_factors.combined_derating_multiplier}x
                </span>
                <span className="text-[10px] text-slate-500">Net Operational Life</span>
              </div>
            </div>
          )}

          {/* SVG Reliability Plot */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reliability R(t) & Cumulative Failure Probability F(t)</h3>
                <span className="text-xs text-slate-500">Operating Hours vs Probability (%)</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                  <span className="w-3 h-0.5 bg-blue-600"></span> Reliability R(t)
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-0.5 bg-slate-400"></span> Failure F(t)
                </span>
              </div>
            </div>

            <div className="h-60 bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-end relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeDasharray="4" />

                {/* Reliability Curve */}
                {weibullData?.reliability_curve_points && (
                  <path
                    d={weibullData.reliability_curve_points.map((pt, i) => {
                      const maxT = weibullData.weibull_parameters.effective_eta_derated_hrs * 1.5;
                      const x = (pt.operating_hours / maxT) * 480 + 10;
                      const y = 190 - (pt.reliability_percent / 100.0) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                  />
                )}

                {/* Failure Probability Curve */}
                {weibullData?.reliability_curve_points && (
                  <path
                    d={weibullData.reliability_curve_points.map((pt, i) => {
                      const maxT = weibullData.weibull_parameters.effective_eta_derated_hrs * 1.5;
                      const x = (pt.operating_hours / maxT) * 480 + 10;
                      const y = 190 - (pt.cumulative_failure_probability_percent / 100.0) * 170;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Controls */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Operational Derating Controls
          </h4>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">
                Weibull Shape Factor (β): {beta} (Wear-Out)
              </label>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.05"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">
                Ambient Temperature: {temp}°C (Base 40°C)
              </label>
              <input
                type="range"
                min="20"
                max="70"
                step="1"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">
                VFD Harmonic THD: {thd}%
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={thd}
                onChange={(e) => setThd(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-3.5 rounded bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-1">
              <span className="text-blue-900 font-bold block">Recommended Inspection:</span>
              Perform preventative dynamic vibration analysis every {weibullData?.prognostic_metrics.recommended_inspection_interval_hrs?.toLocaleString()} hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
