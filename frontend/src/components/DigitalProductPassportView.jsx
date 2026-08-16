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
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-emerald-400 border border-slate-800 font-bold">
                SUSTAINABILITY & EU ESPR 2024
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                EU ESPR Digital Product Passport (DPP) & Carbon Lifecycle
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Implements the mandatory EU Ecodesign for Sustainable Products Regulation standard, providing recyclability indices, Critical Raw Material (CRM) tracking, and cryptographic provenance seals.
            </p>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-right">
            <span className="text-slate-500 block text-[10px]">Standard Compliance</span>
            <span className="font-bold text-emerald-400">
              EU ESPR 2024 / IEC 60034-30-1
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {passport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Circularity Rate</span>
            <span className="text-2xl font-bold text-emerald-400 block font-mono">
              {passport.circularity_metrics.recyclability_rate_percent}%
            </span>
            <span className="text-[10px] text-slate-400">Directly Recyclable</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Embodied Carbon</span>
            <span className="text-2xl font-bold text-amber-400 block font-mono">
              {passport.carbon_lifecycle.manufacturing_embodied_co2_kg} kg
            </span>
            <span className="text-[10px] text-slate-400">CO₂e Scope 1/2</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Annual CO₂ Avoided</span>
            <span className="text-2xl font-bold text-emerald-400 block font-mono">
              -{passport.carbon_lifecycle.annual_operational_co2_avoided_kg} kg
            </span>
            <span className="text-[10px] text-emerald-400">vs IE2 baseline / yr</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase">Carbon Breakeven</span>
            <span className="text-2xl font-bold text-cyan-400 block font-mono">
              {passport.carbon_lifecycle.payback_carbon_breakeven_months} mos
            </span>
            <span className="text-[10px] text-cyan-400">Net Carbon Negative</span>
          </div>
        </div>
      )}

      {/* Bill of Materials & Critical Raw Materials (CRM) */}
      {passport && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                Bill of Materials & Critical Raw Materials (CRM) Ledger
              </h3>
              <span className="text-xs text-slate-400">Mass Breakdown (45 kg Total)</span>
            </div>

            <div className="space-y-2.5">
              {passport.bill_of_materials_crm.map((mat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      {mat.material}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-bold">{mat.mass_kg} kg ({mat.percentage}%)</span>
                      {mat.is_critical_raw_material && (
                        <span className="px-2 py-0.2 rounded text-[9px] bg-rose-950 text-rose-400 border border-rose-800 font-bold">
                          EU CRM LIST
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${mat.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Merkle Provenance Seal */}
          <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verifiable Cryptographic Proof
                </span>
                <Key className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-slate-500 block uppercase">Passport Universal URN:</span>
                <span className="text-emerald-400 font-mono text-[11px] break-all block">
                  {passport.passport_urn}
                </span>

                <span className="text-[10px] text-slate-500 block uppercase pt-2">SHA-256 Merkle Provenance Seal:</span>
                <span className="text-white font-mono text-[10px] break-all block bg-slate-900 p-2 rounded border border-slate-800">
                  {passport.cryptographic_merkle_seal}
                </span>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Repairability Score:</span>
                {passport.circularity_metrics.repairability_index}. Modular stator rewinding and standardized bearing replacements supported.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Service Life: {passport.circularity_metrics.expected_service_lifetime_years} Years</span>
              <span className="text-emerald-400 font-bold">ESPR Certified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
