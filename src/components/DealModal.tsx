import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDeals } from '../context/DealsContext';
import { Deal, MiningSector, SafetyCategory, PipelineStage } from '../types';
import { STAGES } from '../data/mockData';
import { X, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
  initialCategory?: SafetyCategory;
}

const MINING_COMPANIES = [
  'BHP Group',
  'Rio Tinto',
  'Vale S.A.',
  'Barrick Gold Corporation',
  'Freeport-McMoRan',
  'Anglo American',
  'Newmont Corporation',
  'Glencore Mining',
  'Teck Resources',
  'Fortescue Metals Group',
  'Agnico Eagle Mines',
  'Peabody Energy',
  'Albemarle Corporation',
  'Other Mining Operator'
];

const SECTORS: MiningSector[] = [
  'Underground Hardrock',
  'Open-Pit Metals',
  'Coal & Combustible',
  'Smelting & Refining',
  'Quarry & Aggregates',
  'Offshore Marine Mining'
];

const SAFETY_CATEGORIES: SafetyCategory[] = [
  'Atmospheric & Gas Detection',
  'Underground Blast & Refuge Shelters',
  'Dust Suppression & Ventilation Systems',
  'Smart PPE & Biometric Wearables',
  'Conveyor & Machinery Safety Interlocks',
  'Mine Rescue & Emergency Comms',
  'Geotechnical Hazard & Slope Radar',
  'MSHA / ISO Compliance Audit Services'
];

