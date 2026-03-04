import type {
  CampaignInput,
  FunnelBreakdown,
  FunnelStage,
  FinancialMetrics,
  SimulationResult,
} from "./types";
import { buildBenchmarks } from "./benchmarks";
import { generateInsights } from "./insights";
import { buildScenarios } from "./scenarios";

const DEFAULTS = { campaignCost: 500, deliveryRate: 95 } as const;

function pct(rate: number): number {
  return Math.max(0, Math.min(100, rate)) / 100;
}

function buildStage(label: string, count: number, prev: number, audience: number): FunnelStage {
  const dropOff = Math.max(0, prev - count);
  return {
    label,
    count,
    rate:        audience > 0 ? (count / audience) * 100 : 0,
    dropOff,
    dropOffRate: prev > 0 ? (dropOff / prev) * 100 : 0,
  };
}

function calculateFunnel(input: Required<CampaignInput>): FunnelBreakdown {
  const audience  = Math.round(input.audienceSize);
  const delivered = Math.round(audience  * pct(input.deliveryRate));
  const opened    = Math.round(delivered * pct(input.openRate));
  const replied   = Math.round(opened    * pct(input.replyRate));
  const converted = Math.round(replied   * pct(input.conversionRate));
  return {
    audience:  buildStage("Audience",  audience,  audience,  audience),
    delivered: buildStage("Delivered", delivered, audience,  audience),
    opened:    buildStage("Opened",    opened,    delivered, audience),
    replied:   buildStage("Replied",   replied,   opened,    audience),
    converted: buildStage("Converted", converted, replied,   audience),
  };
}

function calculateFinancials(converted: number, audienceSize: number, productPrice: number, campaignCost: number): FinancialMetrics {
  const revenue     = converted * productPrice;
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

export function runSimulation(rawInput: CampaignInput): SimulationResult {
  const input: Required<CampaignInput> = {
    campaignCost: DEFAULTS.campaignCost,
    deliveryRate: DEFAULTS.deliveryRate,
    ...rawInput,
  };

  const funnel     = calculateFunnel(input);
  const financial  = calculateFinancials(
    funnel.converted.count,
    input.audienceSize,
    input.productPrice,
    input.campaignCost
  );
  const benchmarks = buildBenchmarks(
    input.openRate, input.replyRate, input.conversionRate,
    financial.roi, input.deliveryRate
  );
  const insights   = generateInsights(
    input.openRate, input.replyRate, input.conversionRate,
    input.deliveryRate, funnel, financial
  );
  // buildScenarios no longer takes runSimulation — no more recursion
  const scenarios  = buildScenarios(input);

  return { input, funnel, financial, benchmarks, insights, scenarios, simulatedAt: new Date().toISOString() };
}