# SEO AI SaaS Platform

A full-stack SEO platform combining deep audits, AI-driven strategy, and a modern dashboard.

## Stack
- Frontend: Vite + React + Tailwind
- Backend: FastAPI + SQLite
- Features: SEO audit, keyword intelligence, competitor analysis, content generation, AEO/GEO analysis, strategy orchestration, and AI chat

## What's Done
- Rebranded to **VISIORAX PROJECT by RigVisionX Technology™**
- Implemented auth flow with post-signin redirect to `/app`
- Added deep audit engine with screenshot capture
- Built AI services: strategy, recommendations, schema, chat, humanizer, content generation
- Added reports route and dashboard report loading path
- Restored `/app/keywords` feature page and fixed dashboard latest-audit routing
- Wired strategy cards to working feature routes:
  - Explore Keywords -> `/app/keywords`
  - Analyze Rivals -> `/app/competitors`
  - View Full Audit -> `/app/audit-details`
- Verified frontend build

## Next Plan
- Add pricing/plans page
- Add checkout/upgrade flow
- Gate premium features by subscription status
- Persist subscription state and enforce access in backend API
- Complete deployment readiness after payments are in place

## Run
- Backend: use existing `backend\venv` and run uvicorn for `app.main:app`
- Frontend: `npm run dev` in `frontend`
- Env: configure API keys in backend `.env`
