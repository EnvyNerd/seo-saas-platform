# PROJECT JOURNAL

## SEO - AI Powered SaaS Platform

**Student:** Witschi B. Mihan  
**Programme:** Diploma in Information Technology  
**Project Duration:** June 2026 – Recently  
**Supervisor:** N/A  
**Repository:** https://github.com/EnvyNerd/seo-saas-platform

---

## A. Information Extracted

From the repository and codebase review:

- **Project Title:** SEO - AI Powered SaaS Platform
- **Type:** Software / Web Application / AI-assisted SaaS
- **Stack:** FastAPI (Python backend), React + Vite (frontend), Tailwind CSS, SQLite via async SQLAlchemy, REST API
- **AI Component:** Google Gemini integration via backend agents/orchestrator
- **Core Features Present:** User authentication (register/login), Dashboard, SEO audit, Keyword generator, Content generator, Competitors/analytics modules, Backend CLI tooling
- **Development Evidence:** Backend models for User, Project, SEOReport, KeywordResearch, CompetitorAnalysis; Backend routes for auth, SEO, AI, keywords, content, analytics, competitors, deepseek; Frontend pages for Login, Register, Dashboard, SEOAudit, KeywordGenerator, ContentGenerator, Settings; Recent fixes applied for bcrypt/passlib compatibility, form-encoded login, blank dashboard routing

## B. Missing Information

- Exact project duration / milestone dates — `[TO CONFIRM]`
- Supervisor name and any meeting notes/comments — `[TO CONFIRM]`
- Project proposal document — `[TO CONFIRM]`
- Project report / final write-up — `[TO CONFIRM]`
- Screenshots of the working system — `[TO CONFIRM]`
- Specific test results or user testing evidence — `[TO CONFIRM]`
- Chosen development methodology and rationale — `[TO CONFIRM]`
- Deployment environment / hosting — `[TO CONFIRM]`
- Non-functional requirements document — `[TO CONFIRM]`
- Known intentionally deferred issues — `[TO CONFIRM]`

## C. Proposed Journal Timeline

| Week | Focus Area | Evidence Basis |
|------|-----------|----------------|
| 1 | Project introduction, problem identification, objectives | Prompt metadata, repo start |
| 2 | Requirements analysis, technology selection | Final stack present in code |
| 3 | System design, database schema, UI/UX planning | Models and routes present |
| 4 | Backend environment setup and core structure | FastAPI app, database, config files |
| 5 | Frontend setup, routing, auth scaffolding | React/Vite app, router, AuthContext |
| 6 | Core feature development | SEOAudit, KeywordGenerator, ContentGenerator pages |
| 7 | AI/agent integration | Orchestrator and agent modules |
| 8 | Testing and bug fixing | Auth/password bug found and fixed |
| 9 | UI improvements and dashboard | Dashboard rebuilt and simplified |
| 10 | Finalization | Build verification and cleanup |

---

# PROJECT JOURNAL

## Week 1 — Project Introduction and Planning

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Project briefing and topic selection

**Objective:**
Identify a relevant final-year project topic and define what the system should do.

**Work Completed:**
- Reviewed project requirements for the Diploma in Information Technology programme.
- Chose an AI-powered SEO SaaS platform as the topic because it combines web development, API design, and AI automation.
- Wrote initial objectives around automated SEO analysis, keyword generation, and content assistance.

**Technical Details:**
- Considered Python-based backend options for API and AI integration.
- Chose React for the frontend to allow a modular, responsive UI.

**Problem / Challenge:**
- Narrowing the scope so the project is achievable within the programme timeline.

**Solution / Action Taken:**
- Defined a minimum viable feature set: authentication, SEO audit, keyword research, and content generation.
- Planned to expand with analytics and competitor modules if time allowed.

**Learning / Knowledge Gained:**
- Understood how to align a software project with academic programme expectations.
- Practiced converting a broad idea into concrete feature boundaries.

**Project Progress:**
Project idea approved and initial objectives documented.

**Next Step:**
Gather detailed requirements and select specific technologies.

---

