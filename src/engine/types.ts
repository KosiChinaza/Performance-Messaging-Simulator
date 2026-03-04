// ─────────────────────────────────────────────
// INPUTS
// ─────────────────────────────────────────────
export interface CampaignInput {
  campaignName: string;
  audienceSize: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
  productPrice: number;
  campaignCost?: number;
  deliveryRate?: number;
}

// ─────────────────────────────────────────────
// FUNNEL
// ─────────────────────────────────────────────
export interface FunnelStage {
  label: string;
  count: number;
  rate: number;
  dropOff: number;
  dropOffRate: number;
}

export interface FunnelBreakdown {
  audience: FunnelStage;
  delivered: FunnelStage;
  opened: FunnelStage;
  replied: FunnelStage;
  converted: FunnelStage;
}

// ─────────────────────────────────────────────
// FINANCIAL
// ─────────────────────────────────────────────
export interface FinancialMetrics {
  revenue: number;
  grossProfit: number;
  roi: number;
  costPerLead: number;
  revenuePerMessage: number;
  breakEvenConversions: number;
}

// ─────────────────────────────────────────────
// BENCHMARKS
// ─────────────────────────────────────────────
export type BenchmarkStatus = "above" | "at" | "below";

export interface BenchmarkItem {
  metric: string;
  userValue: number;
  industryAvg: number;
  unit: string;
  status: BenchmarkStatus;
  delta: number;
}

// ─────────────────────────────────────────────
// SCENARIOS
// ─────────────────────────────────────────────
export interface Scenario {
  id: string;
  label: string;
  description: string;
  overrides: Partial<CampaignInput>;
  result?: SimulationResult;
}

// ─────────────────────────────────────────────
// INSIGHTS
// ─────────────────────────────────────────────
export type InsightSeverity = "critical" | "warning" | "positive" | "info";

export interface InsightItem {
  severity: InsightSeverity;
  title: string;
  message: string;
  metric?: string;
  value?: number;
  benchmark?: number;
  unit?: string;
}

// ─────────────────────────────────────────────
// FULL RESULT
// ─────────────────────────────────────────────
export interface SimulationResult {
  input: Required<CampaignInput>;
  funnel: FunnelBreakdown;
  financial: FinancialMetrics;
  benchmarks: BenchmarkItem[];
  insights: InsightItem[];
  scenarios: Scenario[];
  simulatedAt: string;
}