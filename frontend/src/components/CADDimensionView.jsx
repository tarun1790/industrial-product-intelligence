import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, Ruler, ShieldCheck, Box, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { fetchCADDimensions } from '../services/api';

export default function CADDimensionView({ selectedProduct }) {
  const [report, setReport] = useState(null);
  const [selectedDim, setSelectedDim] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadDimensions();
  }, [partNum]);

  const loadDimensions = async () => {
    setLoading(true);
    try {
      const data = await fetchCADDimensions(partNum);
      setReport(data);
      if (data?.dimensions?.length > 0) {
        setSelectedDim(data.dimensions[0]);
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
                Mechanical Drawing CAD Vectorizer
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Compass className="w-5 h-5 text-blue-600" />
                2D Orthographic Engineering Blueprint & ISO Fit Clearance Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Extracts spatial dimension callouts (shaft diameter, flange PCD, foot hole spacing, and keyway) per IEC 60072-1 and validates ISO fit classes (H7/k6, H8/j6) for zero-clearance mechanical mating.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Mounting Envelope</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {report?.mounting_type || 'IM B35 Foot/Flange'}
            </span>
          </div>
        </div>
      </div>

      {/* Clearance Envelope Stat Cards */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Overall Length (L)</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{report.chassis_clearance_envelope.overall_length_mm} mm</span>
            <span className="text-[10px] text-slate-500">Axial Clearance</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Center Height (H)</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">160.0 mm</span>
            <span className="text-[10px] text-blue-600 font-medium">IEC Frame 160 Standard</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Shaft Diameter (D)</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">42.0 mm</span>
            <span className="text-[10px] text-slate-500">Tolerance: k6 (+18/+2 µm)</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Net Mass</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">{report.chassis_clearance_envelope.net_mass_kg} kg</span>
            <span className="text-[10px] text-blue-700 font-medium">Cast-Iron Stator Body</span>
          </div>
        </div>
      )}

      {/* Blueprint Schematic & Fits Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Technical Blueprint */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Interactive 2D Orthographic Schematic (Frame {report?.frame_size || '160M'})
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Click on any dimension callout below to highlight on blueprint</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
              IEC 60072-1 Compliant
            </span>
          </div>

          {/* SVG Vector Drawing Canvas */}
          <div className="w-full bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[360px]">
            {/* Grid overlay for CAD feel */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

            <svg viewBox="0 0 540 280" className="w-full max-w-lg h-auto relative z-10">
              {/* Motor Stator Body */}
              <rect x="140" y="70" width="260" height="140" rx="12" fill="#1e293b" stroke="#60a5fa" strokeWidth="2.5" />
              
              {/* Cooling Fins Details */}
              <line x1="170" y1="70" x2="170" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="210" y1="70" x2="210" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="250" y1="70" x2="250" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="290" y1="70" x2="290" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="330" y1="70" x2="330" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="370" y1="70" x2="370" y2="210" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Terminal Box */}
              <rect x="230" y="35" width="80" height="35" rx="4" fill="#0f172a" stroke="#93c5fd" strokeWidth="2" />
              <text x="270" y="56" fill="#93c5fd" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">IP66 TERMINAL</text>

              {/* Drive-End Shaft */}
              <rect x="400" y="118" width="90" height="44" rx="2" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <text x="445" y="144" fill="#0f172a" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">Ø42 k6</text>

              {/* Keyway on shaft */}
              <rect x="420" y="118" width="55" height="8" fill="#0369a1" stroke="#ffffff" strokeWidth="1" />

              {/* Flange Register Ring (B35) */}
              <rect x="385" y="50" width="15" height="180" rx="2" fill="#0284c7" stroke="#bae6fd" strokeWidth="2" />

              {/* Mounting Feet */}
              <rect x="170" y="210" width="45" height="25" rx="2" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
              <rect x="325" y="210" width="45" height="25" rx="2" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
              <circle cx="192" cy="222" r="5" fill="#38bdf8" />
              <circle cx="347" cy="222" r="5" fill="#38bdf8" />

              {/* Center Line */}
              <line x1="80" y1="140" x2="510" y2="140" stroke="#ef4444" strokeWidth="1" strokeDasharray="8 4 2 4" />
              
              {/* Dimension Arrow: Center Height H = 160mm */}
              <line x1="100" y1="140" x2="100" y2="235" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="97,144 100,140 103,144" fill="#fbbf24" />
              <polygon points="97,231 100,235 103,231" fill="#fbbf24" />
              <text x="85" y="192" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">H=160</text>

              {/* Dimension Arrow: Shaft Length E = 110mm */}
              <line x1="400" y1="180" x2="490" y2="180" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="404,177 400,180 404,183" fill="#fbbf24" />
              <polygon points="486,177 490,180 486,183" fill="#fbbf24" />
              <text x="445" y="200" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">E=110mm</text>
            </svg>
          </div>
        </div>

        {/* Right 5 Cols: Dimension Callouts Ledger & Fit Classification */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extracted Dimension Callouts ({report?.dimensions?.length || 8})
              </h3>
              <span className="text-xs text-blue-600 font-bold font-mono">ISO 286 Tolerances</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {report?.dimensions?.map((dim) => {
                const isSelected = selectedDim?.key === dim.key;
                return (
                  <button
                    key={dim.key}
                    onClick={() => setSelectedDim(dim)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-mono font-bold text-[10px] flex items-center justify-center">
                          {dim.symbol}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{dim.name}</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-blue-700">
                        {dim.nominal_value_mm} mm
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pl-6.5 font-mono">
                      <span>Tol: <strong className="text-slate-700">{dim.iso_tolerance_class}</strong></span>
                      <span>Range: [{dim.min_limit_mm}, {dim.max_limit_mm}]</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mechanical Fit Compatibility Section */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Calculated Mechanical Interface Fits:
              </span>
              <div className="space-y-1.5">
                {report?.mechanical_fits?.map((fit, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{fit.mating_part_name}</span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                        {fit.fit_classification}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {fit.engineering_notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
