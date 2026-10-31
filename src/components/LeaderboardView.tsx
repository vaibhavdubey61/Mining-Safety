import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext';
import { Deal } from '../types';
import { 
  Trophy, Award, TrendingUp, DollarSign, 
  UserCheck, ShieldCheck, ArrowUpRight, Flame, 
  Sparkles, CheckCircle2, ChevronRight, UserPlus
} from 'lucide-react';

interface LeaderboardViewProps {
  onSelectDeal: (deal: Deal) => void;
  onOpenAuth: (defaultTab: 'register' | 'switch') => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onSelectDeal, onOpenAuth }) => {
  const { allUsers, currentUser, switchUser } = useAuth();
  const { deals } = useDeals();

  const [selectedRepId, setSelectedRepId] = useState<string>(currentUser.id);

  // Compute stats for each rep
  const repStats = allUsers.map(user => {
    const userDeals = deals.filter(d => d.assignedRepId === user.id);
    const wonDeals = userDeals.filter(d => d.stage === 'closed_won');
    const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
    const activeDeals = userDeals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
    const activePipeline = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const quotaPct = Math.round((wonRevenue / user.salesQuota) * 100);
    const commissionEarned = wonRevenue * user.commissionRate;
    const winRate = userDeals.length > 0 
      ? Math.round((wonDeals.length / userDeals.length) * 100) 
      : 0;

    return {
      user,
      totalDealsCount: userDeals.length,
      wonDeals,
      wonRevenue,
      activeDeals,
      activePipeline,
      quotaPct,
      commissionEarned,
      winRate,
      avgDealSize: userDeals.length > 0 ? Math.round((wonRevenue + activePipeline) / userDeals.length) : 0,
    };
  });

  // Sort by Won Revenue descending
  const sortedReps = [...repStats].sort((a, b) => b.wonRevenue - a.wonRevenue);

  const selectedRepData = sortedReps.find(r => r.user.id === selectedRepId) || sortedReps[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 rounded-2xl border border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-600 text-white uppercase tracking-wider">
              Sales Quota & Performance Tracker
            </span>
            <span className="text-xs text-slate-500">
              Tracking individual representative revenue, quota progress, and commissions
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Mining Safety Sales Leaderboard
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent tracking for registered safety equipment specialists and key account managers.
          </p>
        </div>

        <button
          onClick={() => onOpenAuth('register')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Representative</span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Rep Rankings */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Representative Sales Standings ({sortedReps.length} Reps)
            </h3>
            <span className="text-xs text-slate-400">Click a rep to view their deal pipeline</span>
          </div>

          <div className="space-y-2.5">
            {sortedReps.map((item, idx) => {
              const isSelected = item.user.id === selectedRepData.user.id;
              const isCurrentLoggedIn = item.user.id === currentUser.id;

              return (
                <div
                  key={item.user.id}
                  onClick={() => setSelectedRepId(item.user.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-orange-500 bg-white ring-2 ring-orange-500/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  
                  {/* Left: Rank, Avatar & Info */}
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      idx === 0 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : idx === 1 
                        ? 'bg-slate-200 text-slate-700'
                        : idx === 2
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      #{idx + 1}
                    </div>

                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{item.user.name}</h4>
                        {isCurrentLoggedIn && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{item.user.role}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">📍 {item.user.territory}</p>
                    </div>
                  </div>

                  {/* Middle / Right: Stats & Quota bar */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    
                    {/* Won Revenue */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Closed Won
                      </span>
                      <span className="text-base font-extrabold text-emerald-600 block">
                        ${(item.wonRevenue).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.wonDeals.length} won / {item.totalDealsCount} total
                      </span>
                    </div>

                    {/* Quota Progress */}
                    <div className="w-28 text-left sm:text-right">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>Quota</span>
                        <span className={item.quotaPct >= 100 ? 'text-emerald-600' : 'text-orange-600'}>
                          {item.quotaPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.quotaPct >= 100 ? 'bg-emerald-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(100, item.quotaPct)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Target: ${(item.user.salesQuota / 1000000).toFixed(2)}M
                      </span>
                    </div>

                    {/* Active Pipeline */}
                    <div className="hidden md:block text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        In Flight
                      </span>
                      <span className="text-sm font-bold text-blue-600 block">
                        ${(item.activePipeline).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.activeDeals.length} deals
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Rep Performance Card & Deals Drill-Down */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRepData.user.avatar}
                  alt={selectedRepData.user.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedRepData.user.name}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedRepData.user.role}</p>
                  <p className="text-[11px] text-slate-400">📍 {selectedRepData.user.territory}</p>
                </div>
              </div>

              {selectedRepData.user.id !== currentUser.id && (
                <button
                  onClick={() => switchUser(selectedRepData.user.id)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                  title="Switch to this user session"
                >
                  Switch User
                </button>
              )}
            </div>

            {/* Rep Financial Summary */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Closed Won</span>
                <span className="text-base font-extrabold text-emerald-700">
                  ${selectedRepData.wonRevenue.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Active Pipeline</span>
                <span className="text-base font-extrabold text-blue-700">
                  ${selectedRepData.activePipeline.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/60">
                <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider block">Est Commission</span>
                <span className="text-base font-extrabold text-orange-700">
                  ${Math.round(selectedRepData.commissionEarned).toLocaleString()}
                </span>
                <span className="text-[10px] text-orange-600 block">Rate: {(selectedRepData.user.commissionRate * 100).toFixed(1)}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Win Rate</span>
                <span className="text-base font-extrabold text-slate-800">
                  {selectedRepData.winRate}%
                </span>
                <span className="text-[10px] text-slate-500 block">{selectedRepData.wonDeals.length} won</span>
              </div>
            </div>

            {/* Rep Bio */}
            {selectedRepData.user.bio && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800 block text-[11px] mb-1">Safety Specialization:</strong>
                {selectedRepData.user.bio}
              </div>
            )}

            {/* Deals assigned to this rep */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block">
                Active & Won Opportunities ({selectedRepData.totalDealsCount})
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {deals.filter(d => d.assignedRepId === selectedRepData.user.id).map(d => (
                  <div
                    key={d.id}
                    onClick={() => onSelectDeal(d)}
                    className="p-2.5 bg-slate-50 hover:bg-orange-50/60 rounded-xl border border-slate-200 hover:border-orange-300 transition cursor-pointer text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 truncate pr-2">{d.title}</span>
                      <span className="font-bold text-emerald-600 shrink-0">${(d.value / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{d.clientCompany}</span>
                      <span className="capitalize text-slate-600 font-medium">{d.stage.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
