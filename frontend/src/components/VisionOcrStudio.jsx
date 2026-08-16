import React, { useState, useEffect } from 'react';
import { Eye, FileCheck2, Search, CheckCircle2, Sparkles, Layers, ShieldCheck, ZoomIn, ZoomOut, RefreshCw, FileText } from 'lucide-react';
import { fetchVisionOcrData } from '../services/api';

export default function VisionOcrStudio({ selectedProduct }) {
  const [docReport, setDocReport] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadVisionData();
  }, [partNum]);

  const loadVisionData = async () => {
    setLoading(true);
    try {
      const data = await fetchVisionOcrData(partNum);
      setDocReport(data);
      if (data?.bounding_boxes?.length > 0) {
        setSelectedBox(data.bounding_boxes[0]);
      }
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
                Document Vision & LayoutLM
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Eye className="w-5 h-5 text-blue-600" />
                Multi-Modal Vision OCR & Bounding Box Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Interactive visual document segmentation. Inspect optical character recognition (OCR) bounding boxes, spatial coordinates, and tabular layout extraction directly on the OEM engineering datasheet.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">OCR Confidence</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {docReport?.average_ocr_confidence || 99.4}% Mean Precision
            </span>
          </div>
        </div>
      </div>

      {/* Main Vision Canvas & Inspection Ledger Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Visual Document Page Canvas with Simulated Bounding Box Overlay */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {docReport?.document_title || 'ABB Technical Datasheet Rev 4.2'}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Page {selectedBox?.page_number || 4} of {docReport?.page_count || 12} • Technical Spec Table</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(Math.max(80, zoomLevel - 10))}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-700 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulated Engineering Datasheet Paper Canvas */}
          <div className="relative w-full bg-slate-100 rounded-xl p-4 overflow-hidden border border-slate-200 min-h-[420px] flex items-center justify-center">
            {/* Sheet Surface */}
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="relative w-full max-w-lg bg-white rounded-lg shadow-md border border-slate-300 p-6 min-h-[400px] text-slate-800 text-xs transition-transform duration-200"
            >
              {/* Document Header Representation */}
              <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">ABB Motors & Generators</span>
                  <span className="block text-[10px] text-slate-500">Process Performance IE3 Motors Datasheet</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">DOC-ID: ABB-2024-M3BP</span>
              </div>

              {/* Specification Table Layout */}
              <div className="space-y-3 text-[11px]">
                <div className="font-bold text-slate-700 text-xs border-b border-slate-200 pb-1">
                  Table 2: 400V 50Hz Standard Ratings (Frame 160M)
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-1 font-mono">
                  <div className="text-slate-500">Output Power (Pn):</div>
                  <div className="font-bold text-slate-900">7.5 kW / 10.0 HP</div>

                  <div className="text-slate-500">Full Load Speed:</div>
                  <div className="font-bold text-slate-900">1465 RPM</div>

                  <div className="text-slate-500">Full Load Current:</div>
                  <div className="font-bold text-slate-900">14.7 A @ 400V</div>

                  <div className="text-slate-500">Efficiency Standard:</div>
                  <div className="font-bold text-slate-900">IE3 (90.4%)</div>

                  <div className="text-slate-500">DE Bearing Model:</div>
                  <div className="font-bold text-slate-900">6309 C3 Deep Groove</div>
                </div>
              </div>

              {/* Highlighted Bounding Box Overlay */}
              {selectedBox && (
                <div
                  style={{
                    top: `${selectedBox.bounding_box.top}%`,
                    left: `${selectedBox.bounding_box.left}%`,
                    width: `${selectedBox.bounding_box.width}%`,
                    height: `${selectedBox.bounding_box.height}%`
                  }}
                  className="absolute border-2 border-blue-600 bg-blue-500/15 rounded-md shadow-xs pointer-events-none transition-all duration-200 flex items-start justify-end p-0.5"
                >
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1 rounded font-mono shadow-xs">
                    {(selectedBox.ocr_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: OCR Box Ledger & Ground Truth Inspector */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Extracted Bounding Box Ledger
              </h3>
              <span className="text-xs text-blue-600 font-bold font-mono">
                {docReport?.bounding_boxes?.length || 5} Extracted Fields
              </span>
            </div>

            <div className="space-y-2">
              {docReport?.bounding_boxes?.map((box) => {
                const isSelected = selectedBox?.id === box.id;
                return (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{box.attribute_name}</span>
                      <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-100/70 px-1.5 py-0.2 rounded">
                        {(box.ocr_confidence * 100).toFixed(1)}% Conf
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 mt-1 font-mono truncate">
                      Raw OCR: <span className="text-slate-900 font-semibold">"{box.extracted_text}"</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/60 font-mono">
                      <span>Page {box.page_number}</span>
                      <span className="font-bold text-blue-700">Normalized: {box.normalized_output}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
