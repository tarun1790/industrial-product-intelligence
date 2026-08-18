import React, { useState, useEffect } from 'react';
import { Recycle, Leaf, DollarSign, CheckCircle2, Download, RefreshCw, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import { fetchCircularDismantle } from '../services/api';

export default function CircularDismantleView({ selectedProduct }) {
  const [dismantleData, setDismantleData] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadDismantleTree();
  }, [partNum]);

  const loadDismantleTree = async () => {
    setLoading(true);
    try {
      const data = await fetchCircularDismantle(partNum);
      setDismantleData(data);
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
                ISO 14044 LCA & Remanufacturing Tree
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Recycle className="w-5 h-5 text-blue-600" />
                Circular Economy CAD Dismantle Tree & Residual Commodity Salvage Engine
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Deconstructs industrial machinery assemblies into recyclable metallurgical fractions (Copper, Silicon Steel, Cast Iron). Calculates London Metal Exchange (LME) scrap salvage rates and Material Circularity Index (MCI).
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Material Circularity Index</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {dismantleData?.material_circularity_index || 0.94} MCI (94% Circular)
            </span>
          </div>
        </div>
      </div>

      {/* Circular Stats Grid */}
      {dismantleData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Product Mass</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{dismantleData.total_product_mass_kg} kg</span>
            <span className="text-[10px] text-slate-500">Net Product Envelope</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Recyclable Mass</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">{dismantleData.total_recyclable_mass_kg} kg</span>
            <span className="text-[10px] text-blue-600 font-medium">100% Zero-Landfill</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Scrap Salvage Value</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">${dismantleData.total_commodity_salvage_value_usd} USD</span>
            <span className="text-[10px] text-blue-700 font-medium">LME Cash Commodity Value</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Virgin Carbon Offset</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{dismantleData.virgin_material_displacement_co2e_kg} kg</span>
            <span className="text-[10px] text-slate-500">Avoided Smelting CO₂</span>
          </div>
        </div>
      )}

      {/* Dismantle Steps Ledger */}
      {dismantleData && (
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                End-of-Life Disassembly & Remanufacturing Sequence ({dismantleData.dismantle_nodes.length} Stages)
              </h3>
              <span className="text-xs text-slate-500 font-medium">Step-by-step metallurgical recovery procedure</span>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Circular Passport PDF</span>
            </button>
          </div>

          <div className="space-y-3">
            {dismantleData.dismantle_nodes.map((node) => (
              <div key={node.node_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      {node.disassembly_step_sequence}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{node.component_name}</span>
                  </div>
                  <span className="text-blue-700 font-bold text-[10px] font-mono bg-blue-100/70 px-2 py-0.5 rounded">
                    {node.circular_pathway.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Mass:</span>
                    <strong className="text-slate-800">{node.mass_kg} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Material:</span>
                    <strong className="text-slate-800">{node.material_classification}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">LME Rate:</span>
                    <strong className="text-slate-800">${node.lme_scrap_rate_usd_per_kg}/kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recovered Cash:</span>
                    <strong className="text-blue-700">${node.recovered_salvage_value_usd} USD</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{dismantleData.esg_circularity_verdict}</span>
          </div>
        </div>
      )}
    </div>
  );
}
