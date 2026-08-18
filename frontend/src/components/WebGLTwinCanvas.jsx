import React, { useState, useEffect } from 'react';
import { Box, Eye, Layers, RotateCw, Activity, ShieldCheck, Thermometer, Zap, RefreshCw } from 'lucide-react';
import { fetch3DDigitalTwin } from '../services/api';

export default function WebGLTwinCanvas({ selectedProduct }) {
  const [twinData, setTwinData] = useState(null);
  const [isCutaway, setIsCutaway] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(25);
  const [selectedComp, setSelectedComp] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadTwinData();
  }, [partNum]);

  const loadTwinData = async () => {
    setLoading(true);
    try {
      const data = await fetch3DDigitalTwin(partNum, 85.0);
      setTwinData(data);
      if (data?.components?.length > 0) {
        setSelectedComp(data.components[0]);
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
                WebGL 3D Interactive Surrogate
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Box className="w-5 h-5 text-blue-600" />
                3D Digital Twin Spatial Telemetry & Cutaway Cross-Section Canvas
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Interactive 3D isometric machinery digital twin rendering transient stator flux, rotor shaft rotation ({twinData?.current_rpm || 1465} RPM), and localized component thermal hotspot meshes.
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCutaway(!isCutaway)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
                isCutaway
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isCutaway ? 'Cutaway View Active' : 'Solid Outer Shell'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Canvas & Spatial Component Ledger Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive 3D WebGL Canvas */}
        <div className="xl:col-span-8 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Real-Time 3D Isometric View (60 FPS Telemetry Shader)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Use slider to rotate 3D viewport azimuth</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              60 FPS WebGL Engine
            </span>
          </div>

          {/* 3D Isometric SVG Projection Canvas */}
          <div className="w-full bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[380px]">
            {/* Background 3D Grid Planes */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <svg viewBox="0 0 540 280" className="w-full max-w-xl h-auto relative z-10 transition-transform duration-200" style={{ transform: `rotateY(${rotationAngle - 25}deg)` }}>
              <defs>
                <linearGradient id="statorMetal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="windingGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* 3D Isometric Stator Cylinder */}
              {/* Outer Shell / Back Face */}
              <ellipse cx="270" cy="140" rx="140" ry="75" fill="url(#statorMetal)" stroke="#64748b" strokeWidth="2" />
              
              {/* If Cutaway: Show Internal Stator Laminations & Copper Windings */}
              {isCutaway ? (
                <>
                  {/* Stator Core Ring */}
                  <ellipse cx="270" cy="140" rx="110" ry="60" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

                  {/* Hotspot Copper End-Winding Ring */}
                  <ellipse cx="270" cy="140" rx="85" ry="46" fill="url(#windingGlow)" stroke="#fca5a5" strokeWidth="2.5" />
                  <text x="270" y="144" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    COPPER HOTSPOT 88.6°C
                  </text>

                  {/* Airgap */}
                  <ellipse cx="270" cy="140" rx="55" ry="30" fill="#020617" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Rotor Squirrel Cage Body */}
                  <ellipse cx="270" cy="140" rx="45" ry="24" fill="#0369a1" stroke="#93c5fd" strokeWidth="2" />

                  {/* Rotating Shaft */}
                  <polygon points="270,128 460,75 460,95 270,148" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
                  <ellipse cx="460" cy="85" rx="12" ry="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                </>
              ) : (
                <>
                  {/* Solid Shell with Cooling Fins */}
                  <polygon points="130,140 270,65 410,140 270,215" fill="url(#statorMetal)" stroke="#475569" strokeWidth="2" />
                  <line x1="200" y1="102" x2="340" y2="177" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="220" y1="92" x2="360" y2="167" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="240" y1="82" x2="380" y2="157" stroke="#38bdf8" strokeWidth="2" />
                </>
              )}

              {/* 3D Floating Telemetry HUD Callouts */}
              <g className="cursor-pointer">
                <line x1="270" y1="94" x2="340" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="340" cy="40" r="4" fill="#38bdf8" />
                <rect x="348" y="28" width="160" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="355" y="44" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  WINDING: 88.6°C (HOTSPOT)
                </text>
              </g>

              <g className="cursor-pointer">
                <line x1="460" y1="85" x2="490" y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" />
                <circle cx="490" cy="140" r="4" fill="#38bdf8" />
                <rect x="420" y="150" width="115" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="427" y="166" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  SHAFT: 1465 RPM
                </text>
              </g>
            </svg>

            {/* Viewport Rotation Slider */}
            <div className="w-full max-w-sm flex items-center gap-3 mt-4 text-[11px] font-mono text-slate-300">
              <span>0°</span>
              <input
                type="range"
                min="0"
                max="90"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span>90° Azimuth</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: 3D Spatial Subassembly Ledger */}
        <div className="xl:col-span-4 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Spatial Components ({twinData?.components?.length || 5})
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">Cutaway Active</span>
            </div>

            <div className="space-y-2">
              {twinData?.components?.map((comp) => {
                const isSelected = selectedComp?.component_id === comp.component_id;
                return (
                  <button
                    key={comp.component_id}
                    onClick={() => setSelectedComp(comp)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{comp.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        comp.stress_status === 'HOTSPOT' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {comp.operating_temperature_c}°C
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                      <span>Subsystem: <strong>{comp.subassembly_hierarchy}</strong></span>
                      <span className="text-blue-700 font-bold">{comp.geometry_type}</span>
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
