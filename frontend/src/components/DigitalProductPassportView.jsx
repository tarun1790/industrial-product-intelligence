import React, { useState, useEffect } from 'react';
import { Leaf, ShieldCheck, QrCode, Cpu, ArrowDownRight, RefreshCw, Key } from 'lucide-react';
import { fetchDigitalProductPassport } from '../services/api';

export default function DigitalProductPassportView({ product }) {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPassport();
  }, [product]);

  const loadPassport = async () => {
    setLoading(true);
    try {
      const d = await fetchDigitalProductPassport(product?.part_number, product?.manufacturer);
      setPassport(d);
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
                Sustainability & EU ESPR 2024
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-blue-600" />
                EU ESPR Digital Product Passport (DPP) & Carbon Lifecycle
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Implements the mandatory EU Ecodesign for Sustainable Products Regulation standard, providing recyclability indices, Critical Raw Material (CRM) tracking, and cryptographic provenance seals.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Standard Compliance</span>
            <span className="font-bold text-blue-700">
              EU ESPR 2024 / IEC 60034-30-1
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {passport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Circularity Rate</span>
            <span className="text-2xl font-bold text-blue-700 block font-mono">
              {passport.circularity_metrics.recyclability_rate_percent}%
            </span>
            <span className="text-[10px] text-slate-500">Directly Recyclable</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Embodied Carbon</span>
            <span className="text-2xl font-bold text-slate-900 block font-mono">
              {passport.carbon_lifecycle.manufacturing_embodied_co2_kg} kg
            </span>
            <span className="text-[10px] text-slate-500">CO₂e Scope 1/2</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Annual CO₂ Avoided</span>
            <span className="text-2xl font-bold text-blue-600 block font-mono">
              -{passport.carbon_lifecycle.annual_operational_co2_avoided_kg} kg
            </span>
            <span className="text-[10px] text-blue-700 font-medium">vs IE2 baseline / yr</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Carbon Breakeven</span>
            <span className="text-2xl font-bold text-blue-700 block font-mono">
              {passport.carbon_lifecycle.payback_carbon_breakeven_months} mos
            </span>
            <span className="text-[10px] text-blue-700 font-medium">Net Carbon Negative</span>
          </div>
        </div>
      )}

      {/* Bill of Materials & Critical Raw Materials (CRM) */}
      {passport && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Bill of Materials & Critical Raw Materials (CRM) Ledger
              </h3>
              <span className="text-xs text-slate-500">Mass Breakdown (45 kg Total)</span>
            </div>

            <div className="space-y-2.5">
              {passport.bill_of_materials_crm.map((mat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {mat.material}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold font-mono">{mat.mass_kg} kg ({mat.percentage}%)</span>
                      {mat.is_critical_raw_material && (
                        <span className="px-2 py-0.2 rounded text-[9px] bg-slate-100 text-slate-800 border border-slate-300 font-bold">
                          EU CRM LIST
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${mat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Merkle Provenance Seal */}
          <div className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Verifiable Cryptographic Proof
                </span>
                <Key className="w-4 h-4 text-blue-600" />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Passport Universal URN:</span>
                <span className="text-blue-700 font-mono text-[11px] break-all block">
                  {passport.passport_urn}
                </span>

                <span className="text-[10px] text-slate-500 block uppercase font-medium pt-2">SHA-256 Merkle Provenance Seal:</span>
                <span className="text-slate-800 font-mono text-[10px] break-all block bg-white p-2 rounded border border-slate-200">
                  {passport.cryptographic_merkle_seal}
                </span>
              </div>

              <div className="p-3 rounded bg-blue-50/50 border border-blue-200 text-xs text-slate-700">
                <span className="text-blue-900 font-bold block mb-0.5">Repairability Index:</span>
                {passport.circularity_metrics.repairability_index}. Modular stator rewinding and standardized bearing replacements supported.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Service Life: {passport.circularity_metrics.expected_service_lifetime_years} Years</span>
              <span className="text-blue-700 font-bold">ESPR Certified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
