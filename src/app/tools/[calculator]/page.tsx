"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { Calculator, ShieldCheck, ArrowRight } from "lucide-react";

interface CalculatorProps {
  params: Promise<{ calculator: string }>;
}

export default function FinancialCalculatorPage({ params }: CalculatorProps) {
  const [annualIncome, setAnnualIncome] = useState(1200000); // 12 Lakhs
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);

  // Human Life Value (HLV) thumb rule formula
  const workingYears = Math.max(1, retireAge - age);
  const recommendedCover = annualIncome * 15; // 15x annual income standard

  return (
    <main className="min-h-screen bg-[#060911] text-slate-100 px-6 py-10 max-w-4xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          { label: "Human Life Value (HLV) Calculator" },
        ]}
      />

      <header className="py-6 border-b border-slate-800 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>Actuarial Financial Tool</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Human Life Value (HLV) Cover Calculator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Calculate the exact term life sum assured required to protect your family's future lifestyle without overpaying premiums.
        </p>
      </header>

      {/* Interactive Calculator Box */}
      <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              Annual In-Hand Income: ₹{(annualIncome / 100000).toFixed(1)} Lakhs
            </label>
            <input
              type="range"
              min="300000"
              max="10000000"
              step="100000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              Current Age: {age} Years
            </label>
            <input
              type="range"
              min="18"
              max="65"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              Planned Retirement Age: {retireAge} Years
            </label>
            <input
              type="range"
              min="45"
              max="75"
              value={retireAge}
              onChange={(e) => setRetireAge(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Output Card */}
        <div className="bg-[#080d19] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between text-center">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-2">
              Recommended Term Insurance Cover
            </span>
            <span className="text-4xl font-extrabold font-mono text-emerald-400 block">
              ₹{(recommendedCover / 10000000).toFixed(2)} Crores
            </span>
            <span className="text-xs text-slate-400 mt-2 block">
              Based on {workingYears} active earning years and standard inflation replacement.
            </span>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <span className="text-xs text-cyan-400 font-mono block">Estimated Monthly Premium: ₹750 - ₹1,100/mo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
