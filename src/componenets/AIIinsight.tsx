import type { InsightItem } from "../engine/types";

// ── severity config — plain interface avoids TSX generic parse errors ──
interface SeverityConfig {
  bg: string;
  border: string;
  icon: string;
  badge: string;
  badgeText: string;
}

const CONFIG: { [key: string]: SeverityConfig } = {
  critical: { bg: "#1f0a0a", border: "#7f1d1d", icon: "🚨", badge: "#7f1d1d55", badgeText: "Critical"        },
  warning:  { bg: "#1a1505", border: "#713f12", icon: "⚠️", badge: "#713f1255", badgeText: "Needs Attention"  },
  positive: { bg: "#071a10", border: "#14532d", icon: "✅", badge: "#14532d55", badgeText: "Performing Well"  },
  info:     { bg: "#0a1220", border: "#1e3a5f", icon: "💡", badge: "#1e3a5f55", badgeText: "Insight"          },
};

// ── props ─────────────────────────────────────────────────────────────
interface AIInsightProps {
  insights?: InsightItem[] | null;
  openRate?: number;
  replyRate?: number;
  conversionRate?: number;
}

// ── placeholder shown before any simulation runs ──────────────────────
function Placeholder() {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4"
      style={{ background: "#f0f7f2", border: "1.5px solid #b7e4c7" }}
    >
      <div
        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: "#d4edda", border: "1px solid #b7e4c7" }}
      >
        🤖
      </div>
      <div className="flex-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1a7a3c]">
          💡 AI Optimization Insight
        </span>
        <p className="text-[#1e3a27] text-sm leading-relaxed mt-1">
          Fill in your campaign details and click <strong>Simulate Funnel</strong> to
          receive personalized optimization insights based on WhatsApp industry benchmarks.
        </p>
      </div>
      <div className="shrink-0 flex flex-col gap-0.5 opacity-30 mt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-gray-500" />
        ))}
      </div>
    </div>
  );
}

// ── single insight card ───────────────────────────────────────────────
function InsightCard({ item }: { item: InsightItem }) {
  const c = CONFIG[item.severity] ?? CONFIG["info"];
  return (
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <span className="text-lg shrink-0 mt-0.5">{c.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-bold text-white">{item.title}</span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: c.badge, color: "#ccc" }}
          >
            {c.badgeText}
          </span>
          {/* Show numeric comparison only when both values are present */}
          {item.value !== undefined && item.benchmark !== undefined && (
            <span className="text-xs text-gray-500">
              {item.value.toFixed(1)}% vs {item.benchmark}% avg
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#c8d8cc" }}>
          {item.message}
        </p>
      </div>
    </div>
  );
}

// ── main export ───────────────────────────────────────────────────────
export default function AIInsight({
  insights,
  openRate = 60,
  replyRate = 25,
  conversionRate = 8,
}: AIInsightProps) {
  // No simulation yet — show friendly placeholder
  if (!insights) return <Placeholder />;

  // Engine returned empty array — synthesise one fallback insight
  const items: InsightItem[] =
    insights.length > 0
      ? insights
      : [
          {
            severity:
              openRate < 40 || replyRate < 20 || conversionRate < 5
                ? "warning"
                : "positive",
            title: "Campaign Analysis",
            message:
              openRate < 40
                ? `Open rate of ${openRate}% is below 40%. Personalise your greetings or improve your CTA.`
                : replyRate < 20
                ? `Reply rate of ${replyRate}% needs work. Add quick-reply buttons or a stronger CTA.`
                : conversionRate < 5
                ? `Conversion rate of ${conversionRate}% is below target. Try urgency triggers or social proof.`
                : `Great performance! All key metrics are healthy. Consider scaling your audience.`,
          },
        ];

  return (
    <div className="space-y-3">
      <h2
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#6aab82" }}
      >
        AI Optimization Insights
      </h2>
      {items.map((item, i) => (
        <InsightCard key={i} item={item} />
      ))}
    </div>
  );
}