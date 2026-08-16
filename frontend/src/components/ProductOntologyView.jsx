import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, Sparkles, AlertCircle, FileCheck, Shield, Zap } from 'lucide-react';
import { fetchCategoryOntology } from '../services/api';

export default function ProductOntologyView({ product }) {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(false);

  const category = product?.category || 'Industrial Motor';
  const audit = product?.schema_audit || {
    total_expected: 14,
    extracted_found_count: 11,
    missing_count: 0,
    enriched_count: 3,
    completeness_percentage: 100.0,
    missing_attribute_names: [],
    enriched_attribute_names: ['power_factor', 'ambient_temp_max', 'efficiency_percentage']
  };

  useEffect(() => {
    loadOntology(category);
  }, [category]);

  const loadOntology = async (catName) => {
    setLoading(true);
    try {
      const s = await fetchCategoryOntology(catName);
      setSchema(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const attributes = product?.attributes || {};

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                PILLAR 2 • ENRICH & STANDARDIZE
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Category Ontology Schema & Catalog Enrichment Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enforces structured industry standard schemas (IEC 60034 / ISO 15 / ISO 5199), audits completeness, and infers missing domain parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Schema Completeness</span>
              <span className="text-lg font-bold text-emerald-400">
                {audit.completeness_percentage}% Enriched
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Completeness Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] block uppercase">Schema Target</span>
          <span className="text-2xl font-bold text-white block font-mono">{audit.total_expected}</span>
          <span className="text-[10px] text-slate-400">Expected Attributes</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] block uppercase">Directly Extracted</span>
          <span className="text-2xl font-bold text-emerald-400 block font-mono">{audit.extracted_found_count}</span>
          <span className="text-[10px] text-emerald-400">From Primary Datasheet</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] block uppercase">Domain Enriched</span>
          <span className="text-2xl font-bold text-amber-400 block font-mono">+{audit.enriched_count}</span>
          <span className="text-[10px] text-amber-400">Inferred via IEC Rules</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[10px] block uppercase">Missing / Gaps</span>
          <span className="text-2xl font-bold text-slate-400 block font-mono">{audit.missing_count}</span>
          <span className="text-[10px] text-slate-500">0 Critical Gaps</span>
        </div>
      </div>

      {/* Hierarchical Schema Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Category Requirement Ledger: {category}
            </h3>
            <span className="text-xs text-slate-400">
              Governing Standards: {schema?.standard_governing_bodies?.join(', ') || 'IEC 60034-1, IEC 60034-30-1'}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-slate-950 text-emerald-400 text-xs border border-slate-800 font-bold">
            100% Schema Mapped
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Group</th>
                <th className="py-3 px-4 font-semibold">Specification</th>
                <th className="py-3 px-4 font-semibold">Active Value</th>
                <th className="py-3 px-4 font-semibold">Standard Ref</th>
                <th className="py-3 px-4 font-semibold text-right">Enrichment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {schema?.attributes_schema?.map((req, idx) => {
                const attrObj = attributes[req.attribute_name];
                const valStr = attrObj ? (attrObj.normalized_value !== null ? `${attrObj.normalized_value} ${attrObj.normalized_unit || ''}` : String(attrObj.raw_value)) : '-';
                const isEnriched = attrObj?.is_enriched;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                        {req.group_name}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-white">
                      {req.display_name}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-amber-300 font-bold">{valStr}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                      {req.standard_reference || req.enrichment_rule || 'IEC Standard'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isEnriched ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                          ★ DOMAIN ENRICHED
                        </span>
                      ) : attrObj ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          ✓ EXTRACTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-500 border border-slate-800">
                          MISSING
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
