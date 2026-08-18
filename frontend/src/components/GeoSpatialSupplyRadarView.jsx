import React, { useState, useEffect } from 'react';
import { Globe, MapPin, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, Navigation, Layers } from 'lucide-react';
import { fetchGeospatialSupplyRadar } from '../services/api';

export default function GeoSpatialSupplyRadarView({ selectedProduct }) {
  const [radarReport, setRadarReport] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadRadar();
  }, [partNum]);

  const loadRadar = async () => {
    setLoading(true);
    try {
      const data = await fetchGeospatialSupplyRadar(partNum);
      setRadarReport(data);
      if (data?.monitored_supply_nodes?.length > 0) {
        setSelectedNode(data.monitored_supply_nodes[0]);
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
                Multi-Tier Geopolitical Logistics Engine
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Globe className="w-5 h-5 text-blue-600" />
                Global Multi-Tier Geo-Spatial Supply Chain & War-Zone Disruption Radar
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Tracks multi-tier commodity origins (Chilean Copper, German Electrical Steel, Swedish Bearings) and simulates autonomous AI multi-modal freight rerouting around maritime chokepoints.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Supply Chain Fragility</span>
            <span className="font-extrabold text-blue-600 font-mono">
              {radarReport?.global_fragility_index || 16.8} / 100 (Low Fragility)
            </span>
          </div>
        </div>
      </div>

      {/* Global Map Canvas & Monitored Nodes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Geo Map Canvas */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Interactive Global Logistics Map (Tier 1, 2, 3 Nodes)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Click on geographical pins to inspect regional supply routes</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              4 Continents Monitored
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="w-full bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[340px]">
            {/* World Map Vector Outlines */}
            <svg viewBox="0 0 600 300" className="w-full max-w-xl h-auto relative z-10">
              {/* World Continents simplified shapes */}
              <path d="M 80 80 Q 150 70 160 140 Q 110 180 80 140 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> {/* North America */}
              <path d="M 130 180 Q 180 200 170 270 Q 130 250 130 180 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> {/* South America */}
              <path d="M 280 60 Q 360 50 350 120 Q 280 120 280 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> {/* Europe */}
              <path d="M 280 130 Q 360 140 340 240 Q 270 220 280 130 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> {/* Africa */}
              <path d="M 360 60 Q 520 70 480 160 Q 360 140 360 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" /> {/* Asia */}

              {/* Trade Route Lines */}
              <line x1="310" y1="80" x2="140" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" /> {/* Germany -> USA */}
              <line x1="150" y1="230" x2="140" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" /> {/* Chile -> USA */}
              <line x1="325" y1="65" x2="140" y2="120" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" /> {/* Sweden -> USA */}

              {/* Pin 1: Germany (Duisburg Steel) */}
              <circle cx="310" cy="80" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer animate-pulse" />
              <text x="310" y="70" fill="#93c5fd" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">GERMANY</text>

              {/* Pin 2: Chile (Copper) */}
              <circle cx="150" cy="230" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
              <text x="150" y="248" fill="#fcd34d" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">CHILE</text>

              {/* Pin 3: Sweden (SKF Bearings) */}
              <circle cx="325" cy="65" r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
              <text x="325" y="55" fill="#93c5fd" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">SWEDEN</text>

              {/* Pin 4: Mexico (Foundry) */}
              <circle cx="120" cy="140" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
              <text x="120" y="158" fill="#6ee7b7" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">MEXICO</text>
            </svg>

            <div className="flex items-center gap-6 mt-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Tier 2/3 European Components
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> South American Raw Copper
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> North American Assembly
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Supply Nodes & Disruption Simulation */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Monitored Sourcing Hubs ({radarReport?.monitored_supply_nodes?.length || 4})
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">100% Traceability</span>
            </div>

            <div className="space-y-2">
              {radarReport?.monitored_supply_nodes?.map((node) => {
                const isSelected = selectedNode?.node_id === node.node_id;
                return (
                  <button
                    key={node.node_id}
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 shadow-2xs ring-1 ring-blue-400/30'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-bold text-xs text-slate-900">{node.supplier_name}</span>
                      </div>
                      <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded">
                        {node.freight_mode.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-700 mt-1 font-semibold">
                      {node.raw_material_component} ({node.country_name})
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Lead Time: <strong>{node.transit_lead_time_days} Days</strong></span>
                      <span className="text-blue-700 font-bold">Risk: {node.geopolitical_risk_score}/100</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Disruption Auto-Rerouting Banner */}
            {radarReport?.active_disruptions?.map((d) => (
              <div key={d.event_id} className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-blue-600" />
                    <span>Autonomous AI Freight Reroute Active</span>
                  </div>
                  <span className="font-mono text-[10px] bg-blue-200/80 px-1.5 py-0.5 rounded text-blue-900">
                    +{d.lead_time_impact_days} Days Mitigated
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] font-sans leading-relaxed">
                  {d.ai_autonomous_reroute}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
