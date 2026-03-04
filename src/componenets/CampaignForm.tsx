import { useState } from "react";
import type { FormEvent } from "react";

export interface FormData {
  campaignName: string;
  audienceSize: number;
  openRate: number;
  replyRate: number;
  conversionRate: number;
  productPrice: number;
}

interface CampaignFormProps {
  onSimulate: (data: FormData) => void;
}

interface FormErrors {
  [key: string]: string;
}

const inputClass =
  "w-full bg-[#0f1a14] border border-[#1e3328] rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all";

const labelClass =
  "block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5";

export default function CampaignForm({ onSimulate }: CampaignFormProps) {
  const [form, setForm] = useState<FormData>({
    campaignName: "",
    audienceSize: 10000,
    openRate: 60,
    replyRate: 25,
    conversionRate: 8,
    productPrice: 70,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.audienceSize || form.audienceSize <= 0)
      newErrors.audienceSize = "Must be > 0";
    if (form.openRate < 0 || form.openRate > 100)
      newErrors.openRate = "Enter a value between 0 and 100";
    if (form.replyRate < 0 || form.replyRate > 100)
      newErrors.replyRate = "Enter a value between 0 and 100";
    if (form.conversionRate < 0 || form.conversionRate > 100)
      newErrors.conversionRate = "Enter a value between 0 and 100";
    if (form.productPrice <= 0)
      newErrors.productPrice = "Must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validate();
    if (valid) {
      onSimulate(form);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "campaignName" ? value : Number(value),
    }));
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Campaign Name */}
      <div>
        <label className={labelClass}>Campaign Name</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Spring Sale Promo"
          value={form.campaignName}
          onChange={(e) => handleChange("campaignName", e.target.value)}
        />
        {errors.campaignName && (
          <p className="text-red-400 text-xs mt-1">{errors.campaignName}</p>
        )}
      </div>

      {/* Audience Size */}
      <div>
        <label className={labelClass}>Target Audience Size</label>
        <input
          type="number"
          className={inputClass}
          value={form.audienceSize}
          onChange={(e) => handleChange("audienceSize", e.target.value)}
          min={1}
        />
        {errors.audienceSize && (
          <p className="text-red-400 text-xs mt-1">{errors.audienceSize}</p>
        )}
      </div>

      {/* Open Rate + Reply Rate */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Open Rate %</label>
          <input
            type="number"
            className={inputClass}
            value={form.openRate}
            onChange={(e) => handleChange("openRate", e.target.value)}
            min={0}
            max={100}
          />
          {errors.openRate && (
            <p className="text-red-400 text-xs mt-1">{errors.openRate}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Reply Rate %</label>
          <input
            type="number"
            className={inputClass}
            value={form.replyRate}
            onChange={(e) => handleChange("replyRate", e.target.value)}
            min={0}
            max={100}
          />
          {errors.replyRate && (
            <p className="text-red-400 text-xs mt-1">{errors.replyRate}</p>
          )}
        </div>
      </div>

      {/* Conversion Rate + Product Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Conversion Rate %</label>
          <input
            type="number"
            className={inputClass}
            value={form.conversionRate}
            onChange={(e) => handleChange("conversionRate", e.target.value)}
            min={0}
            max={100}
          />
          {errors.conversionRate && (
            <p className="text-red-400 text-xs mt-1">{errors.conversionRate}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Product Price ($)</label>
          <input
            type="number"
            className={inputClass}
            value={form.productPrice}
            onChange={(e) => handleChange("productPrice", e.target.value)}
            min={0.01}
            step={0.01}
          />
          {errors.productPrice && (
            <p className="text-red-400 text-xs mt-1">{errors.productPrice}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-center pt-1">
        <button
          type="submit"
          className="px-10 py-3 rounded-2xl font-bold text-sm tracking-wide text-black transition-all duration-200 active:scale-95"
          style={{
            background: "#25D366",
            boxShadow: "0 0 20px rgba(37,211,102,0.45), 0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1fba58";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 32px rgba(37,211,102,0.7), 0 6px 20px rgba(0,0,0,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#25D366";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 20px rgba(37,211,102,0.45), 0 4px 12px rgba(0,0,0,0.3)";
          }}
        >
          Simulate Funnel
        </button>
      </div>
    </form>
  );
}