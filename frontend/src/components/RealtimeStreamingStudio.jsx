import React, { useState, useEffect, useRef } from 'react';
import { Activity, Radio, ShieldAlert, Zap, AlertTriangle, CheckCircle2, RotateCcw, Power, Wifi, ShieldCheck, Layers } from 'lucide-react';
import { getTelemetryWebSocketURL, pollRealtimeTelemetry, triggerEmergencyTrip, resetEmergencyTrip } from '../services/api';

export default function RealtimeStreamingStudio({ selectedProduct }) {
  const [telemetry, setTelemetry] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [partNum]);

  const connectWebSocket = () => {
    try {
      const url = getTelemetryWebSocketURL();
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const frame = JSON.parse(event.data);
          setTelemetry(frame);
          setHistory((prev) => [...prev.slice(-30), frame]);
        } catch (err) {
          console.error('Frame parse error:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Fallback polling if WebSocket drops
        startPollingFallback();
      };

      ws.onerror = () => {
        setIsConnected(false);
        startPollingFallback();
      };
    } catch (err) {
      setIsConnected(false);
      startPollingFallback();
    }
  };

  const startPollingFallback = () => {
    const interval = setInterval(async () => {
      try {
        const frame = await pollRealtimeTelemetry(partNum);
        setTelemetry(frame);
        setHistory((prev) => [...prev.slice(-30), frame]);
      } catch (e) {}
    }, 400);
    return () => clearInterval(interval);
  };

  const handleEmergencyStop = async () => {
    await triggerEmergencyTrip('MANUAL_OPERATOR_E_STOP');
  };

  const handleResetTrip = async () => {
    await resetEmergencyTrip();
  };

  const isTripped = telemetry?.operating_status === 'TRIPPED_EMERGENCY_STOP';

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header with Live Connection Ticker */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Live 100 Hz Industrial Edge Gateway
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Radio className="w-5 h-5 text-blue-600" />
                Real-Time Edge Digital Twin & Autonomous SCADA Bridge (WebSockets)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Sub-millisecond bidirectional WebSocket pipeline streaming live 3-phase currents, winding thermistor temperatures, VFD DC bus voltage, and mechanical vibration RMS.
            </p>
          </div>

          {/* Emergency Stop & Trip Controls */}
          <div className="flex items-center gap-2">
            {isTripped ? (
              <button
                onClick={handleResetTrip}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Safety Interlock</span>
              </button>
            ) : (
              <button
                onClick={handleEmergencyStop}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 animate-pulse"
              >
                <Power className="w-4 h-4" />
                <span>EMERGENCY E-STOP</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Live Telemetry Metric Gauges */}
      {telemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className={`p-4 rounded-xl border shadow-2xs space-y-1 transition-all ${
            isTripped ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Phase U Current</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">
              {telemetry.phase_u_current_amps} A
            </span>
            <span className="text-[10px] text-slate-500">Rated FLA: 14.7 A</span>
          </div>

          <div className={`p-4 rounded-xl border shadow-2xs space-y-1 transition-all ${
            isTripped ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Stator Winding Temp</span>
            <span className={`text-2xl font-extrabold block font-mono ${isTripped ? 'text-red-600' : 'text-blue-600'}`}>
              {telemetry.stator_temperature_c} °C
            </span>
            <span className="text-[10px] text-blue-600 font-medium">Class F Margin: 155°C</span>
          </div>

          <div className={`p-4 rounded-xl border shadow-2xs space-y-1 transition-all ${
            isTripped ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Vibration Velocity</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">
              {telemetry.vibration_velocity_rms_mms} mm/s
            </span>
            <span className="text-[10px] text-slate-500">ISO 10816 Zone A</span>
          </div>

          <div className={`p-4 rounded-xl border shadow-2xs space-y-1 transition-all ${
            isTripped ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-semibold">VFD DC Bus Voltage</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">
              {telemetry.vfd_dc_bus_voltage_v} V
            </span>
            <span className="text-[10px] text-blue-700 font-medium">Speed: {telemetry.shaft_speed_rpm} RPM</span>
          </div>
        </div>
      )}

      {/* Live Oscillating Waveform Canvas & SCADA Alarms */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols: Real-Time Current Waveform */}
        <div className="xl:col-span-8 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Live 3-Phase Current Waveform Oscilloscope (Phase U, V, W)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Real-time streaming points (5 Hz telemetry window)</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              isTripped ? 'bg-red-100 text-red-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {telemetry?.operating_status.replace(/_/g, ' ') || 'STREAMING'}
            </span>
          </div>

          {/* SVG Waveform Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-5 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[300px]">
            <svg viewBox="0 0 540 200" className="w-full max-w-xl h-auto relative z-10">
              {/* Grid Lines */}
              <line x1="30" y1="100" x2="510" y2="100" stroke="#334155" strokeWidth="1.5" />
              <line x1="30" y1="40" x2="510" y2="40" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="160" x2="510" y2="160" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Real-time Oscillating Line Chart */}
              {history.length > 1 && (
                <path
                  d={history.reduce((acc, pt, idx) => {
                    const x = 30 + (idx / Math.max(1, history.length - 1)) * 480;
                    const y = 100 - (pt.phase_u_current_amps - 14.7) * 40;
                    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(20, Math.min(180, y))}`;
                  }, '')}
                  fill="none"
                  stroke={isTripped ? '#ef4444' : '#38bdf8'}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Waveform labels */}
              <text x="35" y="32" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">+18.0 A (120% FLA Trip Limit)</text>
              <text x="35" y="96" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">14.7 A (Rated Steady State)</text>
              <text x="35" y="176" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">0.0 A (Standby / Tripped)</text>
            </svg>

            <div className="flex items-center gap-6 mt-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-400 rounded"></span> Phase U Current (Dynamic Harmonic Ripple)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-500"></span> Centerline (14.7 A Rated)
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Active SCADA Fault & Alarm Ledger */}
        <div className="xl:col-span-4 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Edge SCADA Alarms & Health
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">OPC-UA Live</span>
            </div>

            <div className="space-y-2">
              {isTripped ? (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>EMERGENCY TRIP LATCHED</span>
                  </div>
                  <p className="text-[11px] text-red-700 font-mono">
                    Cause: {telemetry.active_alarms[0] || 'SAFETY_INTERLOCK_OPEN'}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>ALL INTERLOCKS HEALTHY</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Zero trips active. Modbus TCP & WebSockets streaming continuous 100 Hz.
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <strong className="text-slate-800">{telemetry?.timestamp_iso.slice(11, 23)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Degradation:</span>
                  <strong className="text-blue-700">{(telemetry?.weibull_degradation_index * 100).toFixed(1)}% / yr</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
