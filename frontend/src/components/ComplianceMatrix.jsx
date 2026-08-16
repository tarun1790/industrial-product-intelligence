import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { validateCompliance } from '../services/api';

export default function ComplianceMatrix({ product }) {
  const [zone, setZone] = useState('Zone 1 (Gas / Flammable Vapors)');
  const [gasGroup, setGasGroup] = useState('IIC (Hydrogen / Acetylene)');
  const [tempClass, setTempClass] = useState('T4 (135°C)');
  const [washdown, setWashdown] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runComplianceCheck();
  }, [product, zone, gasGroup, tempClass, washdown]);

  const runComplianceCheck = async () => {
    setLoading(true);
    try {
      const res = await validateCompliance({
        category: product?.category || 'Industrial Motor',
        target_zone: zone,
        target_gas_group: gasGroup,
        target_temp_class: tempClass,
        is_washdown_required: washdown
      });
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
                Standards & Safety
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                Hazardous Area (ATEX / IECEx) & Environmental Compliance Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Validates equipment for explosive atmospheres (ATEX Directive 2014/34/EU), Ingress Protection (IP66/IP69K), and temperature ratings.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Compliance Verdict</span>
            <span className="font-bold text-blue-700">
              {report?.overall_compliant ? 'CERTIFIED COMPLIANT' : 'RESTRICTED COMPLIANCE'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Requirements Selector */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Target Installation Environment
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-slate-600 font-medium block mb-1">Hazardous Zone:</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-sans"
              >
                <option>Zone 1 (Gas / Flammable Vapors)</option>
                <option>Zone 2 (Occasional Gas / Vapors)</option>
                <option>Zone 21 (Combustible Dust)</option>
                <option>Zone 22 (Occasional Dust)</option>
                <option>Safe Area (Non-Hazardous)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Gas Group:</label>
              <select
                value={gasGroup}
                onChange={(e) => setGasGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-sans"
              >
                <option>IIC (Hydrogen / Acetylene)</option>
                <option>IIB (Ethylene / High Hazard)</option>
                <option>IIA (Propane / Industrial Methane)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 font-medium block mb-1">Temperature Class:</label>
              <select
                value={tempClass}
                onChange={(e) => setTempClass(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 font-sans"
              >
                <option>T4 (135°C Max Surface Temp)</option>
                <option>T3 (200°C Max Surface Temp)</option>
                <option>T2 (300°C Max Surface Temp)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="washdown"
                checked={washdown}
                onChange={(e) => setWashdown(e.target.checked)}
                className="accent-blue-600"
              />
              <label htmlFor="washdown" className="text-slate-700 font-medium cursor-pointer">
                High-Pressure Washdown Required (IP69K)
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Standards Evaluation Ledger */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              Statutory Standard Validation Ledger ({report?.evaluations?.length || 4} Directives)
            </h3>
            <span className="text-xs text-blue-700 font-semibold">Directive 2014/34/EU</span>
          </div>

          <div className="space-y-3">
            {report?.evaluations?.map((ev, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ev.standard_name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ev.compliant ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-200 text-slate-800 border border-slate-300'
                  }`}>
                    {ev.compliant ? 'COMPLIANT ✓' : 'REQUIRES SPECIAL ENCLOSURE'}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans">{ev.details}</p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Applied Standard: {ev.governing_clause || 'IEC 60079-0 General Requirements'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
