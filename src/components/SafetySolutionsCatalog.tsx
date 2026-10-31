import React from 'react';
import { SAFETY_SOLUTIONS_CATALOG } from '../data/mockData';
import { SafetyCategory } from '../types';
import { 
  ShieldCheck, HardHat, AlertTriangle, Wind, 
  Activity, Radar, CheckCircle2, Plus, Sparkles 
} from 'lucide-react';

interface SafetySolutionsCatalogProps {
  onOpenNewDealWithCategory: (category: SafetyCategory) => void;
}

export const SafetySolutionsCatalog: React.FC<SafetySolutionsCatalogProps> = ({
  onOpenNewDealWithCategory,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 rounded-2xl border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-600 text-white uppercase tracking-wider">
              Safety Hardware & Systems Catalog
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Certified for Deep Underground & Open-Pit Mining
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Industrial Mine Safety Equipment & Solutions
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Pre-engineered life-critical safety systems ready for commercial quoting and tender insertion.
          </p>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAFETY_SOLUTIONS_CATALOG.map(solution => (
          <div
            key={solution.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Category pill & icon */}
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                  {solution.category}
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {solution.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {solution.description}
                </p>
              </div>

              {/* Price & Compliance */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Typical Contract:</span>
                  <span className="font-extrabold text-emerald-600">{solution.priceRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Compliance:</span>
                  <span className="font-bold text-slate-800">{solution.compliance}</span>
                </div>
              </div>

              {/* Bullet Specs */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Safety Specifications:
                </span>
                {solution.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <button
              onClick={() => onOpenNewDealWithCategory(solution.category as SafetyCategory)}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Quote Deal for {solution.title.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
