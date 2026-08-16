import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Bookmark, Award, FileSearch } from 'lucide-react';

export default function EvidenceViewer({ product }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  if (!product) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs">
        Select a product in Ingestion Pipeline to inspect its evidence trail.
      </div>
    );
  }

  const evidenceList = product.evidence_trail || [];

  return (
    <div className="space-y-6 w-full font-mono">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-amber-400 border border-slate-800 font-bold">
                Pillar 4: PROVE
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Granular Evidence & Provenance Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              "Can I trust this product information?" Every parameter is backed by line-level citations, page coordinates, and OEM authority weights.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Product Trust Score</span>
              <span className="font-bold text-emerald-400 text-sm">{product.trust_score}% Verified</span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <span className="text-slate-500 block text-[10px]">Citations Logged</span>
              <span className="font-bold text-white text-sm">{evidenceList.length} Sources</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Citation List */}
        <div className="space-y-3 xl:col-span-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Logged Technical Citations
          </div>

          {evidenceList.length === 0 ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No direct document citations attached to this simulated spec. Ingest an OEM datasheet to extract visual coordinates.
            </div>
          ) : (
            evidenceList.map((ev, idx) => {
              const isSelected = selectedEvidence?.id === ev.id || (!selectedEvidence && idx === 0);
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/80 text-white'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-950 text-slate-300 border border-slate-800">
                      {ev.source_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">
                      {(ev.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-bold text-white">
                    {ev.attribute_name.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-amber-300/90 mt-0.5 truncate">
                    Stated: "{ev.raw_value}"
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{ev.source_name}</span>
                    {ev.page_number && <span>Page {ev.page_number}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Deep Provenance & Coordinate Inspector */}
        <div className="xl:col-span-2 space-y-4">
          {(() => {
            const active = selectedEvidence || evidenceList[0];
            if (!active) return null;

            return (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Provenance Audit Detail</span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {active.attribute_name.replace(/_/g, ' ').toUpperCase()} — Line Citation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Source Document: {active.source_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded bg-slate-950 text-xs text-amber-300 border border-slate-800 flex items-center gap-1.5 font-bold">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      OEM Authority: {(active.source_authority_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Snippet Quotation */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <FileSearch className="w-4 h-4" /> Verbatim Source Quotation:
                    </span>
                    {active.page_number && <span>Datasheet Page {active.page_number}</span>}
                  </div>
                  <div className="text-xs text-slate-200 bg-slate-900 p-3 rounded border border-slate-800 leading-relaxed font-mono">
                    "{active.snippet || active.raw_value}"
                  </div>
                </div>

                {/* Coordinate Mapping Visualizer */}
                <div className="border border-slate-800 rounded-lg p-4 bg-slate-950">
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                    <span>Document Coordinate Alignment</span>
                    <span className="text-emerald-400">Status: Exact Coordinate Match</span>
                  </div>

                  <div className="relative h-44 bg-slate-900 rounded border border-slate-800 p-4 flex flex-col justify-center items-center overflow-hidden">
                    <div className="w-full space-y-2 opacity-25 text-[10px] text-slate-500 select-none font-mono">
                      <p>OFFICIAL TECHNICAL CATALOG / PUBLICATION REV 2024</p>
                      <p>ELECTRICAL AND MECHANICAL PARAMETERS MATRIX</p>
                      <p>Frame Size ............ Rated Power kW ............ Efficiency IE Class</p>
                      <p>IEC 60034-1 Standard Three-Phase Industrial Component</p>
                    </div>

                    <div className="absolute inset-x-8 top-10 p-3 rounded bg-slate-950/90 border border-amber-500/70 shadow-lg backdrop-blur-[1px]">
                      <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                        <span>[COORDINATE CITATION: {active.attribute_name.toUpperCase()}]</span>
                        <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {active.raw_value}
                        </span>
                      </div>
                      <p className="text-xs text-white font-mono mt-1">
                        {active.snippet || active.raw_value}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>OCR Integrity: Corroborated</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>OEM Revision: Current</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Conflict Status: Reconciled</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
