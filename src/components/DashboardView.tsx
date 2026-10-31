import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext';
import { STAGES } from '../data/mockData';
import { Deal, SafetyCategory } from '../types';
import { 
  TrendingUp, Award, DollarSign, ShieldAlert, 
  ArrowUpRight, Users, CheckCircle2, ChevronRight,
  Flame, HardHat, AlertCircle, Sparkles, Building
} from 'lucide-react';

interface DashboardViewProps {
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDeal: () => void;
  filterByMyDeals: boolean;
  onNavigateToTab: (tab: 'kanban' | 'table' | 'leaderboard' | 'solutions') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectDeal,
  onOpenNewDeal,
  filterByMyDeals,
  onNavigateToTab
}) => {
  const { currentUser, allUsers } = useAuth();
  const { deals } = useDeals();

  const displayedDeals = filterByMyDeals
    ? deals.filter(d => d.assignedRepId === currentUser.id)
    : deals;

  // Metrics
  const totalPipelineValue = displayedDeals.reduce((sum, d) => sum + d.value, 0);
  const wonDeals = displayedDeals.filter(d => d.stage === 'closed_won');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const activeDeals = displayedDeals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const activeValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const avgDealSize = displayedDeals.length > 0 ? Math.round(totalPipelineValue / displayedDeals.length) : 0;
  
  // Current user quota
  const myWonDeals = deals.filter(d => d.assignedRepId === currentUser.id && d.stage === 'closed_won');
  const myWonRevenue = myWonDeals.reduce((sum, d) => sum + d.value, 0);
  const myQuotaPct = Math.round((myWonRevenue / currentUser.salesQuota) * 100);
  const myCommission = myWonRevenue * currentUser.commissionRate;

  // Safety category distribution
  const categoryTotals: Record<string, { count: number; value: number }> = {};
  displayedDeals.forEach(deal => {
    if (!categoryTotals[deal.category]) {
      categoryTotals[deal.category] = { count: 0, value: 0 };
    }
    categoryTotals[deal.category].count += 1;
    categoryTotals[deal.category].value += deal.value;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 5);

  // High priority alerts
  const criticalDeals = displayedDeals.filter(d => d.priority === 'Critical Safety Priority');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Scope Notice */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-white p-5 rounded-2xl border border-orange-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-600 text-white uppercase tracking-wider">
              {filterByMyDeals ? 'Personal Sales Workspace' : 'Enterprise Mining Operations Overview'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Active Rep: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.territory})
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {filterByMyDeals ? `${currentUser.name}'s Sales Pipeline` : 'Global Mining Safety Sales & Compliance Pipeline'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Tracking atmospheric monitors, underground blast pods, geotechnical slope radar, and MSHA/OSHA contracts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab('leaderboard')}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <Award className="w-4 h-4 text-orange-600" />
            <span>Rep Leaderboard</span>
          </button>
          <button
            onClick={onOpenNewDeal}
            className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Log New Sale</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Closed Won Revenue */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Closed Won Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ${(wonRevenue).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-600 font-bold flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {wonDeals.length} Contracts Executed
            </span>
            <span>Avg ${(avgDealSize / 1000).toFixed(0)}k/deal</span>
          </div>
        </div>

        {/* Card 2: Active Pipeline Value */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Pipeline Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ${(activeValue).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="text-blue-600 font-bold">
              {activeDeals.length} In-Flight Opportunities
            </span>
            <span className="text-slate-400">Total: ${(totalPipelineValue / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Card 3: Current Rep Quota Attainment */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-orange-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {currentUser.name.split(' ')[0]}'s Quota Target
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-orange-600">{myQuotaPct}%</span>
            <span className="text-xs font-semibold text-slate-500">
              (${(myWonRevenue / 1000000).toFixed(2)}M / ${(currentUser.salesQuota / 1000000).toFixed(2)}M)
            </span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, myQuotaPct)}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Commission Earned:</span>
            <strong className="text-slate-800">${Math.round(myCommission).toLocaleString()}</strong>
          </div>
        </div>

        {/* Card 4: Critical Safety Urgency */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Critical Safety Deals
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {criticalDeals.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span className="text-rose-600 font-bold flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1" />
              Immediate Mine Risk
            </span>
            <span>${(criticalDeals.reduce((s, d) => s + d.value, 0) / 1000000).toFixed(2)}M value</span>
          </div>
        </div>

      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Stage Funnel (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Safety Sales Pipeline by Stage
              </h3>
              <p className="text-xs text-slate-500">
                Progression from initial mine site hazard inspection to active deployment
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('kanban')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View Kanban Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {STAGES.filter(s => s.id !== 'closed_lost').map(stage => {
              const stageDeals = displayedDeals.filter(d => d.stage === stage.id);
              const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);
              const maxStageVal = Math.max(...STAGES.map(st => displayedDeals.filter(d => d.stage === st.id).reduce((s, d) => s + d.value, 0)), 1);
              const barWidthPct = Math.max(8, Math.round((stageSum / maxStageVal) * 100));

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">
                        {stageDeals.length} deal{stageDeals.length === 1 ? '' : 's'}
                      </span>
                      <span className="font-extrabold text-slate-900 min-w-[70px] text-right">
                        ${(stageSum).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage.id === 'closed_won' ? 'bg-emerald-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${stageSum > 0 ? barWidthPct : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Category Breakdown (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Top Safety Solutions
              </h3>
              <p className="text-xs text-slate-500">
                Revenue by product category
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('solutions')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Catalog
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {sortedCategories.map(([catName, data]) => {
              const pctOfTotal = totalPipelineValue > 0 ? Math.round((data.value / totalPipelineValue) * 100) : 0;
              return (
                <div key={catName} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2" title={catName}>
                      {catName}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">
                      ${(data.value / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{data.count} deals</span>
                    <span className="text-orange-600 font-semibold">{pctOfTotal}% of pipeline</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent High-Value Mining Safety Deals */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              High-Impact Mining Opportunities & Safety Audits
            </h3>
            <p className="text-xs text-slate-500">
              Click any contract to open inspection drawer, audit checklist, and activity logs
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('table')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Records ({deals.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedDeals.slice(0, 6).map(deal => {
            const stageConfig = STAGES.find(s => s.id === deal.stage);
            return (
              <div
                key={deal.id}
                onClick={() => onSelectDeal(deal)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-orange-400 hover:shadow-md transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                      {deal.clientCompany}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug line-clamp-1">
                      {deal.title}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${stageConfig?.badgeBg} ${stageConfig?.badgeText}`}>
                    {stageConfig?.label.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <span className="font-extrabold text-emerald-600 text-sm">
                    ${deal.value.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    📍 {deal.mineSiteName}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={deal.assignedRepAvatar}
                      alt={deal.assignedRepName}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="truncate max-w-[100px]">{deal.assignedRepName}</span>
                  </div>
                  <span className="text-orange-600 font-semibold">{deal.probability}% Prob.</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