## Week 2 — Requirements Analysis

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Functional and non-functional requirements analysis

**Objective:**
List what the system must do and how it should behave.

**Work Completed:**
- Listed functional requirements: user registration/login, dashboard, SEO audit, keyword generation, content generation, and reports.
- Listed non-functional requirements: responsive UI, API reliability, simple deployment, and acceptable response times.
- Created initial user stories for student/administrator usage.

**Technical Details:**
- REST API chosen for backend-frontend communication.
- SQLite selected for local development simplicity.
- Tailwind CSS selected for rapid UI development.

**Problem / Challenge:**
- Balancing AI features with system stability and delivery risk.

**Solution / Action Taken:**
- Treated AI features as an enhancement layer over solid CRUD/API structure.
- Planned fallback behavior where AI output can be displayed even if generation is delayed.

**Learning / Knowledge Gained:**
- Learned to separate functional requirements from implementation concerns.
- Practiced writing technology-justified requirements.

**Project Progress:**
Requirements baseline established.

**Next Step:**
Design system architecture and database schema.

---

## Week 3 — System Design

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Architecture, database design, and UI planning

**Objective:**
Create a workable blueprint before coding.

**Work Completed:**
- Designed a layered backend structure: routes, services/models, core configuration, and agents.
- Designed frontend structure: pages, router, context, reusable UI components.
- Planned database entities: User, Project, SEO Report, Keyword Research, Competitor Analysis.

**Technical Details:**
- Backend: FastAPI routers grouped by domain (`/auth`, `/seo`, `/keywords`, `/content`, `/analytics`, `/competitors`).
- Frontend: React Router with protected routes and a central auth context.
- Database: SQLAlchemy ORM models with relationship planning.

**Problem / Challenge:**
- Avoiding overcomplicated UI while keeping features accessible.

**Solution / Action Taken:**
- Chose a sidebar layout with clear route grouping.
- Planned component reuse for cards, buttons, and layout containers.

**Learning / Knowledge Gained:**
- Practiced mapping features to modules.
- Learned to design data models before writing API endpoints.

**Project Progress:**
Architecture and database design documented.

**Next Step:**
Set up environments and start backend implementation.

---

## Week 4 — Environment Setup and Backend Structure

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Development environment setup and backend foundation

**Objective:**
Create a runnable backend with database and basic structure.

**Work Completed:**
- Set up FastAPI project structure.
- Created async database session handling.
- Implemented initial models for users and projects.
- Verified backend imports and basic runtime behavior.

**Technical Details:**
- Python project with `requirements.txt` dependencies.
- Async SQLAlchemy with SQLite.
- Core modules: `database.py`, model files, route stubs.

**Problem / Challenge:**
- Python environment dependency management on Windows.

**Solution / Action Taken:**
- Used project-local Python execution and verified imports with small runtime scripts.
- Focused on making `py_compile` and basic import checks pass before adding features.

**Learning / Knowledge Gained:**
- Learned how async SQLAlchemy setup differs from sync patterns.
- Practiced validating backend modules incrementally.

**Project Progress:**
Backend skeleton working and importable.

**Next Step:**
Implement authentication and frontend scaffolding.

---

## Week 5 — Frontend Setup, Routing, and Authentication

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Create the React frontend and user authentication flow

**Objective:**
Allow users to register, log in, and access protected pages.

**Work Completed:**
- Initialized React + Vite frontend.
- Implemented Tailwind CSS and base layout.
- Built login and register pages.
- Created `AuthContext` to manage token and user state.
- Set up routing with protected dashboard routes.

**Technical Details:**
- React Router for navigation.
- Axios-based API client.
- LocalStorage token persistence.

**Problem / Challenge:**
- Login requests were not accepted by the backend.

**Solution / Action Taken:**
- Inspected backend auth route expectations.
- Updated frontend login request to send form-encoded data with correct headers.
- Verified backend login endpoint manually before retesting the UI.

**Learning / Knowledge Gained:**
- Learned FastAPI OAuth2 form-encoded login requirements.
- Learned how frontend request formatting can break auth silently.

