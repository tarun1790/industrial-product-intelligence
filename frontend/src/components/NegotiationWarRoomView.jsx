import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, TrendingDown, CheckCircle2, RefreshCw, Layers, ShieldCheck, DollarSign, MessageSquare } from 'lucide-react';
import { runProcurementWarRoom } from '../services/api';

export default function NegotiationWarRoomView({ selectedProduct }) {
  const [quantity, setQuantity] = useState(10);
  const [targetMSRP, setTargetMSRP] = useState(2850.0);
  const [warRoomData, setWarRoomData] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    runAuction();
  }, [partNum, quantity, targetMSRP]);

  const runAuction = async () => {
    setLoading(true);
    try {
      const data = await runProcurementWarRoom({
        part_number: partNum,
        quantity: quantity,
        baseline_msrp: targetMSRP
      });
      setWarRoomData(data);
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
                Game-Theoretic Reverse Auction
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Multi-Agent Autonomous Supplier Procurement & B2B Negotiation War-Room
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Autonomous supplier agents negotiate price discounts, lead time guarantees, and volume lots against OEM MSRP to reach the Pareto Nash Equilibrium for zero line-stoppage risk.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Negotiated Net Savings</span>
            <span className="font-extrabold text-blue-600 font-mono">
              ${warRoomData?.total_savings_usd.toLocaleString()} USD ({((warRoomData?.bids[0]?.discount_vs_msrp_pct) || 23.1)}% Off)
            </span>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800">Procurement Quantity (Units):</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Target OEM MSRP ($/Unit):</label>
            <input
              type="number"
              step="50"
              value={targetMSRP}
              onChange={(e) => setTargetMSRP(parseFloat(e.target.value) || 2850.0)}
              className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Supplier Bids & Transcript Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Ranked Supplier Bids */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Multi-Supplier Bid Standings ({warRoomData?.bids?.length || 4} Global Vendors)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Ranked by Pareto Unit Cost & Lead Time Matrix</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              Auction Closed
            </span>
          </div>

          <div className="space-y-3">
            {warRoomData?.bids?.map((bid) => (
              <div
                key={bid.vendor_id}
                className={`p-4 rounded-xl border space-y-2 text-xs transition-all ${
                  bid.auction_rank === 1
                    ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/30'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      #{bid.auction_rank}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{bid.vendor_name}</span>
                  </div>
                  <span className="font-mono font-extrabold text-xs text-blue-700">
                    ${bid.offered_unit_price_usd.toLocaleString()} USD / unit
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-white border border-slate-200 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Lead Time:</span>
                    <strong className="text-slate-800">{bid.guaranteed_lead_time_days} Days</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Incoterms:</span>
                    <strong className="text-slate-800">{bid.incoterms}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Warranty:</span>
                    <strong className="text-blue-700">{bid.warranty_months} Mos</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Multi-Agent Debate Transcript */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Multi-Agent Negotiation Transcript
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">4 Rounds</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {warRoomData?.negotiation_transcript?.map((rnd, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-800 text-[11px] font-mono">
                      {rnd.agent_speaker.replace(/_/g, ' ')}
                    </span>
                    {rnd.price_movement_usd !== 0 && (
                      <span className="text-blue-700 font-mono font-bold text-[10px]">
                        {rnd.price_movement_usd < 0 ? `-$${Math.abs(rnd.price_movement_usd)}` : `+$${rnd.price_movement_usd}`}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed font-sans">
                    {rnd.message_content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-800 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{warRoomData?.nash_equilibrium_summary}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