export const DealModal: React.FC<DealModalProps> = ({ isOpen, onClose, dealToEdit, initialCategory }) => {
  const { currentUser, allUsers } = useAuth();
  const { addDeal, updateDeal } = useDeals();

  const [title, setTitle] = useState('');
  const [clientCompany, setClientCompany] = useState(MINING_COMPANIES[0]);
  const [mineSiteName, setMineSiteName] = useState('');
  const [location, setLocation] = useState('');
  const [sector, setSector] = useState<MiningSector>('Underground Hardrock');
  const [category, setCategory] = useState<SafetyCategory>(initialCategory || 'Atmospheric & Gas Detection');
  const [value, setValue] = useState<number>(450000);
  const [stage, setStage] = useState<PipelineStage>('hazard_audit');
  const [probability, setProbability] = useState<number>(35);
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [complianceTier, setComplianceTier] = useState<Deal['complianceTier']>('MSHA Part 57');
  const [priority, setPriority] = useState<Deal['priority']>('High');
  const [assignedRepId, setAssignedRepId] = useState('');
  
  // Client contact
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('Mine Safety Superintendent');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (dealToEdit) {
      setTitle(dealToEdit.title);
      setClientCompany(dealToEdit.clientCompany);
      setMineSiteName(dealToEdit.mineSiteName);
      setLocation(dealToEdit.location);
      setSector(dealToEdit.sector);
      setCategory(dealToEdit.category);
      setValue(dealToEdit.value);
      setStage(dealToEdit.stage);
      setProbability(dealToEdit.probability);
      setExpectedCloseDate(dealToEdit.expectedCloseDate);
      setComplianceTier(dealToEdit.complianceTier);
      setPriority(dealToEdit.priority);
      setAssignedRepId(dealToEdit.assignedRepId);
      setContactName(dealToEdit.clientContact.name);
      setContactTitle(dealToEdit.clientContact.title);
      setContactEmail(dealToEdit.clientContact.email);
      setContactPhone(dealToEdit.clientContact.phone);
      setNotes(dealToEdit.notes);
    } else {
      // Defaults for new deal
      setTitle('');
      setClientCompany(MINING_COMPANIES[0]);
      setMineSiteName('');
      setLocation('Pilbara Basin, WA');
      setSector('Underground Hardrock');
      setCategory(initialCategory || 'Atmospheric & Gas Detection');
      setValue(500000);
      setStage('discovery');
      setProbability(15);
      // Close date 90 days from now
      const d = new Date();
      d.setDate(d.getDate() + 90);
      setExpectedCloseDate(d.toISOString().split('T')[0]);
      setComplianceTier('MSHA Part 57');
      setPriority('High');
      setAssignedRepId(currentUser.id);
      setContactName('');
      setContactTitle('Safety & Risk Manager');
      setContactEmail('');
      setContactPhone('');
      setNotes('');
    }
  }, [dealToEdit, currentUser, isOpen, initialCategory]);

  // Sync probability with stage change
  const handleStageChange = (newStage: PipelineStage) => {
    setStage(newStage);
    const stageConf = STAGES.find(s => s.id === newStage);
    if (stageConf) {
      setProbability(stageConf.defaultProbability);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientCompany || !mineSiteName.trim()) return;

    const rep = allUsers.find(u => u.id === assignedRepId) || currentUser;

    const dealPayload = {
      title,
      clientCompany,
      mineSiteName,
      location,
      sector,
      category,
      value: Number(value),
      stage,
      probability: Number(probability),
      expectedCloseDate: expectedCloseDate || new Date().toISOString().split('T')[0],
      complianceTier,
      priority,
      assignedRepId: rep.id,
      assignedRepName: rep.name,
      assignedRepAvatar: rep.avatar,
      clientContact: {
        name: contactName || 'Senior Mine Safety Lead',
        title: contactTitle,
        email: contactEmail || `safety@${clientCompany.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: contactPhone || '+1 (555) 019-4820'
      },
      notes: notes || 'Initial safety scope reviewed.',
      checklist: dealToEdit ? dealToEdit.checklist : {
        siteHazardAssessmentDone: stage !== 'discovery',
        gasAtmosphereBaselineRecorded: ['proposal', 'compliance_review', 'negotiation', 'closed_won'].includes(stage),
        mshaOshaComplianceReviewed: ['compliance_review', 'negotiation', 'closed_won'].includes(stage),
        mineRescuePlanAligned: ['negotiation', 'closed_won'].includes(stage),
        engineeringSignoffReceived: ['negotiation', 'closed_won'].includes(stage),
        safetyOfficerTrialCompleted: stage === 'closed_won',
      }
    };

    if (dealToEdit) {
      updateDeal(dealToEdit.id, dealPayload);
    } else {
      addDeal(dealPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-600/30 flex items-center justify-center text-orange-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {dealToEdit ? 'Edit Mining Safety Sale' : 'Register New Mining Safety Sale'}
              </h2>
              <p className="text-xs text-slate-500">
                Log contract opportunities, safety equipment tenders, and audit proposals
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Deal Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sale / Tender Title <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rio Tinto Paraburdoo - Methane & Dust Telemetry Array"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mining Client <span className="text-orange-500">*</span>
              </label>
              <select
                value={clientCompany}
                onChange={e => setClientCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                {MINING_COMPANIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mine Site Name & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mine Site Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Olympic Dam / Carajás S11D / Grass Valley"
                value={mineSiteName}
                onChange={e => setMineSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Site Location & Region
              </label>
              <input
                type="text"
                placeholder="e.g. Pilbara, WA or Carlin Trend, NV"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Mining Sector & Safety Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mining Sector
              </label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value as MiningSector)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Safety Product / Solution Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as SafetyCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                {SAFETY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financials & Pipeline Stage */}
          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Deal Financials & Pipeline Progression</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contract Value (USD $) <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    required
                    min="10000"
                    step="5000"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={stage}
                  onChange={e => handleStageChange(e.target.value as PipelineStage)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                >
                  {STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Win Probability ({probability}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={probability}
                  onChange={e => setProbability(Number(e.target.value))}
                  className="w-full mt-2 accent-orange-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={expectedCloseDate}
                  onChange={e => setExpectedCloseDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Compliance Standard
                </label>
                <select
                  value={complianceTier}
                  onChange={e => setComplianceTier(e.target.value as Deal['complianceTier'])}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="MSHA Part 57">MSHA Part 57 (Metal/Non-metal)</option>
                  <option value="OSHA 1926 Subpart">OSHA 1926 Subpart (Heavy Indus)</option>
                  <option value="ISO 45001">ISO 45001 (Global Occupational)</option>
                  <option value="AS/NZS 4801">AS/NZS 4801 (Australian Mining)</option>
                  <option value="MA/KA Certified">MA/KA Mining Safety Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Safety Urgency Priority
                </label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Deal['priority'])}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical Safety Priority">Critical Safety Priority ⚠️</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assigned Representative */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Sales Representative (Tracks Sale on their Quota)
            </label>
            <select
              value={assignedRepId}
              onChange={e => setAssignedRepId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
            >
              {allUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role} ({u.territory})
                </option>
              ))}
            </select>
          </div>

          {/* Client Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mine Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Larson"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Title / Position
              </label>
              <input
                type="text"
                placeholder="Safety Director"
                value={contactTitle}
                onChange={e => setContactTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="j.larson@mine.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+1 555-0192"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hazard Audit Findings & Contract Notes
            </label>
            <textarea
              rows={3}
              placeholder="Outline specific hazard challenges (e.g., Methane concentrations at 2.4%, rock burst history, high particulate dust at conveyor transfer chute)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Assigned to tracks against quota: ${(value * 0.08).toLocaleString()} est. commission</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-600/20 rounded-xl transition flex items-center gap-2"
              >
                {dealToEdit ? 'Save Changes' : 'Create & Track Deal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
