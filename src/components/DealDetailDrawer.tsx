import React, { useState } from 'react';
import { Deal, PipelineStage, SafetyAuditChecklist } from '../types';
import { STAGES } from '../data/mockData';
import { useDeals } from '../context/DealsContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, CheckCircle, AlertTriangle, Building, MapPin, 
  User as UserIcon, Calendar, CheckSquare, Square, 
  Trash2, Edit3, Send, Trophy, Ban, ShieldCheck, Flame, 
  Phone, Mail, FileText
} from 'lucide-react';

interface DealDetailDrawerProps {
  deal: Deal | null;
  onClose: () => void;
  onEdit: (deal: Deal) => void;
}

export const DealDetailDrawer: React.FC<DealDetailDrawerProps> = ({ deal, onClose, onEdit }) => {
  const { moveDealStage, deleteDeal, addDealActivity, toggleChecklistItem } = useDeals();
  const { currentUser } = useAuth();
  
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityType, setNewActivityType] = useState<'audit' | 'meeting' | 'call' | 'note'>('note');

  if (!deal) return null;

  const currentStageIndex = STAGES.findIndex(s => s.id === deal.stage);
  const repCommission = (deal.value * (currentUser.commissionRate || 0.08));

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    addDealActivity(deal.id, {
      title: newActivityTitle,
      description: newActivityDesc || 'Note recorded.',
      type: newActivityType,
      authorName: currentUser.name
    });

    setNewActivityTitle('');
    setNewActivityDesc('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      deleteDeal(deal.id);
      onClose();
    }
  };

  const checklistItems: { key: keyof SafetyAuditChecklist; label: string; desc: string }[] = [
    { key: 'siteHazardAssessmentDone', label: 'Site Hazard & Gas Audit', desc: 'On-site sensor inspection and gas baseline logged' },
    { key: 'gasAtmosphereBaselineRecorded', label: 'Atmospheric Safety Baseline', desc: 'Ventilation CFM and methane threshold recorded' },
    { key: 'mshaOshaComplianceReviewed', label: 'MSHA / OSHA Regulatory Review', desc: 'Compliant with CFR 30 / ISO 45001 standards' },
    { key: 'mineRescuePlanAligned', label: 'Mine Rescue & Protocol Alignment', desc: 'Emergency protocols and blast chamber staging verified' },
    { key: 'engineeringSignoffReceived', label: 'Mine Site Chief Engineer Signoff', desc: 'Structural and electrical load approval stamped' },
    { key: 'safetyOfficerTrialCompleted', label: 'Safety Officer Field Trial', desc: 'Successful 14-day field deployment trial' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-orange-100 text-orange-800 border border-orange-200 uppercase tracking-wider">
                {deal.sector}
              </span>
              <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider flex items-center gap-1 ${
                deal.priority === 'Critical Safety Priority'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {deal.priority === 'Critical Safety Priority' && <Flame className="w-3 h-3 text-rose-600" />}
                {deal.priority}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {deal.complianceTier}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {deal.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building className="w-3.5 h-3.5 text-orange-600" />
                {deal.clientCompany}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {deal.mineSiteName} ({deal.location})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(deal)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition"
              title="Edit Deal"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
              title="Delete Deal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Contract Value</span>
              <span className="text-lg font-extrabold text-emerald-600">${deal.value.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Win Probability</span>
              <span className="text-lg font-extrabold text-blue-600">{deal.probability}%</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Weighted Forecast</span>
              <span className="text-lg font-extrabold text-slate-800">
                ${Math.round(deal.value * (deal.probability / 100)).toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200/80">
              <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">Est. Commission</span>
              <span className="text-lg font-extrabold text-orange-600">
                ${Math.round(repCommission).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stage Progression Stepper */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pipeline Lifecycle Stage
              </span>
              <div className="flex items-center gap-2">
                {deal.stage !== 'closed_won' && (
                  <button
                    onClick={() => moveDealStage(deal.id, 'closed_won')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Mark Won
                  </button>
                )}
                {deal.stage !== 'closed_lost' && (
                  <button
                    onClick={() => moveDealStage(deal.id, 'closed_lost')}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Mark Lost
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {STAGES.filter(s => s.id !== 'closed_lost').map((stage, idx) => {
                const isActive = stage.id === deal.stage;
                const isPassed = currentStageIndex > idx && deal.stage !== 'closed_lost';

                return (
                  <button
                    key={stage.id}
                    onClick={() => moveDealStage(deal.id, stage.id)}
                    className={`p-2 rounded-lg text-left text-xs font-medium transition border ${
                      isActive
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isPassed ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                          isActive ? 'bg-white text-orange-600' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {idx + 1}
                        </span>
                      )}
                      <span className="truncate">{stage.label.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Rep & Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sales Rep Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Sales Representative
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={deal.assignedRepAvatar}
                  alt={deal.assignedRepName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{deal.assignedRepName}</h4>
                  <p className="text-xs text-slate-500">Credited on Rep Quota</p>
                </div>
              </div>
            </div>

            {/* Client Safety Officer */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Mine Site Safety Contact
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{deal.clientContact.name}</h4>
                <p className="text-xs text-slate-500">{deal.clientContact.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                  <a href={`mailto:${deal.clientContact.email}`} className="flex items-center gap-1 text-orange-600 hover:underline">
                    <Mail className="w-3 h-3" />
                    Email
                  </a>
                  <span>•</span>
                  <a href={`tel:${deal.clientContact.phone}`} className="flex items-center gap-1 text-slate-700 hover:underline">
                    <Phone className="w-3 h-3" />
                    {deal.clientContact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Safety & Compliance Checklist */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mining Safety Compliance & Audit Verification
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {Object.values(deal.checklist).filter(Boolean).length} / 6 Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {checklistItems.map(item => {
                const checked = deal.checklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleChecklistItem(deal.id, item.key)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex items-start gap-2.5 ${
                      checked
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                        : 'bg-slate-50/60 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`text-xs font-bold leading-tight ${checked ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes & Safety Hazards Profile */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Site Hazard Findings & Safety Specifications
            </span>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {deal.notes}
            </p>
          </div>

          {/* Activity Log & Timeline */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Safety Activity & Audit Timeline
            </h3>

            {/* Add Activity Input */}
            <form onSubmit={handleAddActivity} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Log safety action (e.g. Conducted gas sensor test at shaft 3)..."
                  value={newActivityTitle}
                  onChange={e => setNewActivityTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                />
                <select
                  value={newActivityType}
                  onChange={e => setNewActivityType(e.target.value as any)}
                  className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                >
                  <option value="note">Note</option>
                  <option value="audit">Site Audit</option>
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Send className="w-3 h-3" />
                  Log
                </button>
              </div>
            </form>

            {/* List */}
            <div className="space-y-3 pl-2 border-l-2 border-slate-200">
              {deal.activities?.map(act => (
                <div key={act.id} className="relative pl-4 space-y-1">
                  <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{act.title}</span>
                    <span className="text-slate-400">{act.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{act.description}</p>
                  <span className="text-[10px] text-slate-400">By {act.authorName}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
