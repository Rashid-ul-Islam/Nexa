# Opportunity Finder

A student-focused opportunity intelligence and application-planning platform built with Node.js, Express 5, React, and MongoDB Atlas.

---

## 1. Project Overview

Opportunity Finder helps students discover, evaluate, and track academic and professional opportunities:
- **Opportunity Intelligence:** Structured metadata for internships, jobs, scholarships, hackathons, research positions, competitions, fellowships, grants, and conferences.
- **Explainable Matching:** Clear, rule-based matching score comparing student profiles to opportunity requirements.
- **Trust & Freshness:** Explicit verification badges and tracking of how recently listings were checked.
- **Application Tracking:** Kanban-style tracking from saved to applied and interviewed.
- **Deadline-First Engine:** Proactive reminders and urgency dashboard preventing missed deadlines.

---

## 2. Tech Stack

- **Backend:** Node.js (v22+ LTS), Express 5, Mongoose 8+, Zod, JWT, bcryptjs (Native ES Modules, plain JavaScript)
- **Frontend:** React 19, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router, Lucide Icons
- **Database:** MongoDB Atlas (M0 free cluster)
- **Architecture:** Conventional monolith with strict layer separation:
  `Route -> Middleware -> Validator -> Controller -> Service -> Repository -> Model`

---

## 3. Prerequisites

- **Node.js:** v22 LTS or newer (check with `node -v`)
- **npm:** v10 or newer (check with `npm -v`)
- **MongoDB Atlas:** Free cluster with databases:
  - `opportunity_finder_dev` (development)
  - `opportunity_finder_e2e` (end-to-end tests)
  - `opportunity_finder_prod` (production)

---

## 4. Getting Started

### Backend Setup
1. Open terminal in the backend directory:
   ```bash
   cd backend
   ```
2. Copy environment template and fill in your MongoDB Atlas URI:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server (Node native watch mode):
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open terminal in the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server (Vite):
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` and automatically proxies `/api` requests to backend on port `4000`.
