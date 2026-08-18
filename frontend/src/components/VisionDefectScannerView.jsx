import React, { useState, useEffect } from 'react';
import { Camera, Scan, AlertTriangle, CheckCircle2, ShieldCheck, Download, RefreshCw, Eye, Layers } from 'lucide-react';
import { fetchVisionDefectScan } from '../services/api';

export default function VisionDefectScannerView({ selectedProduct }) {
  const [scanReport, setScanReport] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadScan();
  }, [partNum]);

  const loadScan = async () => {
    setLoading(true);
    try {
      const data = await fetchVisionDefectScan(partNum);
      setScanReport(data);
      if (data?.defect_boxes?.length > 0) {
        setSelectedDefect(data.defect_boxes[0]);
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
                Vision-Transformer (ViT) Anomaly Detection
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Camera className="w-5 h-5 text-blue-600" />
                Multimodal Optical Defect & Machine Surface Anomaly Scanner
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Automated 4K GigE optical vision inspection scanner detecting stator varnish partial discharge, raceway micro-spalling, and shaft fretting corrosion with spatial bounding box heatmaps.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Optical Health Index</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {scanReport?.health_index_pct || 94.6}% Surface Integrity
            </span>
          </div>
        </div>
      </div>

      {/* Optical Canvas & Defect Bounding Boxes */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Optical Image Canvas with Bounding Box Overlays */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Industrial Optical Inspection Feed (4K 12-MP Camera)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Click on highlighted bounding boxes to view maintenance orders</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              {scanReport?.total_anomalies_detected} Anomalies
            </span>
          </div>

          {/* SVG Optical Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-5 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[340px]">
            <svg viewBox="0 0 500 240" className="w-full max-w-lg h-auto relative z-10">
              {/* Simulated Motor Cross Section / Bearing Photograph */}
              <rect x="50" y="30" width="400" height="180" rx="12" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <circle cx="250" cy="120" r="65" fill="#0f172a" stroke="#475569" strokeWidth="3" />
              <circle cx="250" cy="120" r="35" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

              {/* Bounding Box 1: Stator Winding Partial Discharge (Elevated) */}
              <rect x="210" y="45" width="130" height="60" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="210" y="28" width="130" height="17" fill="#ef4444" rx="2" />
              <text x="275" y="40" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                IEC 60034 PARTIAL DISCHARGE (99.2%)
              </text>

              {/* Bounding Box 2: Bearing Raceway Micro-Spalling (Minor) */}
              <rect x="70" y="140" width="100" height="55" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="70" y="125" width="100" height="15" fill="#f59e0b" rx="2" />
              <text x="120" y="136" fill="#0f172a" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                ISO 15243 SPALLING (98.7%)
              </text>

              {/* Bounding Box 3: Shaft Surface Fretting (Minor) */}
              <rect x="360" y="120" width="80" height="55" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="360" y="105" width="80" height="15" fill="#38bdf8" rx="2" />
              <text x="400" y="116" fill="#0f172a" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                SHAFT FRETTING (97.9%)
              </text>
            </svg>

            <div className="flex items-center gap-6 mt-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Elevated Action Required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Minor Cosmetic
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Defect Ledger & Work Orders */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Detected Surface Anomalies ({scanReport?.defect_boxes?.length || 3})
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">ViT Neural Scan</span>
            </div>

            <div className="space-y-2">
              {scanReport?.defect_boxes?.map((defect) => {
                const isSelected = selectedDefect?.defect_id === defect.defect_id;
                return (
                  <button
                    key={defect.defect_id}
                    onClick={() => setSelectedDefect(defect)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{defect.anomaly_type.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-xs text-blue-700">
                        {(defect.confidence_score * 100).toFixed(1)}% Conf
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      Standard: <strong className="text-slate-800">{defect.iso_standard_violation}</strong>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1 font-sans leading-relaxed">
                      {defect.recommended_remedial_action}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{scanReport?.technician_work_order_summary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
