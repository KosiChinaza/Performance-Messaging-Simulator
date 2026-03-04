import { useState } from "react";
import type { FormData } from "../componenets/CampaignForm";
import CampaignForm from "../componenets/CampaignForm";
import FunnelChart from "../componenets/FunnelChart";
import ResultsCard from "../componenets/ResultsCard";
import AIInsight from "../componenets/AIIinsight";
import { runSimulation } from "../engine/simulator";
import type { SimulationResult } from "../engine/types";



export default function Dashboard() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simError, setSimError] = useState<string | null>(null);

  const handleSimulate = (data: FormData) => {
    try {
      setSimError(null);
      const output = runSimulation({
        campaignName:   data.campaignName,
        audienceSize:   data.audienceSize,
        openRate:       data.openRate,
        replyRate:      data.replyRate,
        conversionRate: data.conversionRate,
        productPrice:   data.productPrice,
      });
      setResult(output);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setSimError(msg);
      console.error("Simulation error:", err);
    }
  };

  const funnel = result?.funnel;
  const fin    = result?.financial;

  return (
    <div className="min-h-screen text-white font-sans" style={{ background: "#0f1410" }}>

      {/* ── Header ── */}
      <header style={{ background: "#111814", borderBottom: "1px solid #1e2d22" }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-black"
              style={{ background: "#25D366" }}
            >
              360
            </div>
            <span className="font-bold text-white text-sm tracking-tight">360Dialog</span>
            <span
              className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded"
              style={{ color: "#25D366", border: "1px solid rgba(37,211,102,0.3)" }}
            >
              META BUSINESS PARTNER
            </span>
          </div>
          <button
            className="text-xs font-bold px-4 py-2 rounded-lg text-black transition-all"
            style={{ background: "#25D366", boxShadow: "0 0 14px rgba(37,211,102,0.3)" }}
          >
            Submit Estimate
          </button>
        </div>
      </header>

      {/* ── Title strip ── */}
      <div style={{ background: "#f5f8f6", borderBottom: "1px solid #dde8e0" }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "#111" }}>
            Performance Messaging Simulator
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b7c72" }}>
            Simulate WhatsApp campaign funnels and analyze conversions before you launch.
          </p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">

        {/* Error banner — only shows if runSimulation throws */}
        {simError && (
          <div className="rounded-xl px-4 py-3 text-sm text-red-300 font-mono"
            style={{ background: "#1f0a0a", border: "1px solid #7f1d1d" }}>
            ⚠ Simulation error: {simError}
          </div>
        )}

        {/* Row 1: Form + Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Left — form */}
          <div className="rounded-2xl p-6 shadow-xl"
            style={{ background: "#132018", border: "1px solid #e2ece5" }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: "#6b7c72" }}>
              Campaign Builder Inputs
            </h2>
            <CampaignForm onSimulate={handleSimulate} />
          </div>

          {/* Right — funnel + results */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-6 shadow-xl flex-1"
              style={{ background: "#132018", border: "1px solid #1e3328" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: "#6aab82" }}>
                Funnel Simulation
              </h2>
              <FunnelChart
                audience={funnel?.audience.count   ?? 10000}
                delivered={funnel?.delivered.count ?? 0}
                opened={funnel?.opened.count       ?? 0}
                replied={funnel?.replied.count     ?? 0}
                converted={funnel?.converted.count ?? 0}
              />
            </div>

            <div className="rounded-2xl p-5 shadow-xl"
              style={{ background: "#132018", border: "1px solid #1e3328" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#6aab82" }}>
                Results
              </h2>
              <ResultsCard
                converted={funnel?.converted.count ?? 0}
                revenue={fin?.revenue              ?? 0}
                roi={fin?.roi                      ?? 0}
              />
            </div>
          </div>
        </div>

        {/* Row 2 — AI Insights */}
        <AIInsight insights={result?.insights ?? null} />

      </div>
    </div>
  );
}