import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext';
import { 
  ShieldAlert, Plus, Users, UserPlus, 
  RotateCcw, Sparkles, ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  onOpenNewDeal: () => void;
  onOpenAuth: (defaultTab: 'register' | 'switch') => void;
  filterByMyDeals: boolean;
  setFilterByMyDeals: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewDeal,
  onOpenAuth,
  filterByMyDeals,
  setFilterByMyDeals,
}) => {
  const { currentUser } = useAuth();
  const { deals, resetToMockData } = useDeals();

  const userDeals = deals.filter(d => d.assignedRepId === currentUser.id);
  const userWon = userDeals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);
  const quotaPct = Math.min(100, Math.round((userWon / currentUser.salesQuota) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Logo & Platform Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/25">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Mining Safety <span className="text-orange-600">CRM</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  Lite Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Industrial Hazard & Equipment Sales Tracking
              </p>
            </div>
          </div>

          {/* Quick Rep Switcher trigger on mobile */}
          <button
            onClick={() => onOpenAuth('switch')}
            className="sm:hidden flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full" />
            <span className="truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
          </button>
        </div>

        {/* Center / Pipeline Scope Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
          <button
            onClick={() => setFilterByMyDeals(true)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              filterByMyDeals
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            My Sales ({userDeals.length})
          </button>
          <button
            onClick={() => setFilterByMyDeals(false)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              !filterByMyDeals
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Entire Team ({deals.length})
          </button>
        </div>

        {/* Right Section: Active User Card, Register CTA, + Deal CTA */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          
          {/* Active User Card & Switch dropdown trigger */}
          <div 
            onClick={() => onOpenAuth('switch')}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition group"
            title="Click to switch representative or view profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
            />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <span>Quota: {quotaPct}%</span>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Register User Button */}
          <button
            onClick={() => onOpenAuth('register')}
            className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">Register User</span>
          </button>

          {/* Reset Mock Data (Helpful utility) */}
          <button
            onClick={() => {
              if (window.confirm('Reset all deals back to initial sample mining data?')) {
                resetToMockData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition border border-transparent hover:border-slate-200"
            title="Reset to default mock deals"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* New Deal CTA */}
          <button
            onClick={onOpenNewDeal}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm shadow-orange-600/30 hover:shadow-md hover:shadow-orange-600/40"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Sale</span>
          </button>
        </div>

      </div>
    </header>
  );
};