**Project Progress:**
Authentication flow functional end-to-end.

**Next Step:**
Build main dashboard and core feature pages.

---

## Week 6 — Core Feature Development

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Implement dashboard, SEO audit, keywords, and content modules

**Objective:**
Deliver the primary SaaS features in both backend and frontend.

**Work Completed:**
- Built dashboard page with KPI cards, performance trend, and quick actions.
- Implemented SEO audit page with crawl-result display and storage utilities.
- Implemented keyword generator page.
- Implemented content generator page.
- Created supporting UI components and layout wrappers.

**Technical Details:**
- Backend route modules for `/api/seo`, `/api/keywords`, `/api/content`.
- Frontend pages using reusable UI components.
- Local audit storage utilities to preserve results between navigation.

**Problem / Challenge:**
- Dashboard showed as blank after login.

**Solution / Action Taken:**
- Found that the router imported a different dashboard module and that the active dashboard file was empty.
- Replaced it with a simplified dashboard component and updated the router import.
- Rebuilt frontend to confirm the issue was resolved.

**Learning / Knowledge Gained:**
- Learned how router imports and default exports affect page visibility.
- Practiced diagnosing blank-page issues by checking route wiring.

**Project Progress:**
Core features implemented and dashboard visible.

**Next Step:**
Integrate AI/agent capabilities and improve reliability.

---

## Week 7 — AI/ML Integration

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Integrate AI assistance into the backend workflow

**Objective:**
Add intelligent analysis, recommendations, or content generation support.

**Work Completed:**
- Implemented backend orchestrator/agent modules.
- Integrated Google Gemini AI for SEO-related assistance.
- Wired AI output into relevant backend routes.

**Technical Details:**
- Backend agent architecture.
- Gemini-based orchestration for content and analysis tasks.

**Problem / Challenge:**
- `[TO CONFIRM]`

**Solution / Action Taken:**
- `[TO CONFIRM]`

**Learning / Knowledge Gained:**
- Learned how to place AI logic behind backend services instead of exposing it directly in the UI.
- Learned dependency compatibility issues with AI SDKs and password libraries.

**Project Progress:**
AI layer added to backend workflow.

**Next Step:**
Testing, bug fixing, and UI cleanup.

---

## Week 8 — Testing and Bug Fixing

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Verify login, backend security, and frontend build

**Objective:**
Confirm that authentication and build process are stable.

**Work Completed:**
- Discovered backend login returning internal errors.
- Investigated password hashing compatibility.
- Identified `passlib`/`bcrypt` mismatch causing verification failures.
- Replaced password hashing implementation with direct `bcrypt`.
- Updated frontend auth request format.
- Ran backend import checks and frontend build.

**Technical Details:**
- `bcrypt` password hashing and verification.
- FastAPI OAuth2 password flow expectations.
- Frontend `URLSearchParams` and content-type headers.

**Problem / Challenge:**
- Backend login and frontend login were both broken in different ways.

**Solution / Action Taken:**
- Switched backend hashing strategy to direct `bcrypt`.
- Rehashed user password for test account compatibility.
- Fixed frontend login request formatting.
- Ran verification checks and production build successfully.

**Learning / Knowledge Gained:**
- Learned how password library mismatches can break authentication silently.
- Learned to verify frontend build after auth-related changes.

**Project Progress:**
Authentication stabilized and build verified.

**Next Step:**
Improve dashboard clarity and finalize UI.

---

## Week 9 — UI Improvements and Dashboard Refinement

**Date:** `[TO CONFIRM]`

**Activity / Task:**
Simplify dashboard and improve frontend readability

**Objective:**
Make the main interface easier to understand and navigate.

**Work Completed:**
- Rebuilt dashboard with focused KPI cards, trend bars, quick actions, and onboarding prompt.
- Simplified sidebar navigation.
- Reduced visual clutter while keeping feature access clear.
- Verified router points to active dashboard component.

**Technical Details:**
- React component restructuring.
- Tailwind layout simplification.
- Router import correction.

**Problem / Challenge:**
- Previous dashboard was hard to read and partially blank.

