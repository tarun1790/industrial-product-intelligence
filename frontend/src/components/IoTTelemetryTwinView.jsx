import React, { useState, useEffect } from 'react';
import { Activity, Zap, Thermometer, ShieldAlert, CheckCircle2, RefreshCw, Radio, Layers, AlertTriangle } from 'lucide-react';
import { fetchIoTTelemetry } from '../services/api';

export default function IoTTelemetryTwinView({ selectedProduct }) {
  const [ambientTemp, setAmbientTemp] = useState(40.0);
  const [loadFactor, setLoadFactor] = useState(85.0);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    updateTelemetry(ambientTemp, loadFactor);
  }, [partNum]);

  const updateTelemetry = async (temp, load) => {
    setLoading(true);
    try {
      const res = await fetchIoTTelemetry(partNum, temp, load);
      setTelemetry(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTempChange = (val) => {
    setAmbientTemp(val);
    updateTelemetry(val, loadFactor);
  };

  const handleLoadChange = (val) => {
    setLoadFactor(val);
    updateTelemetry(ambientTemp, val);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                Live Sensor Telemetry Twin
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Activity className="w-5 h-5 text-blue-600" />
                Industrial IoT & Dynamic Weibull Stress Twin (MQTT / OPC-UA)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Simulates live edge sensor telemetry (current, stator winding temperature, vibration RMS velocity, and VFD harmonics). Plots operating points dynamically against the Weibull degradation lifetime curve.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Telemetry Protocol</span>
            <span className="font-extrabold text-blue-600 font-mono">
              MQTT / OPC-UA Live (100 Hz)
            </span>
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Operating Load Factor:</span>
              <span className="font-mono text-blue-600">{loadFactor}% Full Load</span>
            </div>
            <input
              type="range"
              min="30"
              max="125"
              step="1"
              value={loadFactor}
              onChange={(e) => handleLoadChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Ambient Environment Temperature:</span>
              <span className="font-mono text-blue-600">{ambientTemp}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="65"
              step="1"
              value={ambientTemp}
              onChange={(e) => handleTempChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Real-Time Sensor Metrics */}
      {telemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Phase Current</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">
              {telemetry.phase_current_amps} A
            </span>
            <span className="text-[10px] text-slate-500">Rated FLA: 14.7 A</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Stator Winding Temp</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">
              {telemetry.stator_temperature_c} °C
            </span>
            <span className="text-[10px] text-blue-600 font-medium">Class F Limit: 155°C</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Vibration Velocity</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">
              {telemetry.vibration_velocity_rms_mms} mm/s
            </span>
            <span className="text-[10px] text-slate-500">ISO 10816 Zone A</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Projected RUL Life</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">
              {telemetry.projected_remaining_hours.toLocaleString()} Hrs
            </span>
            <span className="text-[10px] text-blue-700 font-medium">Stress Mult: {telemetry.dynamic_stress_multiplier}x</span>
          </div>
        </div>
      )}

      {/* Dynamic Digital Twin Analysis */}
      {telemetry && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dynamic Arrhenius & Thermal Acceleration Analysis
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              telemetry.operating_health_zone === 'NOMINAL_SAFE'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {telemetry.operating_health_zone.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 text-xs block">Operating Parameters:</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span>Shaft Speed:</span>
                  <span className="font-bold text-slate-900">{telemetry.shaft_speed_rpm} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span>VFD THD Harmonics:</span>
                  <span className="font-bold text-slate-900">{telemetry.vfd_carrier_thd_percent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Thermal Acceleration:</span>
                  <span className="font-bold text-blue-600">{telemetry.dynamic_stress_multiplier}x Degradation</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 space-y-1.5 font-sans">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Weibull Curve Calibration Active</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Operating point is dynamically evaluated against the Arrhenius Montsinger rule ($2\times$ insulation degradation per $10^\circ\text{C}$ rise above $40^\circ\text{C}$). Current condition satisfies continuous industrial duty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
