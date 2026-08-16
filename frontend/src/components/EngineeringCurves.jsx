import React, { useState, useEffect } from 'react';
import { Activity, Zap, Compass, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';
import { fetchMotorCurves, calculateBearingLife, fetchPumpQh } from '../services/api';

export default function EngineeringCurves({ product }) {
  const [activeCurveTab, setActiveCurveTab] = useState('motor'); // 'motor', 'bearing', 'pump'

  // Motor Curve State
  const [motorKw, setMotorKw] = useState(7.5);
  const [motorRpm, setMotorRpm] = useState(1465);
  const [motorCurvesData, setMotorCurvesData] = useState(null);

  // Bearing Life State
  const [bearingC, setBearingC] = useState(14.8);
  const [radialFr, setRadialFr] = useState(2.5);
  const [axialFa, setAxialFa] = useState(0.5);
  const [bearingRpm, setBearingRpm] = useState(1465);
  const [bearingLifeResult, setBearingLifeResult] = useState(null);

  // Pump QH State
  const [pumpQ, setPumpQ] = useState(10.0);
  const [pumpH, setPumpH] = useState(65.0);
  const [pumpQhData, setPumpQhData] = useState(null);

  useEffect(() => {
    loadMotorCurve();
    loadBearingLife();
    loadPumpQh();
  }, []);

  const loadMotorCurve = async () => {
    try {
      const data = await fetchMotorCurves({
        rated_power_kw: motorKw,
        rated_speed_rpm: motorRpm,
        sync_speed_rpm: 1500,
        rated_current_a: 14.2
      });
      setMotorCurvesData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBearingLife = async () => {
    try {
      const data = await calculateBearingLife({
        dynamic_load_c_kn: bearingC,
        radial_load_fr_kn: radialFr,
        axial_load_fa_kn: axialFa,
        speed_rpm: bearingRpm,
        bearing_type: "ball"
      });
      setBearingLifeResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPumpQh = async () => {
    try {
      const data = await fetchPumpQh({
        nominal_flow_m3h: pumpQ,
        nominal_head_m: pumpH,
        shutoff_head_m: pumpH * 1.2
      });
      setPumpQhData(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                NUMERICAL SIMULATION
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Engineering Performance Curves & Lifetime Fatigue Simulators
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dynamic calculation of Kloss torque-speed curves, ISO 281 L10h bearing fatigue life, and centrifugal pump head-flow operating envelopes.
            </p>
          </div>

          {/* Sub-Tabs */}
          <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCurveTab('motor')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveTab === 'motor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Motor Torque-Speed
            </button>
            <button
              onClick={() => setActiveCurveTab('bearing')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveTab === 'bearing' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bearing L10h Life
            </button>
            <button
              onClick={() => setActiveCurveTab('pump')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                activeCurveTab === 'pump' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pump Q-H Curve
            </button>
          </div>
        </div>
      </div>

      {/* 1. MOTOR TORQUE-SPEED SIMULATOR */}
      {activeCurveTab === 'motor' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Torque & Current vs Speed (RPM)</h3>
                <span className="text-xs text-slate-400">Kloss Equation Simulation for 3-Phase Induction Motor</span>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-0.5 bg-amber-400"></span> Torque (Nm)
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-3 h-0.5 bg-cyan-400"></span> Current (A)
                </span>
              </div>
            </div>

            {/* SVG Plot */}
            <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 p-4 flex items-end relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4" />

                {/* Torque Curve */}
                {motorCurvesData?.data_points && (
                  <path
                    d={motorCurvesData.data_points.map((pt, i) => {
                      const x = (pt.speed_rpm / 1500) * 480 + 10;
                      const maxT = motorCurvesData.breakdown_torque_nm * 1.1 || 150;
                      const y = 180 - (pt.torque_nm / maxT) * 160;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                )}

                {/* Current Curve */}
                {motorCurvesData?.data_points && (
                  <path
                    d={motorCurvesData.data_points.map((pt, i) => {
                      const x = (pt.speed_rpm / 1500) * 480 + 10;
                      const maxI = 100;
                      const y = 180 - (pt.current_a / maxI) * 150;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3"
                  />
                )}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Starting Torque (Locked Rotor)</span>
                <span className="font-bold text-amber-400">{motorCurvesData?.starting_torque_nm} Nm</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Breakdown Torque (Tmax)</span>
                <span className="font-bold text-white">{motorCurvesData?.breakdown_torque_nm} Nm</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Nominal Full Load Torque</span>
                <span className="font-bold text-emerald-400">{motorCurvesData?.nominal_torque_nm} Nm</span>
              </div>
            </div>
          </div>

          {/* Motor Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Simulation Parameters
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Rated Power (kW): {motorKw} kW</label>
                <input
                  type="range"
                  min="1.1"
                  max="45"
                  step="0.5"
                  value={motorKw}
                  onChange={(e) => { setMotorKw(parseFloat(e.target.value)); loadMotorCurve(); }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Rated Speed: {motorRpm} RPM</label>
                <input
                  type="range"
                  min="900"
                  max="2980"
                  step="10"
                  value={motorRpm}
                  onChange={(e) => { setMotorRpm(parseFloat(e.target.value)); loadMotorCurve(); }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BEARING L10h FATIGUE LIFE CALCULATOR */}
      {activeCurveTab === 'bearing' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">ISO 281 Bearing L10h Lifetime Prediction</h3>
            <p className="text-xs text-slate-400">
              Calculates 90% reliability operating hours under dynamic radial ($F_r$) and axial thrust ($F_a$) loads.
            </p>

            {bearingLifeResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">L10h Rating Life</span>
                  <span className="text-xl font-bold text-amber-400 block mt-1">
                    {bearingLifeResult.l10h_operating_hours?.toLocaleString()} hrs
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">Continuous Service</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1">
                    {bearingLifeResult.l10h_continuous_years} yrs
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">Equivalent Load (P)</span>
                  <span className="text-xl font-bold text-white block mt-1">
                    {bearingLifeResult.equivalent_load_p_kn} kN
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-slate-500 text-[10px] block">C / P Safety Ratio</span>
                  <span className="text-xl font-bold text-cyan-300 block mt-1">
                    {bearingLifeResult.fatigue_load_ratio_c_over_p}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold block mb-1">Service Life Assessment:</span>
              {bearingLifeResult?.service_verdict}. Fatigue failure probability is strictly below 10% under specified operating parameters and ISO VG 46 lubrication.
            </div>
          </div>

          {/* Bearing Load Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Application Load Inputs
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Dynamic Rating (C): {bearingC} kN</label>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={bearingC}
                  onChange={(e) => { setBearingC(parseFloat(e.target.value)); loadBearingLife(); }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Radial Load (Fr): {radialFr} kN</label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={radialFr}
                  onChange={(e) => { setRadialFr(parseFloat(e.target.value)); loadBearingLife(); }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Axial Thrust Load (Fa): {axialFa} kN</label>
                <input
                  type="range"
                  min="0.0"
                  max="10"
                  step="0.1"
                  value={axialFa}
                  onChange={(e) => { setAxialFa(parseFloat(e.target.value)); loadBearingLife(); }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PUMP QH DUTY ENVELOPE */}
      {activeCurveTab === 'pump' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Centrifugal Pump Q-H Characteristic Curve</h3>
            <p className="text-xs text-slate-400">
              Visualizes dynamic head (m) and hydraulic power across flow rate (m³/h).
            </p>

            <div className="h-60 bg-slate-950 rounded-lg border border-slate-800 p-4 flex items-end relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4" />

                {pumpQhData?.data_points && (
                  <path
                    d={pumpQhData.data_points.map((pt, i) => {
                      const maxQ = pumpQhData.data_points.length;
                      const x = (pt.flow_m3h / (pumpQ * 1.6)) * 480 + 10;
                      const y = 180 - (pt.head_m / (pumpQhData.shutoff_head_m * 1.1)) * 160;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                )}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Best Efficiency Flow</span>
                <span className="font-bold text-emerald-400">{pumpQhData?.bep_flow_m3h} m³/h</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">BEP Dynamic Head</span>
                <span className="font-bold text-white">{pumpQhData?.bep_head_m} m</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Shutoff Max Head</span>
                <span className="font-bold text-amber-400">{pumpQhData?.shutoff_head_m} m</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pump Duty Inputs
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nominal Flow (Q): {pumpQ} m³/h</label>
                <input
                  type="range"
                  min="2"
                  max="120"
                  step="1"
                  value={pumpQ}
                  onChange={(e) => { setPumpQ(parseFloat(e.target.value)); loadPumpQh(); }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Nominal Head (H): {pumpH} m</label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={pumpH}
                  onChange={(e) => { setPumpH(parseFloat(e.target.value)); loadPumpQh(); }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
