import React, { useState } from 'react';
import { useDeals } from '../context/DealsContext';
import { useAuth } from '../context/AuthContext';
import { STAGES } from '../data/mockData';
import { Deal, PipelineStage, MiningSector, SafetyCategory } from '../types';
import { 
  Search, Download, Filter, ArrowUpDown, 
  ExternalLink, Edit, Trash2, Building, ShieldCheck 
} from 'lucide-react';

interface TableViewProps {
  onSelectDeal: (deal: Deal) => void;
  onEditDeal: (deal: Deal) => void;
  onOpenNewDeal: () => void;
  filterByMyDeals: boolean;
}

export const TableView: React.FC<TableViewProps> = ({
  onSelectDeal,
  onEditDeal,
  onOpenNewDeal,
  filterByMyDeals
}) => {
  const { deals } = useDeals();
  const { currentUser, allUsers } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'value' | 'probability' | 'closeDate' | 'client'>('value');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter deals
  const filteredDeals = deals.filter(deal => {
    if (filterByMyDeals && deal.assignedRepId !== currentUser.id) return false;
    if (selectedStage !== 'all' && deal.stage !== selectedStage) return false;
    if (selectedRep !== 'all' && deal.assignedRepId !== selectedRep) return false;
    if (selectedCategory !== 'all' && deal.category !== selectedCategory) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = deal.title.toLowerCase().includes(q);
      const matchClient = deal.clientCompany.toLowerCase().includes(q);
      const matchSite = deal.mineSiteName.toLowerCase().includes(q);
      const matchRep = deal.assignedRepName.toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchSite && !matchRep) return false;
    }
    return true;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    let diff = 0;
    if (sortField === 'value') diff = a.value - b.value;
    else if (sortField === 'probability') diff = a.probability - b.probability;
    else if (sortField === 'closeDate') diff = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
    else if (sortField === 'client') diff = a.clientCompany.localeCompare(b.clientCompany);
    return sortAsc ? diff : -diff;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'Deal ID',
      'Title',
      'Client Company',
      'Mine Site',
      'Location',
      'Sector',
      'Safety Category',
      'Value (USD)',
      'Stage',
      'Probability (%)',
      'Compliance Standard',
      'Assigned Rep',
      'Expected Close Date'
    ];

    const rows = sortedDeals.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.clientCompany}"`,
      `"${d.mineSiteName}"`,
      `"${d.location}"`,
      `"${d.sector}"`,
      `"${d.category}"`,
      d.value,
      d.stage,
      d.probability,
      d.complianceTier,
      `"${d.assignedRepName}"`,
      d.expectedCloseDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mining_Safety_CRM_Sales_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFilteredValue = sortedDeals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-4">
      
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search sales by mine, client, rep..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={exportToCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-orange-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onOpenNewDeal}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <span>+ Log Sale</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter By:</span>
          </div>

          {/* Stage filter */}
          <select
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">All Pipeline Stages</option>
            {STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {/* Rep filter */}
          {!filterByMyDeals && (
            <select
              value={selectedRep}
              onChange={e => setSelectedRep(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="all">All Sales Reps</option>
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}

          <div className="ml-auto text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{sortedDeals.length}</strong> sales totaling{' '}
            <strong className="text-emerald-600">${totalFilteredValue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Head */}
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th 
                  onClick={() => handleSort('client')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Client & Site</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5">Safety Equipment Solution</th>
                <th className="p-3.5">Sector</th>
                <th 
                  onClick={() => handleSort('value')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Value (USD)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('probability')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Stage & Prob.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5">Assigned Rep</th>
                <th 
                  onClick={() => handleSort('closeDate')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Close Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {sortedDeals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No sales records found matching the active filters.
                  </td>
                </tr>
              ) : (
                sortedDeals.map(deal => {
                  const stageConfig = STAGES.find(s => s.id === deal.stage);

                  return (
                    <tr 
                      key={deal.id}
                      onClick={() => onSelectDeal(deal)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Client & Title */}
                      <td className="p-3.5">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-orange-600 block">
                            {deal.clientCompany}
                          </span>
                          <span className="font-bold text-slate-900 block group-hover:text-orange-600 transition">
                            {deal.title}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            📍 {deal.mineSiteName} ({deal.location})
                          </span>
                        </div>
                      </td>

                      {/* Safety Category */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {deal.category}
                        </span>
                      </td>

                      {/* Sector */}
                      <td className="p-3.5 text-slate-600 font-medium">
                        {deal.sector}
                      </td>

                      {/* Value */}
                      <td className="p-3.5 font-extrabold text-slate-900 text-sm">
                        ${deal.value.toLocaleString()}
                      </td>

                      {/* Stage & Prob */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${stageConfig?.badgeBg} ${stageConfig?.badgeText}`}>
                            {stageConfig?.label.replace(/^\d+\.\s*/, '')}
                          </span>
                          <div className="text-[11px] text-slate-500 font-semibold">
                            {deal.probability}% probability
                          </div>
                        </div>
                      </td>

                      {/* Assigned Rep */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={deal.assignedRepAvatar}
                            alt={deal.assignedRepName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-semibold text-slate-800">{deal.assignedRepName}</span>
                        </div>
                      </td>

                      {/* Close Date */}
                      <td className="p-3.5 text-slate-600 font-medium">
                        {deal.expectedCloseDate}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => onEditDeal(deal)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Deal"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectDeal(deal)}
                            className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition font-bold"
                            title="Inspect Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
};
