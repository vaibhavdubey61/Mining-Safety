import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DealsProvider } from './context/DealsContext';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KanbanView } from './components/KanbanView';
import { TableView } from './components/TableView';
import { LeaderboardView } from './components/LeaderboardView';
import { SafetySolutionsCatalog } from './components/SafetySolutionsCatalog';
import { DealModal } from './components/DealModal';
import { DealDetailDrawer } from './components/DealDetailDrawer';
import { AuthModal } from './components/AuthModal';
import { Deal, SafetyCategory } from './types';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [filterByMyDeals, setFilterByMyDeals] = useState<boolean>(false);
  
  // Modals state
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);
  const [dealToEdit, setDealToEdit] = useState<Deal | null>(null);
  const [newDealCategory, setNewDealCategory] = useState<SafetyCategory | undefined>(undefined);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'register' | 'switch'>('register');
  
  // Drawer state
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const handleOpenNewDeal = () => {
    setDealToEdit(null);
    setNewDealCategory(undefined);
    setIsDealModalOpen(true);
  };

  const handleOpenNewDealWithCategory = (category: SafetyCategory) => {
    setDealToEdit(null);
    setNewDealCategory(category);
    setIsDealModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(null);
    setDealToEdit(deal);
    setIsDealModalOpen(true);
  };

  const handleOpenAuth = (defaultTab: 'register' | 'switch') => {
    setAuthModalTab(defaultTab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Header
        onOpenNewDeal={handleOpenNewDeal}
        onOpenAuth={handleOpenAuth}
        filterByMyDeals={filterByMyDeals}
        setFilterByMyDeals={setFilterByMyDeals}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-row">
        
        {/* Left Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAuth={handleOpenAuth}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
          
          {/* Mobile tab bar */}
          <div className="lg:hidden flex items-center justify-between bg-white border border-slate-200 rounded-xl p-1 mb-4 text-xs font-bold shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-slate-600'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'kanban' ? 'bg-orange-600 text-white' : 'text-slate-600'}`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'table' ? 'bg-orange-600 text-white' : 'text-slate-600'}`}
            >
              Records
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'leaderboard' ? 'bg-orange-600 text-white' : 'text-slate-600'}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'solutions' ? 'bg-orange-600 text-white' : 'text-slate-600'}`}
            >
              Catalog
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectDeal={setSelectedDeal}
              onOpenNewDeal={handleOpenNewDeal}
              filterByMyDeals={filterByMyDeals}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'kanban' && (
            <KanbanView
              onSelectDeal={setSelectedDeal}
              onOpenNewDeal={handleOpenNewDeal}
              filterByMyDeals={filterByMyDeals}
            />
          )}

          {activeTab === 'table' && (
            <TableView
              onSelectDeal={setSelectedDeal}
              onEditDeal={handleEditDeal}
              onOpenNewDeal={handleOpenNewDeal}
              filterByMyDeals={filterByMyDeals}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              onSelectDeal={setSelectedDeal}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {activeTab === 'solutions' && (
            <SafetySolutionsCatalog
              onOpenNewDealWithCategory={handleOpenNewDealWithCategory}
            />
          )}

        </main>
      </div>

      {/* Slide-out Deal Detail Drawer */}
      <DealDetailDrawer
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onEdit={handleEditDeal}
      />

      {/* Add / Edit Sale Modal */}
      <DealModal
        isOpen={isDealModalOpen}
        onClose={() => {
          setIsDealModalOpen(false);
          setDealToEdit(null);
          setNewDealCategory(undefined);
        }}
        dealToEdit={dealToEdit}
        initialCategory={newDealCategory}
      />

      {/* User Registration & Switching Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DealsProvider>
        <MainApp />
      </DealsProvider>
    </AuthProvider>
  );
}
