import React, { useState } from 'react';
import { useDeals } from '../context/DealsContext';
import { useAuth } from '../context/AuthContext';
import { STAGES } from '../data/mockData';
import { Deal, PipelineStage } from '../types';
import { 
  Building, MapPin, ChevronRight, Plus, 
  Flame, Filter, Search, ShieldCheck 
} from 'lucide-react';

interface KanbanViewProps {
  onSelectDeal: (deal: Deal) => void;
  onOpenNewDeal: () => void;
  filterByMyDeals: boolean;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  onSelectDeal,
  onOpenNewDeal,
  filterByMyDeals,
}) => {
  const { deals, moveDealStage } = useDeals();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>('all');

  // Filter deals
  const displayedDeals = deals.filter(deal => {
    if (filterByMyDeals && deal.assignedRepId !== currentUser.id) return false;
    if (selectedRepFilter !== 'all' && deal.assignedRepId !== selectedRepFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = deal.title.toLowerCase().includes(q);
      const matchClient = deal.clientCompany.toLowerCase().includes(q);
      const matchSite = deal.mineSiteName.toLowerCase().includes(q);
      const matchCategory = deal.category.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchSite && !matchCategory) return false;
    }
    return true;
  });

  const activeStages = STAGES.filter(s => s.id !== 'closed_lost');

  const getNextStage = (currentStage: PipelineStage): PipelineStage | null => {
    const idx = activeStages.findIndex(s => s.id === currentStage);
    if (idx !== -1 && idx < activeStages.length - 1) {
      return activeStages[idx + 1].id;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mining deals, sites, products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <span className="text-xs text-slate-500 font-semibold hidden md:inline">
            Showing {displayedDeals.length} active opportunities
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onOpenNewDeal}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[620px]">
        {activeStages.map(stage => {
          const stageDeals = displayedDeals.filter(d => d.stage === stage.id);
          const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage.id}
              className="w-80 shrink-0 bg-slate-50/80 rounded-2xl border border-slate-200/90 flex flex-col max-h-[calc(100vh-210px)]"
            >
              
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200/80 bg-white rounded-t-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.label.replace(/^\d+\.\s*/, '')}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Total Value:</span>
                  <span className="font-extrabold text-slate-900">${(stageSum).toLocaleString()}</span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {stageDeals.length === 0 ? (
                  <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400 font-medium">No deals in this stage</p>
                  </div>
                ) : (
                  stageDeals.map(deal => {
                    const nextStage = getNextStage(deal.stage);
                    const isCritical = deal.priority === 'Critical Safety Priority';

                    return (
                      <div
                        key={deal.id}
                        onClick={() => onSelectDeal(deal)}
                        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md space-y-2.5 group ${
                          isCritical
                            ? 'border-orange-300 hover:border-orange-500'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Company & Priority */}
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider">
                            {deal.clientCompany}
                          </span>
                          {isCritical && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 text-rose-600" />
                              Urgent Risk
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug line-clamp-2">
                          {deal.title}
                        </h4>

                        {/* Mine Site */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{deal.mineSiteName}</span>
                        </div>

                        {/* Safety Category Badge */}
                        <div className="pt-0.5">
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md inline-block max-w-full truncate">
                            {deal.category}
                          </span>
                        </div>

                        {/* Card Footer: Value, Rep, and Advance Action */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-extrabold text-slate-900 text-sm">
                            ${deal.value.toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2">
                            <img
                              src={deal.assignedRepAvatar}
                              alt={deal.assignedRepName}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                              title={`Assigned to ${deal.assignedRepName}`}
                            />

                            {/* Advance stage button */}
                            {nextStage && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  moveDealStage(deal.id, nextStage);
                                }}
                                className="p-1 hover:bg-orange-100 text-slate-400 hover:text-orange-600 rounded-md transition"
                                title="Advance to next stage"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
