import type { InsightItem, FunnelBreakdown, FinancialMetrics } from "./types";
import { INDUSTRY_BENCHMARKS } from "./benchmarks";

export function generateInsights(
  openRate: number,
  replyRate: number,
  conversionRate: number,
  deliveryRate: number,
  funnel: FunnelBreakdown,
  financial: FinancialMetrics
): InsightItem[] {
  const insights: InsightItem[] = [];

  // ── DELIVERY ──────────────────────────────────────────
  if (deliveryRate < 85) {
    insights.push({
      severity: "critical",
      title: "Low Delivery Rate",
      message: `Only ${deliveryRate}% of messages were delivered. This often indicates invalid numbers, opt-outs, or carrier filtering. Clean your contact list and verify number formats before launch.`,
      metric: "Delivery Rate",
      value: deliveryRate,
      benchmark: INDUSTRY_BENCHMARKS.deliveryRate,
    });
  } else if (deliveryRate < INDUSTRY_BENCHMARKS.deliveryRate) {
    insights.push({
      severity: "warning",
      title: "Delivery Rate Below Average",
      message: `Your delivery rate of ${deliveryRate}% is below the industry average of ${INDUSTRY_BENCHMARKS.deliveryRate}%. Consider refreshing your contact list.`,
      metric: "Delivery Rate",
      value: deliveryRate,
      benchmark: INDUSTRY_BENCHMARKS.deliveryRate,
    });
  }

  // ── OPEN RATE ──────────────────────────────────────────
  if (openRate < 30) {
    insights.push({
      severity: "critical",
      title: "Critical: Open Rate Under 30%",
      message: "Open rate is critically low. Your message preview text and sender name are the first things users see — consider A/B testing the first 60 characters of your message and validating your sender profile.",
      metric: "Open Rate",
      value: openRate,
      benchmark: INDUSTRY_BENCHMARKS.openRate,
    });
  } else if (openRate < INDUSTRY_BENCHMARKS.openRate) {
    insights.push({
      severity: "warning",
      title: "Open Rate Below Industry Average",
      message: `At ${openRate}%, your open rate is ${INDUSTRY_BENCHMARKS.openRate - openRate}pp below the WhatsApp industry average. Try personalizing the greeting with the recipient's name and optimising send time (Tue–Thu, 10am–12pm performs best).`,
      metric: "Open Rate",
      value: openRate,
      benchmark: INDUSTRY_BENCHMARKS.openRate,
    });
  } else {
    insights.push({
      severity: "positive",
      title: "Strong Open Rate",
      message: `Your open rate of ${openRate}% beats the industry average of ${INDUSTRY_BENCHMARKS.openRate}%. Your message preview and targeting are working.`,
      metric: "Open Rate",
      value: openRate,
      benchmark: INDUSTRY_BENCHMARKS.openRate,
    });
  }

  // ── REPLY RATE ──────────────────────────────────────────
  if (replyRate < 10) {
    insights.push({
      severity: "critical",
      title: "Critical: Reply Rate Under 10%",
      message: "Barely 1 in 10 openers are responding. Your CTA is likely too vague or asks too much. Use quick-reply buttons (yes/no, option A/B) to reduce friction — these alone can 2–3× reply rates.",
      metric: "Reply Rate",
      value: replyRate,
      benchmark: INDUSTRY_BENCHMARKS.replyRate,
    });
  } else if (replyRate < INDUSTRY_BENCHMARKS.replyRate) {
    insights.push({
      severity: "warning",
      title: "Reply Rate Needs Improvement",
      message: `${replyRate}% reply rate is below the ${INDUSTRY_BENCHMARKS.replyRate}% average. Add urgency ("Offer ends in 24h"), a single clear CTA, and make replying effortless with quick-reply buttons.`,
      metric: "Reply Rate",
      value: replyRate,
      benchmark: INDUSTRY_BENCHMARKS.replyRate,
    });
  }

  // ── CONVERSION RATE ──────────────────────────────────────────
  if (conversionRate < 2) {
    insights.push({
      severity: "critical",
      title: "Critical: Conversion Rate Under 2%",
      message: "Your offer or landing experience is the bottleneck. Ensure the reply-to-purchase journey has fewer than 3 steps, and test a direct checkout link in the message body.",
      metric: "Conversion Rate",
      value: conversionRate,
      benchmark: INDUSTRY_BENCHMARKS.conversionRate,
    });
  } else if (conversionRate < INDUSTRY_BENCHMARKS.conversionRate) {
    insights.push({
      severity: "warning",
      title: "Conversion Rate Below Average",
      message: `At ${conversionRate}%, you're below the industry's ${INDUSTRY_BENCHMARKS.conversionRate}%. Add social proof (e.g. "Join 12,000 customers"), a limited-time discount, or a money-back guarantee to lower purchase hesitation.`,
      metric: "Conversion Rate",
      value: conversionRate,
      benchmark: INDUSTRY_BENCHMARKS.conversionRate,
    });
  } else {
    insights.push({
      severity: "positive",
      title: "Above-Average Conversion Rate",
      message: `${conversionRate}% conversion rate is above the industry average of ${INDUSTRY_BENCHMARKS.conversionRate}%. Your offer-to-audience fit is strong. Consider increasing audience size to scale revenue.`,
      metric: "Conversion Rate",
      value: conversionRate,
      benchmark: INDUSTRY_BENCHMARKS.conversionRate,
    });
  }

  // ── FUNNEL DROP-OFF DIAGNOSIS ──────────────────────────────────────────
  const openDropOff = funnel.opened.dropOffRate;
  const replyDropOff = funnel.replied.dropOffRate;
  const convDropOff = funnel.converted.dropOffRate;

  const worstStage = [
    { stage: "Delivered→Opened",  dropOff: openDropOff  },
    { stage: "Opened→Replied",    dropOff: replyDropOff },
    { stage: "Replied→Converted", dropOff: convDropOff  },
  ].sort((a, b) => b.dropOff - a.dropOff)[0];

  if (worstStage.dropOff > 80) {
    insights.push({
      severity: "info",
      title: `Biggest Drop-off: ${worstStage.stage}`,
      message: `${worstStage.dropOff.toFixed(1)}% of users are lost at the ${worstStage.stage} stage. This is your highest-leverage optimization point — fixing this single stage will have the biggest impact on revenue.`,
    });
  }

  // ── FINANCIAL ──────────────────────────────────────────
  if (financial.roi < 0) {
    insights.push({
      severity: "critical",
      title: "Campaign Is Unprofitable",
      message: `Projected ROI is ${financial.roi.toFixed(1)}%. You need at least ${financial.breakEvenConversions} conversions to break even — currently projecting ${funnel.converted.count}. Increase conversion rate or reduce campaign cost.`,
      metric: "ROI",
      value: financial.roi,
    });
  } else if (financial.roi < INDUSTRY_BENCHMARKS.roi) {
    insights.push({
      severity: "warning",
      title: "ROI Below Industry Benchmark",
      message: `Your projected ${financial.roi.toFixed(0)}% ROI is below the WhatsApp campaign average of ${INDUSTRY_BENCHMARKS.roi}%. There's room to improve — focus on the lowest-performing funnel stage.`,
      metric: "ROI",
      value: financial.roi,
      benchmark: INDUSTRY_BENCHMARKS.roi,
    });
  } else {
    insights.push({
      severity: "positive",
      title: "Strong ROI Projected",
      message: `${financial.roi.toFixed(0)}% ROI beats the industry average of ${INDUSTRY_BENCHMARKS.roi}%. Every $1 spent returns $${((financial.roi + 100) / 100).toFixed(2)}. Consider scaling audience to compound returns.`,
      metric: "ROI",
      value: financial.roi,
      benchmark: INDUSTRY_BENCHMARKS.roi,
    });
  }

  // Sort: critical first, then warning, then positive, then info
  const order: Record<string, number> = { critical: 0, warning: 1, positive: 2, info: 3 };
  return insights.sort((a, b) => order[a.severity] - order[b.severity]);
}