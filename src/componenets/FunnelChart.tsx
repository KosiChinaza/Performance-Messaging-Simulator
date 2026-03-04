import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Cell, Tooltip, LabelList,
} from "recharts";

interface FunnelChartProps {
  audience: number; delivered: number; opened: number;
  replied: number; converted: number;
}

const BAR_COLORS = ["#25D366", "#22c45e", "#1eb356", "#1aa04e", "#178f46"];

export default function FunnelChart({ audience, delivered, opened, replied, converted }: FunnelChartProps) {
  const data = [
    { stage: "Audience",  value: audience  },
    { stage: "Delivered", value: delivered },
    { stage: "Opened",    value: opened    },
    { stage: "Replied",   value: replied   },
    { stage: "Converted", value: converted },
  ];

  const max = Math.max(...data.map((d) => d.value), 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const pct = ((payload[0].value / max) * 100).toFixed(1);
    return (
      <div style={{ background:"#0d1f14", border:"1px solid rgba(37,211,102,0.35)",
        boxShadow:"0 0 14px rgba(37,211,102,0.15)", borderRadius:8, padding:"8px 12px", fontSize:13 }}>
        <p style={{ color:"#25D366", fontWeight:600, marginBottom:2 }}>{payload[0].payload.stage}</p>
        <p style={{ color:"#fff" }}>{payload[0].value.toLocaleString()}</p>
        <p style={{ color:"#94a3b8", fontSize:11 }}>{pct}% of audience</p>
      </div>
    );
  };

  return (
    <div style={{ position:"relative" }}>
      <svg width={0} height={0} style={{ position:"absolute", overflow:"hidden" }}>
        <defs>
          {BAR_COLORS.map((color, i) => (
            <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.7} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={290}>
        <BarChart data={data} layout="vertical"
          margin={{ top:2, right:64, left:8, bottom:2 }} barCategoryGap="22%">
          <XAxis type="number" hide domain={[0, max]} />
          <YAxis type="category" dataKey="stage" width={74}
            tick={{ fill:"#94a3b8", fontSize:12, fontWeight:600 }}
            axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(37,211,102,0.04)" }} />
          <Bar dataKey="value" radius={[4, 8, 8, 4]} isAnimationActive>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#barGrad${i})`}
                style={{ filter:`drop-shadow(0 0 6px ${BAR_COLORS[i]}66)` }} />
            ))}
            <LabelList dataKey="value" position="right"
              formatter={(v: any) => typeof v === "number" ? v.toLocaleString() : String(v)}
              style={{ fill:"#cbd5e1", fontSize:11, fontWeight:600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}