**Solution / Action Taken:**
- Replaced complex dashboard with clearer layout and explicit sections.
- Rerouted home page to working dashboard file.
- Performed frontend build verification.

**Learning / Knowledge Gained:**
- Learned that component selection and routing are as important as styling.
- Learned how to improve usability by reducing unnecessary visual complexity.

**Project Progress:**
Dashboard readable and aligned with core project goals.

**Next Step:**
Final validation and documentation.

---

## Week 10 — Final Testing, Documentation, and Submission Preparation

**Date:** `[TO CONFIRM]`

**Activity / Task:**
System validation and project finalization

**Objective:**
Ensure the system is consistent and ready for submission.

**Work Completed:**
- Ran backend compilation checks.
- Verified backend models, database session, and auth flow.
- Ran frontend production build successfully.
- Confirmed router, auth context, and dashboard exports are aligned.
- `[TO CONFIRM]` Captured final screenshots.
- `[TO CONFIRM]` Prepared project report and journal.

**Technical Details:**
- Backend runtime and import verification.
- Frontend build with Vite.
- Manual functional verification of login flow.

**Problem / Challenge:**
- `[TO CONFIRM]`

**Solution / Action Taken:**
- `[TO CONFIRM]`

**Learning / Knowledge Gained:**
- Learned final validation should check routing, exports, and builds together, not just code syntax.

**Project Progress:**
System functionally validated for submission.

**Next Step:**
Submit final report, journal, and repository.

---

## Overall Project Progress

The project moved from topic selection to a working AI-assisted SEO SaaS prototype. Backend structure was created first, then frontend scaffolding and authentication, then core feature pages. AI integration was added after core features, and later debugging focused on login reliability and dashboard visibility. The final system includes authentication, SEO audit, keyword generation, content generation, dashboard analytics, and AI-backed backend services.

## Major Technical Challenges

- Password hashing compatibility issue affecting login.
- Frontend sending login data in an unsupported format.
- Dashboard routing mismatch causing a blank homepage.
- Backend and frontend dependency management on Windows.
- AI integration stability after core features were built.

## Key Skills Developed

- FastAPI backend design and async database handling
- React routing and authentication state management
- REST API integration between frontend and backend
- Debugging auth flows and build issues
- Writing academic project documentation
- Using AI services within a structured backend architecture

## Lessons Learned

- Small request-format mismatches can block an entire feature.
- Router imports and default exports must be kept consistent.
- Backend security changes should be tested with real login requests, not only unit checks.
- UI clarity matters more than visual complexity for dashboards.

## Future Improvements

- Persistent user/project data across sessions beyond local SQLite
- More robust audit history and export features
- Improved error handling and user feedback messages
- Deployment configuration for production hosting
- Expanded AI-assisted recommendations and reporting

---

| Week | Date | Main Activity | Main Outcome | Challenges |
|------|------|---------------|--------------|------------|
| 1 | `[TO CONFIRM]` | Project introduction and planning | Topic and objectives defined | Scope control |
| 2 | `[TO CONFIRM]` | Requirements analysis | Feature list and tech selection documented | Feature prioritization |
| 3 | `[TO CONFIRM]` | System design | Architecture and database schema planned | Design simplicity |
| 4 | `[TO CONFIRM]` | Backend setup | Runnable FastAPI backend and models created | Windows environment setup |
| 5 | `[TO CONFIRM]` | Frontend and auth | Login, routing, and protected routes working | Backend-frontend auth mismatch |
| 6 | `[TO CONFIRM]` | Core feature development | Dashboard, audit, keywords, and content pages built | Blank dashboard issue |
| 7 | `[TO CONFIRM]` | AI integration | Gemini-based backend agents added | `[TO CONFIRM]` |
| 8 | `[TO CONFIRM]` | Testing and bug fixing | Login stabilized and backend build verified | Password library conflict |
| 9 | `[TO CONFIRM]` | UI refinement | Simplified dashboard and navigation | Readability and routing |
| 10 | `[TO CONFIRM]` | Final validation | Backend and frontend checks passed | `[TO CONFIRM]` |
