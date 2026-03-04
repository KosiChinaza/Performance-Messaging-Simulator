interface ResultsCardProps { converted: number; revenue: number; roi: number; }

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);

export default function ResultsCard({ converted, revenue, roi }: ResultsCardProps) {
  const stats = [
    { label:"Converted Leads",    value: converted.toLocaleString(), icon:"👥", accent: converted > 0 },
    { label:"Projected Revenue",  value: fmt(revenue),               icon:"💰", accent: revenue > 0   },
    { label:"ROI",                value: `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`, icon:"📈", accent: roi > 0 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label}
          className="bg-[#0e1a12] border border-[#1c2f20] rounded-xl p-3 shadow-md flex flex-col gap-1"
          style={{ boxShadow: s.accent ? "0 0 14px rgba(37,211,102,0.07)" : undefined }}>
          <span className="text-lg">{s.icon}</span>
          <p className="text-gray-400 text-xs font-medium leading-tight">{s.label}</p>
          <p className={`text-lg font-bold tracking-tight ${s.accent ? "text-[#25D366]" : "text-gray-300"}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}