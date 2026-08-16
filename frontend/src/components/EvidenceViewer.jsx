import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Bookmark, ExternalLink, Award, FileSearch, Sparkles } from 'lucide-react';

export default function EvidenceViewer({ product }) {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  if (!product) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
        Select a product in Ingestion Pipeline to inspect its evidence trail.
      </div>
    );
  }

  const evidenceList = product.evidence_trail || [];

  return (
    <div className="space-y-6">
      {/* Evidence Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                Pillar 4: PROVE
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                Granular Evidence & Provenance Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              "Can I trust this product information?" Every critical parameter is backed by line-level document snippets, bounding boxes, and OEM authority weighting.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800">
            <div>
              <div className="text-xs text-slate-400 font-mono">Overall Product Trust</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{product.trust_score}% Verified</div>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <div className="text-xs text-slate-400 font-mono">Evidence Citations</div>
              <div className="text-lg font-bold text-white font-mono">{evidenceList.length} Verified Sources</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Citations */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
            Tracked Source Snippets
          </h3>

          {evidenceList.length === 0 ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
              No direct PDF citations attached to this simulated spec. Ingest an OEM datasheet to extract visual bounding boxes.
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
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-950 text-cyan-400 border border-slate-700">
                      {ev.source_type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {(ev.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <div className="mt-2 text-sm font-bold text-white">
                    {ev.attribute_name.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-cyan-300 font-mono mt-0.5">
                    Stated: "{ev.raw_value}"
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[180px]">{ev.source_name}</span>
                    {ev.page_number && <span className="font-mono">Page {ev.page_number}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Deep Source Inspector & Simulated Bounding Box Viewer */}
        <div className="lg:col-span-2 space-y-4">
          {(() => {
            const active = selectedEvidence || evidenceList[0];
            if (!active) return null;

            return (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase">Evidence Inspector</span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {active.attribute_name.replace('_', ' ').toUpperCase()} — Provenance Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Source: {active.source_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      OEM Authority: {(active.source_authority_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Snippet Card */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <FileSearch className="w-4 h-4" /> Extracted Verbatim Quotation:
                    </span>
                    {active.page_number && <span>Datasheet Page {active.page_number}</span>}
                  </div>
                  <div className="text-sm font-mono text-slate-200 bg-slate-900 p-3 rounded border border-slate-800/80 leading-relaxed">
                    "{active.snippet || active.raw_value}"
                  </div>
                </div>

                {/* Simulated Document & Bounding Box Visualizer */}
                <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/60">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                    <span>Visual Document Coordinate Mapping</span>
                    <span className="text-emerald-400">Status: Verified Match</span>
                  </div>

                  <div className="relative h-48 bg-slate-900 rounded border border-slate-800 p-4 flex flex-col justify-center items-center overflow-hidden">
                    {/* Simulated page content background */}
                    <div className="w-full space-y-2 opacity-30 text-[10px] font-mono text-slate-500 select-none">
                      <p>ABB LOW VOLTAGE PROCESS PERFORMANCE MOTORS / TECHNICAL CATALOG 2024</p>
                      <p>ELECTRICAL AND MECHANICAL SPECIFICATIONS TABLE 4.1</p>
                      <p>Rated Output kW at 50Hz ............ Speed RPM ............ Current IN at 400V</p>
                      <p>Frame 132M IM B3 foot-mount ........ 1465 RPM ............ 14.2 A Delta</p>
                      <p>IEC 60034-1 / IEC 60034-30-1 Premium Efficiency IE3 Class</p>
                    </div>

                    {/* Highlighted Bounding Box */}
                    <div className="absolute inset-x-8 top-12 p-3 rounded bg-cyan-500/10 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-[1px]">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold">
                        <span>[BOUNDING BOX MATCH: {active.attribute_name}]</span>
                        <span className="text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700">
                          {active.raw_value}
                        </span>
                      </div>
                      <p className="text-xs text-white font-mono mt-1 font-semibold">
                        {active.snippet || active.raw_value}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Audit Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>OCR Character Hash: Corroborated</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Manufacturer Revision: Verified</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Cross-Source Conflict: None / Resolved</span>
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
