import type { BenchmarkItem, BenchmarkStatus } from "./types";

export const INDUSTRY_BENCHMARKS = {
  deliveryRate:    95,
  openRate:        58,
  replyRate:       20,
  conversionRate:   5,
  roi:            400,
} as const;

function classify(userValue: number, avg: number, tolerance = 2): BenchmarkStatus {
  if (userValue >= avg + tolerance) return "above";
  if (userValue <= avg - tolerance) return "below";
  return "at";
}

export function buildBenchmarks(
  openRate: number,
  replyRate: number,
  conversionRate: number,
  roi: number,
  deliveryRate: number
): BenchmarkItem[] {
  return [
    {
      metric: "Open Rate",
      userValue: openRate,
      industryAvg: INDUSTRY_BENCHMARKS.openRate,
      unit: "%",
      status: classify(openRate, INDUSTRY_BENCHMARKS.openRate),
      delta: openRate - INDUSTRY_BENCHMARKS.openRate,
    },
    {
      metric: "Reply Rate",
      userValue: replyRate,
      industryAvg: INDUSTRY_BENCHMARKS.replyRate,
      unit: "%",
      status: classify(replyRate, INDUSTRY_BENCHMARKS.replyRate),
      delta: replyRate - INDUSTRY_BENCHMARKS.replyRate,
    },
    {
      metric: "Conversion Rate",
      userValue: conversionRate,
      industryAvg: INDUSTRY_BENCHMARKS.conversionRate,
      unit: "%",
      status: classify(conversionRate, INDUSTRY_BENCHMARKS.conversionRate, 0.5),
      delta: conversionRate - INDUSTRY_BENCHMARKS.conversionRate,
    },
    {
      metric: "ROI",
      userValue: roi,
      industryAvg: INDUSTRY_BENCHMARKS.roi,
      unit: "%",
      status: classify(roi, INDUSTRY_BENCHMARKS.roi, 20),
      delta: roi - INDUSTRY_BENCHMARKS.roi,
    },
    {
      metric: "Delivery Rate",
      userValue: deliveryRate,
      industryAvg: INDUSTRY_BENCHMARKS.deliveryRate,
      unit: "%",
      status: classify(deliveryRate, INDUSTRY_BENCHMARKS.deliveryRate),
      delta: deliveryRate - INDUSTRY_BENCHMARKS.deliveryRate,
    },
  ];
}