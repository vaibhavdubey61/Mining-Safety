import React, { createContext, useContext, useState, useEffect } from 'react';
import { Deal, PipelineStage, DealActivity, SafetyAuditChecklist } from '../types';
import { INITIAL_DEALS, STAGES } from '../data/mockData';
import confetti from 'canvas-confetti';

interface DealsContextType {
  deals: Deal[];
  addDeal: (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>) => Deal;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
  moveDealStage: (dealId: string, newStage: PipelineStage) => void;
  addDealActivity: (dealId: string, activity: Omit<DealActivity, 'id' | 'date'>) => void;
  toggleChecklistItem: (dealId: string, key: keyof SafetyAuditChecklist) => void;
  resetToMockData: () => void;
}

const STORAGE_KEY_DEALS = 'mining_safety_crm_deals';

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEALS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load deals from localStorage', e);
    }
    return INITIAL_DEALS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(deals));
    } catch (e) {
      console.error('Failed to persist deals', e);
    }
  }, [deals]);

  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): Deal => {
    const today = new Date().toISOString().split('T')[0];
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
      activities: [
        {
          id: `act-${Date.now()}`,
          date: today,
          type: 'note',
          title: 'Deal Registered in Mining Safety CRM',
          description: `Created for ${dealData.clientCompany} (${dealData.mineSiteName}) with initial value of $${dealData.value.toLocaleString()}.`,
          authorName: dealData.assignedRepName,
        }
      ]
    };

    setDeals(prev => [newDeal, ...prev]);

    if (newDeal.stage === 'closed_won') {
      triggerCelebration();
    }

    return newDeal;
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    const today = new Date().toISOString().split('T')[0];
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const wasWonBefore = deal.stage === 'closed_won';
        const isNowWon = updates.stage === 'closed_won';
        if (!wasWonBefore && isNowWon) {
          triggerCelebration();
        }
        return {
          ...deal,
          ...updates,
          updatedAt: today
        };
      }
      return deal;
    }));
  };

  const deleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  const moveDealStage = (dealId: string, newStage: PipelineStage) => {
    const targetStageConfig = STAGES.find(s => s.id === newStage);
    const newProb = targetStageConfig ? targetStageConfig.defaultProbability : 50;
    const today = new Date().toISOString().split('T')[0];

    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const isNowWon = newStage === 'closed_won';
        if (deal.stage !== 'closed_won' && isNowWon) {
          triggerCelebration();
        }

        const stageChangeActivity: DealActivity = {
          id: `act-${Date.now()}`,
          date: today,
          type: 'stage_change',
          title: `Moved to ${targetStageConfig?.label || newStage}`,
          description: `Stage updated with recalculated win probability of ${newProb}%.`,
          authorName: deal.assignedRepName,
        };

        return {
          ...deal,
          stage: newStage,
          probability: newProb,
          updatedAt: today,
          activities: [stageChangeActivity, ...(deal.activities || [])]
        };
      }
      return deal;
    }));
  };

  const addDealActivity = (dealId: string, activity: Omit<DealActivity, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newAct: DealActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      date: today,
    };

    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        return {
          ...deal,
          updatedAt: today,
          activities: [newAct, ...(deal.activities || [])]
        };
      }
      return deal;
    }));
  };

  const toggleChecklistItem = (dealId: string, key: keyof SafetyAuditChecklist) => {
    setDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        return {
          ...deal,
          checklist: {
            ...deal.checklist,
            [key]: !deal.checklist[key]
          },
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return deal;
    }));
  };

  const resetToMockData = () => {
    setDeals(INITIAL_DEALS);
    localStorage.setItem(STORAGE_KEY_DEALS, JSON.stringify(INITIAL_DEALS));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#10b981', '#0284c7', '#f59e0b']
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <DealsContext.Provider value={{
      deals,
      addDeal,
      updateDeal,
      deleteDeal,
      moveDealStage,
      addDealActivity,
      toggleChecklistItem,
      resetToMockData
    }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};
