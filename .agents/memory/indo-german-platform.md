---
name: Indo German Mobility Corridor Platform
description: Full-stack India→Germany skilled migration platform — auth, AI, DB schema, all stakeholder pages, demo flow.
---

## Platform Name
"Indo German" (NOT MobiCorridor anywhere)

## Auth Pattern
- Token: `Buffer.from(userId + ':' + timestamp).toString('base64')` — stored as `mobility_user` in localStorage: `{ user, token }`
- All axios calls use `axios.defaults.headers.common['Authorization'] = 'Bearer ' + token` (set in AuthContext on login + restore)
- AuthContext exports `getToken()` helper
- Demo password for all accounts: `Demo@1234`

## Demo Credentials
| Role | Email |
|------|-------|
| Candidate (Arjun - Mechanic) | arjun.sharma@gmail.com |
| Candidate (Priya - Nurse) | priya.nair@gmail.com |
| Candidate (Ravi - Electrician) | ravi.kumar@gmail.com |
| Employer (Bosch) | hr@bosch-germany.de |
| Employer (BerlinCare) | jobs@carehome-berlin.de |
| Trainer (Goethe) | admin@goethe-pune.in |
| Facilitator | ops@indiagermanyjobs.in |
| Government | official@msde.gov.in |
| Admin | admin@mobicorridor.in |

## Color System (current — dark purple premium)
- BG: #0F0520 (deep navy-purple)
- CARD: #1A0B3B
- CARD2: #130828
- ACCENT: #A855F7 (purple)
- SUCCESS: #00C853
- PURPLE: #C084FC
- TEXT2: #C4B5FD

## Landing Page Architecture (current)
- Two-panel: left hero, right login
- Right panel: 2 cards ONLY — Arjun demo card + "New to Germany?" AI onboarding card
- Manual email/password login is collapsed behind a toggle (no role-selector grid)
- Demo login errors shown ABOVE the toggle (always visible)
- Trust badges at bottom: MSDE Aligned, FOSA Verified, GDPR Compliant
- Arjun auto-login: POST /api/auth/login with arjun.sharma@gmail.com / Demo@1234

## AIOnboarding — 10 Questions
Questions: name, age, education, occupation, experience, city, germanLevel, hasPassport, sector, motivation
- Full conversation history displayed (all previous Q&A pairs, not just last 2)
- `{name}` AND `{occupation}` placeholders replaced in question text
- autoFill for hasPassport must match exact select option string: 'Yes, valid passport'
- Result screen CTA: "Sign In to Platform →" routes to '/'
- Result screen: FlightCountdownBanner + readiness score + roadmap + German Lebenslauf download

## Government Dashboard
- Header: "Government of Maharashtra" (NOT "Ministry of Skill Development")
- Subtitle: "Indo-German Mobility Command Center · Real-time analytics"

## Nav Labels (DashboardLayout.tsx)
- Candidate sidebar: "Mentor Network" (NOT "Network") for /candidate/network route

## AI Routes (GROQ llama-3.1-8b-instant)
- POST /api/ai/onboarding — full AI onboarding, generates readinessScore, roadmap[], estimatedTimeline, germanResume, keyStrengths
- POST /api/ai/chat → intelligent responses by keyword matching
- POST /api/ai/resume-suggest → German Lebenslauf + translation
- POST /api/ai/gap-analysis

**Why:** GROQ_API_KEY is wired; fallback rule-based if key absent.

## DB Schema Tables (14 total)
users, candidates, employers, vacancies, applications, documents, recognition_cases, enrollments, batches, courses, visa_cases, interviews, offers, welfare_tickets, notifications, certifications

## Frontend Pages (all wired in App.tsx — zero Placeholders)
Candidate: dashboard, roadmap (AI), resume (AI), journey, readiness, documents, certifications, training, recognition, applications, visa, welfare, profile, network
Employer: dashboard, vacancies, matches (/:id/matches), applications, interviews, offers, profile
Trainer: dashboard, courses, batches, students
Facilitator: dashboard, candidates, recognition, visa, welfare
Government: dashboard, pipeline
Admin: dashboard, candidates, employers, documents

## Academy Course Link
All training "Go to Course" buttons link to: https://academy.koutuhal.in/account/login

## AIOnboarding Flight Animation
- `FlightCountdownBanner` component added to result screen
- Parses months from `estimatedTimeline` string (e.g. "14–18 months" → 16)
- Animated plane flies across India→Germany path with milestones
- Color coded: green ≤8 months, amber ≤14, purple >14

## Global Components
- `AIChatPopup.tsx` — floating bottom-right, calls /api/ai/chat, streaming-style dots loader, suggestion chips, navigable links
- `CandidateProfileCard.tsx` — universal slide-out for all stakeholders

## Key packages in mobility-platform
axios, date-fns (both installed as deps)

## Pre-existing TypeScript Errors (not introduced by Phase 2)
- TS6305 on api-client-react dist: pre-existing, does not affect runtime (Vite doesn't use tsc for bundling)
- Implicit `any` in facilitator/trainer pages: pre-existing, low severity
