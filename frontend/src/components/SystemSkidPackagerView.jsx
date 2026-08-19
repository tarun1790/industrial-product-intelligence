import React, { useState, useEffect } from 'react';
import { Package, Wrench, CheckCircle2, Download, RefreshCw, Layers, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';
import { synthesizeSkidPackage } from '../services/api';

export default function SystemSkidPackagerView() {
  const [appType, setAppType] = useState('Sanitary Food & Bio-Pharma CIP Booster Skid');
  const [flowRate, setFlowRate] = useState(35.0);
  const [skidData, setSkidData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSynthesis();
  }, [appType, flowRate]);

  const runSynthesis = async () => {
    setLoading(true);
    try {
      const data = await synthesizeSkidPackage(appType, flowRate);
      setSkidData(data);
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
                Multi-Sector Turnkey Assembly Synthesizer
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Package className="w-5 h-5 text-blue-600" />
                Cross-Sector Industrial Skid Packager & Turnkey BOM Synthesizer
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Synthesizes complete multi-vendor plant assemblies (Motor + Sanitary Pump + Switchgear + Coriolis Meter + Control Valve) into a turnkey engineering package with structural safety factors.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Turnkey BOM Cost</span>
            <span className="font-extrabold text-blue-600 font-mono">
              ${skidData?.total_turnkey_bom_cost_usd.toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Skid Application Archetype:</label>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium cursor-pointer text-xs"
            >
              <option value="Sanitary Food & Bio-Pharma CIP Booster Skid">Sanitary Food & Bio-Pharma CIP Booster Skid (316L Stainless)</option>
              <option value="Cryogenic LNG Regasification & Metering Skid">Cryogenic LNG Regasification & Metering Skid (ISO 28921)</option>
              <option value="Petrochemical High-Pressure Injection Skid">Petrochemical High-Pressure Injection Skid (API 610 / NACE)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Target Process Flow Rate:</span>
              <span className="font-mono text-blue-600">{flowRate} m³/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={flowRate}
              onChange={(e) => setFlowRate(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Skid Engineering Overview Stats */}
      {skidData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Connected Power</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{skidData.total_connected_electrical_kw} kW</span>
            <span className="text-[10px] text-slate-500">400V 3-Phase Grid Load</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Skid Mass</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">{skidData.total_skid_mass_kg} kg</span>
            <span className="text-[10px] text-blue-600 font-medium">Includes Steel Bedplate</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Structural Safety Factor</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{skidData.structural_safety_factor}x</span>
            <span className="text-[10px] text-slate-500">ISO 12100 Approved</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Footprint Envelope</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">1.8 x 1.1 m</span>
            <span className="text-[10px] text-blue-700 font-medium">Compact Skid Layout</span>
          </div>
        </div>
      )}

      {/* Multi-Sector Turnkey BOM Ledger */}
      {skidData && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Multi-Sector Bill of Materials (BOM) — {skidData.bom_items.length} Primary Assemblies
              </h3>
              <span className="text-xs text-slate-500 font-medium">Cross-sector interoperability verified</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Turnkey Package CAD / PDF</span>
            </button>
          </div>

          <div className="space-y-3">
            {skidData.bom_items.map((item) => (
              <div key={item.item_position} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      #{item.item_position}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{item.component_name}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-blue-700">
                    ${item.unit_cost_usd.toLocaleString()} USD
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-lg bg-white border border-slate-200 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Sector:</span>
                    <strong className="text-slate-800">{item.sector.split('&')[0]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Part #:</span>
                    <strong className="text-slate-800">{item.manufacturer} {item.part_number}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Power / Weight:</span>
                    <strong className="text-slate-800">{item.power_draw_kw} kW / {item.weight_kg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Standard:</span>
                    <strong className="text-blue-700">{item.safety_standard}</strong>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                  {item.functional_role}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{skidData.skid_certification_verdict}</span>
          </div>
        </div>
      )}
    </div>
  );
}
