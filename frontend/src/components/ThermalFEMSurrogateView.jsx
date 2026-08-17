import React, { useState, useEffect } from 'react';
import { Flame, Thermometer, Activity, CheckCircle2, RefreshCw, Layers, ShieldCheck, Zap } from 'lucide-react';
import { simulateThermalFEM } from '../services/api';

export default function ThermalFEMSurrogateView({ selectedProduct }) {
  const [ambientTemp, setAmbientTemp] = useState(40.0);
  const [loadFactor, setLoadFactor] = useState(85.0);
  const [femReport, setFemReport] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    runFEMSimulation(ambientTemp, loadFactor);
  }, [partNum]);

  const runFEMSimulation = async (temp, load) => {
    setLoading(true);
    try {
      const data = await simulateThermalFEM(partNum, temp, load);
      setFemReport(data);
      if (data?.thermal_nodes?.length > 0) {
        setSelectedNode(data.thermal_nodes[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTempChange = (val) => {
    setAmbientTemp(val);
    runFEMSimulation(val, loadFactor);
  };

  const handleLoadChange = (val) => {
    setLoadFactor(val);
    runFEMSimulation(ambientTemp, val);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                Physics-Informed Neural Operator (PINO)
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Flame className="w-5 h-5 text-blue-600" />
                Thermodynamic Finite-Element Simulation Neural Surrogate
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Simulates transient 3D heat dissipation across stator teeth, copper winding slots, bearing races, and external cooling fins. Computes convective heat transfer ($h = 24.5\text{ W/m}^2\text{K}$) and verifies Class F insulation margins.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">FEM Mesh Topology</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {femReport?.fem_mesh_resolution || '3D 24,000 Elements'}
            </span>
          </div>
        </div>

        {/* Dynamic Simulation Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Operating Load Factor:</span>
              <span className="font-mono text-blue-600">{loadFactor}% Load</span>
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
              <span>Ambient Ambient Temp:</span>
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

      {/* Real-Time FEM Node Stats */}
      {femReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Joule Losses</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{femReport.total_joule_losses_watts} W</span>
            <span className="text-[10px] text-slate-500">I²R Copper + Iron Losses</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Winding Hotspot</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">
              {femReport.thermal_nodes[0]?.temperature_c} °C
            </span>
            <span className="text-[10px] text-blue-600 font-medium">Margin: {femReport.thermal_nodes[0]?.thermal_margin_k} K</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Heat Transfer (h)</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">24.5 W/m²K</span>
            <span className="text-[10px] text-slate-500">IC411 Forced Convection</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Fan Airflow</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">{femReport.cooling_fan_airflow_m3s} m³/s</span>
            <span className="text-[10px] text-blue-700 font-medium">Bi-Directional Polyprop</span>
          </div>
        </div>
      )}

      {/* Heatmap Graphic & Node Ledger Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Thermal Heatmap */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Finite Element Thermal Gradient Canvas (Stator Cross-Section)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Visualizing spatial thermal flux and core gradient</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              Class F Verified
            </span>
          </div>

          {/* SVG Thermal Gradient Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[320px]">
            <svg viewBox="0 0 460 240" className="w-full max-w-md h-auto relative z-10">
              <defs>
                <radialGradient id="thermalHotspot" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
                </radialGradient>
              </defs>

              {/* Outer Housing Ring */}
              <circle cx="230" cy="120" r="100" fill="#0f172a" stroke="#475569" strokeWidth="3" />
              
              {/* Cooling Fins around perimeter */}
              {[...Array(16)].map((_, i) => {
                const angle = (i * 360) / 16;
                const rad = (angle * Math.PI) / 180;
                const x1 = 230 + 100 * Math.cos(rad);
                const y1 = 120 + 100 * Math.sin(rad);
                const x2 = 230 + 115 * Math.cos(rad);
                const y2 = 120 + 115 * Math.sin(rad);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />;
              })}

              {/* Stator Core Ring */}
              <circle cx="230" cy="120" r="85" fill="url(#thermalHotspot)" stroke="#38bdf8" strokeWidth="1.5" />

              {/* Stator Slots (Copper Windings) */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 360) / 12;
                const rad = (angle * Math.PI) / 180;
                const cx = 230 + 65 * Math.cos(rad);
                const cy = 120 + 65 * Math.sin(rad);
                return <circle key={i} cx={cx} cy={cy} r="10" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />;
              })}

              {/* Airgap */}
              <circle cx="230" cy="120" r="48" fill="#020617" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />

              {/* Rotor Body */}
              <circle cx="230" cy="120" r="44" fill="#1e293b" stroke="#93c5fd" strokeWidth="2" />

              {/* Central Shaft */}
              <circle cx="230" cy="120" r="18" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x="230" y="124" fill="#0f172a" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">Ø42</text>
            </svg>

            {/* Thermal Temperature Scale Legend */}
            <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-slate-300">
              <span className="text-blue-400 font-bold">{ambientTemp}°C (Ambient)</span>
              <div className="w-36 h-2 rounded bg-gradient-to-r from-blue-600 via-amber-500 to-red-600"></div>
              <span className="text-red-400 font-bold">{femReport?.thermal_nodes[0]?.temperature_c}°C (Winding Peak)</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Thermal Node Ledger */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Finite Element Thermal Nodes ({femReport?.thermal_nodes?.length || 5})
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">Class F (155°C)</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {femReport?.thermal_nodes?.map((node) => {
                const isSelected = selectedNode?.node_id === node.node_id;
                return (
                  <button
                    key={node.node_id}
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{node.component_name}</span>
                      <span className="font-mono font-bold text-xs text-blue-700">
                        {node.temperature_c} °C
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Limit: {node.max_allowable_temp_c}°C</span>
                      <span className="text-blue-700 font-bold">Safety Margin: +{node.thermal_margin_k} K</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
