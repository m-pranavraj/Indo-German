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

## Color System
- Navy: #0F1B35 (sidebar, headers)
- Gold/Amber: #D97706 (accents, CTA, AI)
- Steel Blue: #1E3A5F (card backgrounds)
- Emerald: #059669 (success)
- No purple, no neon — professional

## AI Routes (no API key needed — rule-based)
- POST /api/ai/chat → pre-scripted intelligent responses by keyword matching; returns `{ response, suggestions, links }`
- POST /api/ai/roadmap → personalized journey roadmap with phases, costs (INR+EUR), timeline
- POST /api/ai/resume-suggest → occupation-specific resume improvements + ATS score
- GET /api/geo/states → 20 Indian states with district lists

**Why:** All AI works without any API key for demo purposes — rule-based logic in `artifacts/api-server/src/routes/ai.ts`

## DB Schema Tables (14 total)
users, candidates, employers, vacancies, applications, documents, recognition_cases, enrollments, batches, courses, visa_cases, interviews, offers, welfare_tickets, notifications, certifications

## Frontend Pages (all wired in App.tsx — zero Placeholders)
Candidate: dashboard, roadmap (AI), resume (AI), journey, readiness, documents, certifications, training, recognition, applications, visa, welfare, profile
Employer: dashboard, vacancies, matches (/:id/matches), applications, interviews, offers, profile
Trainer: dashboard, courses, batches, students
Facilitator: dashboard, candidates, recognition, visa, welfare
Government: dashboard, pipeline
Admin: dashboard, candidates, employers, documents

## Global Components
- `AIChatPopup.tsx` — floating bottom-right, calls /api/ai/chat, streaming-style dots loader, suggestion chips, navigable links
- `CandidateProfileCard.tsx` — universal slide-out for all stakeholders

## Key packages in mobility-platform
axios, date-fns (both installed as deps)
