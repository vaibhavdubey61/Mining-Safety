import React from 'react';
import { 
  LayoutDashboard, Kanban, Table, Trophy, 
  ShieldCheck, HardHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext';

export type ActiveTab = 'dashboard' | 'kanban' | 'table' | 'leaderboard' | 'solutions';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: (defaultTab: 'register' | 'switch') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { currentUser } = useAuth();
  const { deals } = useDeals();

  const userDeals = deals.filter(d => d.assignedRepId === currentUser.id);
  const userWon = userDeals
    .filter(d => d.stage === 'closed_won')
    .reduce((sum, d) => sum + d.value, 0);
  const quotaPct = Math.min(100, Math.round((userWon / currentUser.salesQuota) * 100));

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard & KPIs', icon: LayoutDashboard },
    { id: 'kanban', label: 'Pipeline Board', icon: Kanban, badge: deals.length },
    { id: 'table', label: 'All Sales Records', icon: Table, badge: 'Grid' },
    { id: 'leaderboard', label: 'Rep Tracking & Quota', icon: Trophy, badge: 'Leaderboard' },
    { id: 'solutions', label: 'Safety Solutions Catalog', icon: ShieldCheck, badge: 'Products' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      
      {/* Navigation Links */}
      <div className="p-4 space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Main Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-orange-50 text-orange-700 border border-orange-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Mining Safety Operations Info Box */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Safety Standards Tracked
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <HardHat className="w-4 h-4 text-orange-600" />
              <span>MSHA 30 CFR Compliant</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              All sales link equipment telemetry to regional mine hazard inspection frameworks.
            </p>
            <div className="pt-1 flex flex-wrap gap-1">
              <span className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-bold">
                ISO 45001
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-bold">
                AS/NZS 4801
              </span>
              <span className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-bold">
                OSHA 1926
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Card at bottom of sidebar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div 
          onClick={() => onOpenAuth('switch')}
          className="p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-300 transition cursor-pointer shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition">
                {currentUser.name}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.role}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                <span>Quota: ${((userWon / 1000000)).toFixed(2)}M / ${(currentUser.salesQuota / 1000000).toFixed(2)}M</span>
                <span className="font-bold text-orange-600">{quotaPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
};
