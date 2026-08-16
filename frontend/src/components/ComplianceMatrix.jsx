import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, FileCheck, Flame, Droplets } from 'lucide-react';
import { validateCompliance } from '../services/api';

export default function ComplianceMatrix({ product }) {
  const [zone, setZone] = useState("Zone 1 (Gas / Flammable Vapors)");
  const [gasGroup, setGasGroup] = useState("IIC (Hydrogen / Acetylene)");
  const [tempClass, setTempClass] = useState("T4 (135°C)");
  const [washdown, setWashdown] = useState(false);
  const [complianceResult, setComplianceResult] = useState(null);

  useEffect(() => {
    runComplianceCheck();
  }, [zone, gasGroup, tempClass, washdown]);

  const runComplianceCheck = async () => {
    try {
      const res = await validateCompliance({
        category: product?.category || "Industrial Motor",
        target_zone: zone,
        target_gas_group: gasGroup,
        target_temp_class: tempClass,
        is_washdown_required: washdown
      });
      setComplianceResult(res);
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
                SAFETY & HAZLOC STANDARDS
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Hazardous Area (ATEX / IECEx) & Sanitary Compliance Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated safety validation for explosive atmospheres (Zone 0/1/2), gas groups, auto-ignition temperature classes, and FDA/IP69K washdown sanitation.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block">Certification Status:</span>
            <span className="text-xs font-bold text-emerald-400">
              {complianceResult?.is_fully_compliant ? 'VERIFIED COMPLIANT' : 'REVIEW REQUIRED'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Columns: Compliance Report */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">Certified HazLoc Marking</span>
                <h3 className="text-sm font-bold text-white mt-1">
                  {complianceResult?.certified_marking}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Minimum Enclosure</span>
                <span className="text-xs font-bold text-amber-400">{complianceResult?.enclosure_requirement}</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Mandatory Safety Standard Checks
              </div>

              {complianceResult?.safety_checks?.map((chk, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      {chk.rule}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-emerald-400 border border-slate-800">
                      PASSED
                    </span>
                  </div>
                  <p className="text-slate-400 pl-6 text-[11px]">{chk.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Environment Selectors */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Plant Environment Configuration
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">ATEX / IECEx Zone:</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-xs"
              >
                <option value="Safe Area (Non-Hazardous)">Safe Area (Non-Hazardous)</option>
                <option value="Zone 1 (Gas / Flammable Vapors)">Zone 1 (Gas / Flammable Vapors)</option>
                <option value="Zone 2 (Occasional Gas / Vapors)">Zone 2 (Occasional Gas / Vapors)</option>
                <option value="Zone 21 (Conductive Combustible Dust)">Zone 21 (Conductive Combustible Dust)</option>
                <option value="Zone 22 (Non-Conductive Dust)">Zone 22 (Non-Conductive Dust)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Gas / Dust Group:</label>
              <select
                value={gasGroup}
                onChange={(e) => setGasGroup(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-xs"
              >
                <option value="IIA (Propane / Methane)">IIA (Propane / Methane)</option>
                <option value="IIB (Ethylene)">IIB (Ethylene)</option>
                <option value="IIC (Hydrogen / Acetylene)">IIC (Hydrogen / Acetylene - Highest Risk)</option>
                <option value="IIIC (Conductive Dust)">IIIC (Conductive Dust)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Temperature Class (Auto-Ignition):</label>
              <select
                value={tempClass}
                onChange={(e) => setTempClass(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white font-mono text-xs"
              >
                <option value="T3 (200°C)">T3 (Max Surface 200°C)</option>
                <option value="T4 (135°C)">T4 (Max Surface 135°C - Recommended)</option>
                <option value="T5 (100°C)">T5 (Max Surface 100°C)</option>
                <option value="T6 (85°C)">T6 (Max Surface 85°C - Severe)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Sanitary Washdown Required:</span>
              <input
                type="checkbox"
                checked={washdown}
                onChange={(e) => setWashdown(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
