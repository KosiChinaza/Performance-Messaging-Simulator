import type { CampaignInput, Scenario, FunnelBreakdown, FunnelStage, FinancialMetrics } from "./types";

// ── inline mini-simulator (no scenarios, no insights, no recursion) ──
function pct(r: number): number {
  return Math.max(0, Math.min(100, r)) / 100;
}

function makeStage(label: string, count: number, prev: number, audience: number): FunnelStage {
  const dropOff = Math.max(0, prev - count);
  return {
    label,
    count,
    rate:        audience > 0 ? (count / audience) * 100 : 0,
    dropOff,
    dropOffRate: prev > 0 ? (dropOff / prev) * 100 : 0,
  };
}

function calcFunnel(input: Required<CampaignInput>): FunnelBreakdown {
  const audience  = Math.round(input.audienceSize);
  const delivered = Math.round(audience  * pct(input.deliveryRate));
  const opened    = Math.round(delivered * pct(input.openRate));
  const replied   = Math.round(opened    * pct(input.replyRate));
  const converted = Math.round(replied   * pct(input.conversionRate));
  return {
    audience:  makeStage("Audience",  audience,  audience,  audience),
    delivered: makeStage("Delivered", delivered, audience,  audience),
    opened:    makeStage("Opened",    opened,    delivered, audience),
    replied:   makeStage("Replied",   replied,   opened,    audience),
    converted: makeStage("Converted", converted, replied,   audience),
  };
}

function calcFinancials(converted: number, audienceSize: number, productPrice: number, campaignCost: number): FinancialMetrics {
  const revenue   = converted * productPrice;
  const grossProfit = revenue - campaignCost;
  return {
    revenue,
    grossProfit,
    roi:                  campaignCost > 0 ? (grossProfit / campaignCost) * 100 : 0,
    costPerLead:          converted > 0 ? campaignCost / converted : 0,
    revenuePerMessage:    audienceSize > 0 ? revenue / audienceSize : 0,
    breakEvenConversions: productPrice > 0 ? Math.ceil(campaignCost / productPrice) : 0,
  };
}

const DEFAULTS = { campaignCost: 500, deliveryRate: 95 } as const;

// ── exported builder — no recursion ──────────────────────────
export function buildScenarios(base: Required<CampaignInput>): Scenario[] {
  const scenarioDefs: Array<{ id: string; label: string; description: string; overrides: Partial<CampaignInput> }> = [
    {
      id: "optimistic",
      label: "Optimistic",
      description: "+10pp open rate, +5pp reply rate",
      overrides: {
        openRate:  Math.min(100, base.openRate + 10),
        replyRate: Math.min(100, base.replyRate + 5),
      },
    },
    {
      id: "pessimistic",
      label: "Pessimistic",
      description: "−15pp open rate, −5pp reply rate",
      overrides: {
        openRate:  Math.max(0, base.openRate - 15),
        replyRate: Math.max(0, base.replyRate - 5),
      },
    },
    {
      id: "scale2x",
      label: "2× Audience",
      description: "Double the audience size",
      overrides: { audienceSize: base.audienceSize * 2 },
    },
    {
      id: "highCR",
      label: "Optimised CTA",
      description: "Conversion rate at top-quartile (12%)",
      overrides: { conversionRate: Math.max(base.conversionRate, 12) },
    },
  ];

  return scenarioDefs.map((s) => {
    const input: Required<CampaignInput> = { ...DEFAULTS, ...base, ...s.overrides };
    const funnel    = calcFunnel(input);
    const financial = calcFinancials(funnel.converted.count, input.audienceSize, input.productPrice, input.campaignCost);
    return {
      ...s,
      result: {
        input,
        funnel,
        financial,
        benchmarks: [],   // not needed for scenario cards
        insights:   [],   // not needed for scenario cards
        scenarios:  [],   // no recursion
        simulatedAt: new Date().toISOString(),
      },
    };
  });
}