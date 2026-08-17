import React, { useState, useEffect } from 'react';
import { FlaskConical, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, Layers, Droplets } from 'lucide-react';
import { evaluateChemicalCorrosion } from '../services/api';

export default function ChemicalCorrosionView({ selectedProduct }) {
  const [report, setReport] = useState(null);
  const [baseMaterial, setBaseMaterial] = useState('AISI 316L Electropolished');
  const [elastomer, setElastomer] = useState('EPDM FDA');
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'LKH-10/140';

  useEffect(() => {
    loadCorrosionReport();
  }, [partNum, baseMaterial, elastomer]);

  const loadCorrosionReport = async () => {
    setLoading(true);
    try {
      const data = await evaluateChemicalCorrosion(partNum, baseMaterial, elastomer);
      setReport(data);
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
                NACE MR0175 / ISO 15156 Metallurgy
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <FlaskConical className="w-5 h-5 text-blue-600" />
                Hazardous Chemical Process Compatibility & Corrosion Rate Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Cross-references wetted metallurgy (316L, Hastelloy C-276, Titanium) and elastomers against corrosive acids, caustic CIP chemicals, and sour gas. Calculates penetration rates and stress cracking risks.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Safe Media Rating</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {report?.safe_chemicals_count} / {report?.tested_chemicals_count} Approved Media
            </span>
          </div>
        </div>

        {/* Dynamic Metallurgy Selectors */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Wetted Metallurgy Alloy:</label>
            <select
              value={baseMaterial}
              onChange={(e) => setBaseMaterial(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium cursor-pointer"
            >
              <option value="AISI 316L Electropolished">AISI 316L Stainless Steel (Ra ≤ 0.8 µm)</option>
              <option value="Hastelloy C-276 Superalloy">Hastelloy C-276 (High Nickel-Moly)</option>
              <option value="Titanium Grade 2">Titanium Grade 2 (Commercial Pure)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Wetted Seal Elastomer:</label>
            <select
              value={elastomer}
              onChange={(e) => setElastomer(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-medium cursor-pointer"
            >
              <option value="EPDM FDA">EPDM FDA Class VI (Standard CIP)</option>
              <option value="FKM / Viton">FKM / Viton (Hydrocarbons / Oils)</option>
              <option value="Kalrez 6375 FFKM">Kalrez 6375 FFKM (Aggressive Chemicals)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chemical Evaluations Ledger */}
      {report && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Corrosive Chemical Resistance Ledger ({report.media_evaluations.length} Tested Media)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Standardized ASTM A967 & NACE testing</span>
            </div>
            <span className="text-xs text-blue-700 font-bold font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              {report.overall_process_suitability.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.media_evaluations.map((chem, idx) => {
              const isPass = chem.compatibility_grade.includes('EXCELLENT') || chem.compatibility_grade.includes('GOOD');
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                    isPass
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{chem.chemical_name}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-medium">{chem.chemical_formula} • {chem.operating_temp_c}°C</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isPass ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {chem.compatibility_grade.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white border border-slate-200 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Corrosion Rate:</span>
                      <strong className="text-slate-900">{chem.corrosion_rate_mm_per_year} mm/yr</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Stress Cracking Risk:</span>
                      <strong className={isPass ? 'text-blue-700' : 'text-red-700'}>{chem.stress_corrosion_cracking_risk}</strong>
                    </div>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                    {chem.engineering_handling_notes}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{report.corrosion_prevention_protocol}</span>
          </div>
        </div>
      )}
    </div>
  );
}
