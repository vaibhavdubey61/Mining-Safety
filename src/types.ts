export type PipelineStage = 
  | 'discovery'
  | 'hazard_audit'
  | 'proposal'
  | 'compliance_review'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface StageConfig {
  id: PipelineStage;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  defaultProbability: number;
}

export type MiningSector = 
  | 'Underground Hardrock'
  | 'Open-Pit Metals'
  | 'Coal & Combustible'
  | 'Smelting & Refining'
  | 'Quarry & Aggregates'
  | 'Offshore Marine Mining';

export type SafetyCategory = 
  | 'Atmospheric & Gas Detection'
  | 'Underground Blast & Refuge Shelters'
  | 'Dust Suppression & Ventilation Systems'
  | 'Smart PPE & Biometric Wearables'
  | 'Conveyor & Machinery Safety Interlocks'
  | 'Mine Rescue & Emergency Comms'
  | 'Geotechnical Hazard & Slope Radar'
  | 'MSHA / ISO Compliance Audit Services';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  territory: string;
  company: string;
  avatar: string;
  salesQuota: number; // e.g. $1,500,000
  commissionRate: number; // e.g. 0.08 (8%)
  phone?: string;
  joinedDate: string;
  bio?: string;
}

export interface SafetyAuditChecklist {
  siteHazardAssessmentDone: boolean;
  gasAtmosphereBaselineRecorded: boolean;
  mshaOshaComplianceReviewed: boolean;
  mineRescuePlanAligned: boolean;
  engineeringSignoffReceived: boolean;
  safetyOfficerTrialCompleted: boolean;
}

export interface DealActivity {
  id: string;
  date: string;
  type: 'audit' | 'meeting' | 'call' | 'proposal' | 'stage_change' | 'note';
  title: string;
  description: string;
  authorName: string;
}

export interface Deal {
  id: string;
  title: string;
  clientCompany: string;
  mineSiteName: string;
  location: string;
  sector: MiningSector;
  category: SafetyCategory;
  value: number; // in USD
  stage: PipelineStage;
  probability: number; // percentage 0 - 100
  expectedCloseDate: string;
  complianceTier: 'MSHA Part 57' | 'OSHA 1926 Subpart' | 'ISO 45001' | 'AS/NZS 4801' | 'MA/KA Certified';
  priority: 'Low' | 'Medium' | 'High' | 'Critical Safety Priority';
  assignedRepId: string;
  assignedRepName: string;
  assignedRepAvatar: string;
  clientContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  notes: string;
  checklist: SafetyAuditChecklist;
  activities: DealActivity[];
  createdAt: string;
  updatedAt: string;
}
