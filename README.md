# ⛏️ Mining Safety CRM

[![Live Preview](https://img.shields.io/badge/Live%20Demo-mining--safety--crm.surge.sh-orange?style=flat-square&logo=surge)](https://mining-safety-crm.surge.sh)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

An enterprise CRM and industrial sales tracking platform engineered specifically for **mining safety systems**, **hazard mitigation equipment**, and **regulatory compliance contracts** (MSHA, OSHA, ISO 45001, AS/NZS 4801).

---

## 🌐 Live Permanent Preview Link

**URL:** [https://mining-safety-crm.surge.sh](https://mining-safety-crm.surge.sh)

---

## 🚀 Key Features

### 1. User Registration & Multi-Representative System
* **Representative Registration:** Self-service registration for mining safety account executives and technical hazard advisors.
* **Fields Captured:** Name, work email, phone/radio, territory, role, sales quota ($), commission rate (%), and hazard expertise bio.
* **Interactive Rep Switcher:** Switch between active reps (*Marcus Vance, Elena Rostova, David Chen, Amara Okafor, Liam Gallagher*) or any newly registered user with instantaneous local persistence.

### 2. Comprehensive Sales & Pipeline Tracking
* **Scope Toggle:** Switch between **"My Sales"** (current representative view) and **"Entire Team"** (organization-wide view).
* **Multi-Stage Mining Safety Pipeline:**
  1. Discovery & Site Intro
  2. Hazard Audit & Assessment
  3. Safety Proposal & Spec RFP
  4. MSHA / OSHA Compliance Review
  5. Contract & Pilot Trial
  6. Closed Won (Deployed & Operational) — *with celebration confetti*
  7. Closed Lost
* **Interactive Kanban Board:** Move opportunities across stages with live recalculation of win probabilities and stage totals.
* **Filterable & Exportable Records Grid:** Sortable table view with multi-attribute filtering (stage, rep, category) and one-click **CSV export**.

### 3. Safety Compliance & Inspection Auditing
* **Site Audit Checklist:** 6-point compliance verification checklist attached to every deal:
  - Site Hazard & Gas Audit
  - Atmospheric Safety Baseline
  - MSHA / OSHA Regulatory Review
  - Mine Rescue Protocol Alignment
  - Mine Site Chief Engineer Signoff
  - Safety Officer Field Trial
* **Activity & Timeline Logger:** Record site visits, sensor calibrations, regulator hearings, and audit notes.

### 4. Leaderboard & Quota Performance
* **Real-time Quota Tracking:** Visual progress bars showing quota attainment percentage against individual targets.
* **Commission Calculator:** Automatic commission payout estimation based on contracted closed-won deals and individual commission percentages.
* **Rep Drill-down:** Click any representative to inspect their specific active deals and safety certifications.

### 5. Industrial Safety Solutions Catalog
* Pre-engineered commercial packages ready for 1-click quoting:
  - Atmospheric & Gas Detection (e.g. *MineGuard-9000*)
  - Underground Blast & Refuge Shelters (e.g. *TitanShield Subterranean Pods*)
  - Geotechnical Hazard & Slope Radar (e.g. *GeoSentry 3D Radar*)
  - Smart PPE & Biometric Wearables (e.g. *SafeMiner Headgear*)
  - Dust Suppression & Ventilation Systems (e.g. *AeroMist Ultrasonic Rings*)
  - Conveyor & Machinery Safety Interlocks (e.g. *ApexInterlock E-Stop Grid*)

---

## 🛠️ Technology Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite 6
* **Styling:** Tailwind CSS v4 (Strict high-contrast Light Theme)
* **Icons:** Lucide React
* **Effects:** Canvas Confetti
* **State & Persistence:** React Context + `localStorage`
* **Hosting:** Surge.sh

---

## 💻 Local Setup & Development

When cloning to a new machine:

```bash
# 1. Clone the repository
git clone https://github.com/vaibhavdubey61/mining-safety-crm.git
cd mining-safety-crm

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📄 License

MIT License. Designed and developed for Mining Safety and Hazard Management teams.
