import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, Users, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'register' | 'switch';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'register' }) => {
  const { currentUser, allUsers, registerUser, switchUser } = useAuth();
  const [tab, setTab] = useState<'register' | 'switch'>(defaultTab);

  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Mining Safety Executive');
  const [territory, setTerritory] = useState('Western Australia / Pilbara Basin');
  const [company, setCompany] = useState('Mining Safety Solutions Global');
  const [salesQuota, setSalesQuota] = useState(2500000);
  const [commissionRate, setCommissionRate] = useState(8);
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [bio, setBio] = useState('Specializing in mine hazard mitigation, atmospheric telemetry, and underground safety systems.');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser = registerUser({
      name,
      email,
      role,
      territory,
      company,
      salesQuota: Number(salesQuota),
      commissionRate: Number(commissionRate) / 100,
      phone,
      bio
    });

    setSuccessMsg(`Welcome, ${newUser.name}! Your account has been registered and set as the active user.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleSwitch = (userId: string) => {
    switchUser(userId);
    setSuccessMsg('Active representative switched successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Mining Safety CRM — User Management
              </h2>
              <p className="text-xs text-slate-500">
                Register new representatives or switch between existing team profiles
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

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-6">
          <button
            onClick={() => setTab('register')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register New User
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              tab === 'switch'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Switch Active Rep ({allUsers.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jack Henderson"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Work Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jack@miningsafety.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role / Position
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="Senior Mining Safety Executive">Senior Mining Safety Executive</option>
                    <option value="Industrial Hazard Specialist">Industrial Hazard Specialist</option>
                    <option value="Ventilation & Atmospheric Safety Rep">Ventilation & Atmospheric Safety Rep</option>
                    <option value="Key Accounts Director - Global Mining">Key Accounts Director - Global Mining</option>
                    <option value="Geotech & Smart Wearables Lead">Geotech & Smart Wearables Lead</option>
                    <option value="MSHA Compliance Safety Advisor">MSHA Compliance Safety Advisor</option>
                    <option value="Regional Safety Account Manager">Regional Safety Account Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Territory / Mining Belt
                  </label>
                  <select
                    value={territory}
                    onChange={e => setTerritory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  >
                    <option value="Western Australia / Pilbara Basin">Western Australia / Pilbara Basin</option>
                    <option value="Nevada & Southwestern US">Nevada & Southwestern US</option>
                    <option value="Appalachian & Midwest Mining Belt">Appalachian & Midwest Mining Belt</option>
                    <option value="South America & Sub-Saharan Africa">South America & Sub-Saharan Africa</option>
                    <option value="Canadian Shield & Arctic Operations">Canadian Shield & Arctic Operations</option>
                    <option value="Chile Atacama & Peru Copper Belt">Chile Atacama & Peru Copper Belt</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sales Quota ($)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    min="500000"
                    value={salesQuota}
                    onChange={e => setSalesQuota(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="30"
                    value={commissionRate}
                    onChange={e => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / Radio
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Safety Expertise / Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm rounded-xl transition flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register & Login
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              <p className="text-xs text-slate-500 mb-2">
                Click any user below to simulate viewing the CRM from their sales perspective:
              </p>
              {allUsers.map(user => {
                const isSelected = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSwitch(user.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{user.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded-full">
                              Active User
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{user.role}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>📍 {user.territory}</span>
                          <span>•</span>
                          <span>Quota: ${(user.salesQuota / 1000000).toFixed(2)}M</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Current' : 'Switch'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
