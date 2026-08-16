import React, { useState, useEffect } from 'react';
import { Activity, Zap, RefreshCw, Cpu, Layers } from 'lucide-react';
import { fetchMotorCurves, calculateBearingLife, fetchPumpQh } from '../services/api';

export default function EngineeringCurves({ product }) {
  const [activeCurveType, setActiveCurveType] = useState('motor');
  const [motorCurves, setMotorCurves] = useState(null);
  const [bearingLife, setBearingLife] = useState(null);
  const [pumpQh, setPumpQh] = useState(null);

  useEffect(() => {
    loadCurves();
  }, [product]);

  const loadCurves = async () => {
    try {
      const [m, b, p] = await Promise.all([
        fetchMotorCurves({ rated_power_kw: 7.5, rated_speed_rpm: 1465, sync_speed_rpm: 1500, rated_current_a: 14.2 }),
        calculateBearingLife({ dynamic_load_c_kn: 14.8, radial_load_fr_kn: 2.5, axial_load_fa_kn: 0.5, speed_rpm: 1465, bearing_type: 'ball' }),
        fetchPumpQh({ nominal_flow_m3h: 10.0, nominal_head_m: 65.0, shutoff_head_m: 78.0 })
      ]);
      setMotorCurves(m);
      setBearingLife(b);
      setPumpQh(p);
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
                Simulation & Curves
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Physical Characteristic Curves & L10h Life Simulation
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Deterministic numerical curves for induction motor torque-speed, ISO 281 bearing fatigue life, and pump Q-H head-flow curves.
            </p>
          </div>

          <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveCurveType('motor')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveType === 'motor' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Motor Torque-Speed
            </button>
            <button
              onClick={() => setActiveCurveType('bearing')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveType === 'bearing' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bearing ISO 281 Life
            </button>
            <button
              onClick={() => setActiveCurveType('pump')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveType === 'pump' ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pump Q-H Curve
            </button>
          </div>
        </div>
      </div>

      {/* Active Curve View */}
      {activeCurveType === 'motor' && motorCurves && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Induction Motor Torque-Speed Characteristic (Kloss Formula)</h3>
              <span className="text-xs text-blue-700 font-bold font-mono">T_nom: {motorCurves.nominal_torque_nm} Nm</span>
            </div>

            <div className="h-64 bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-end relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeDasharray="4" />
                <path
                  d={motorCurves.curve_points.map((pt, i) => {
                    const x = (pt.speed_rpm / 1500) * 480 + 10;
                    const y = 190 - (pt.torque_nm / 150) * 170;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>

          <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Electromechanical Ratings</h4>
            <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Breakdown Torque:</span>
                <span className="text-slate-900 font-bold font-mono">{motorCurves.breakdown_torque_nm} Nm (2.8x)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Starting Torque:</span>
                <span className="text-slate-900 font-bold font-mono">{motorCurves.starting_torque_nm} Nm (2.2x)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Synchronous Speed:</span>
                <span className="text-blue-700 font-bold font-mono">{motorCurves.sync_speed_rpm} RPM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCurveType === 'bearing' && bearingLife && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-2.5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">ISO 281 Basic Rating Life (L10h)</h3>
            <span className="text-blue-700 font-bold font-mono">{bearingLife.l10h_hours.toLocaleString()} Operating Hours</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">L10 Millions Revolutions</span>
              <span className="text-xl font-bold text-slate-900 font-mono">{bearingLife.l10_million_revs} M revs</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Equivalent Load (P)</span>
              <span className="text-xl font-bold text-slate-900 font-mono">{bearingLife.equivalent_load_p_kn} kN</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">Continuous Years (24/7)</span>
              <span className="text-xl font-bold text-blue-700 font-mono">{bearingLife.years_continuous_operation} Years</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
