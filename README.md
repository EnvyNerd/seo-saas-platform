# SEO AI SaaS Platform

A full-stack SEO platform combining deep audits, AI-driven strategy, and a modern dashboard.

## 📋 Project Overview

**VISIORAX PROJECT by RigVisionX Technology™** is an enterprise-grade SEO Intelligence Platform designed to help businesses dominate search engine rankings through AI-powered analysis and actionable insights.

### What This Project Does

The SEO SaaS Platform provides a comprehensive suite of tools for SEO professionals and marketing teams:

- **Deep SEO Audits** - Automated website crawling and analysis with screenshot capture to identify technical SEO issues, on-page optimization opportunities, and performance metrics
- **AI-Driven Strategy** - Intelligent recommendations powered by advanced AI models that adapt to your website's unique needs and competitive landscape
- **Keyword Intelligence** - Discover high-value keywords, analyze search intent, and track keyword rankings with real-time data
- **Competitor Analysis** - Benchmark your site against competitors, uncover their strategies, and identify market gaps
- **Content Generation** - AI-powered content creation optimized for SEO and user engagement with humanization capabilities
- **AEO/GEO Analysis** - Optimize for answer engine optimization and geographic search visibility
- **Strategy Orchestration** - Unified platform to coordinate and execute multi-faceted SEO strategies
- **AI Chat Assistant** - Real-time support and guidance for SEO questions and optimization recommendations

### Tech Stack

- **Frontend**: Vite + React + Tailwind CSS (56.9% JavaScript)
- **Backend**: FastAPI + SQLite (38.6% Python)
- **Styling**: Tailwind CSS (4.3% CSS)
- **Architecture**: Full-stack SaaS with real-time audit capabilities

## ✅ What's Done

- Rebranded to **VISIORAX PROJECT by RigVisionX Technology™**
- Implemented auth flow with post-signin redirect to `/app`
- Added deep audit engine with screenshot capture
- Built comprehensive AI services: strategy, recommendations, schema, chat, humanizer, content generation
- Added reports route and dashboard report loading path
- Restored `/app/keywords` feature page and fixed dashboard latest-audit routing
- Wired strategy cards to working feature routes:
  - Explore Keywords → `/app/keywords`
  - Analyze Rivals → `/app/competitors`
  - View Full Audit → `/app/audit-details`
- Verified frontend build

## 🚀 Next Plan

- Add pricing/plans page with multiple subscription tiers
- Add checkout/upgrade flow with payment processing
- Gate premium features by subscription status
- Persist subscription state and enforce access in backend API
- Complete deployment readiness after payments are in place
- Enhanced analytics dashboard for campaign tracking
- API documentation and client integration guides

## 🛠️ Run Locally

**Backend Setup:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

**Configuration:**
- Copy `.env.example` to `.env` in the backend directory
- Configure API keys for AI services (OpenAI, etc.)
- Update database connection strings if needed

## 📦 Key Features

- **Real-time Audit Reports** - Get instant insights on website performance
- **AI-Powered Recommendations** - Personalized optimization strategies
- **Competitive Intelligence** - Stay ahead of market trends
- **Scalable Architecture** - Built for enterprise-level usage
- **User-Friendly Dashboard** - Intuitive interface for all skill levels

