# Base44 Dev Environment

## Project Overview
Full-stack SEO SaaS platform ("VISIORAX PROJECT by RigVisionX Technology™").
- **Frontend**: Vite + React + Tailwind CSS in `frontend/` (dev server on port 5173, mapped to host 3000)
- **Backend**: FastAPI + SQLite (aiosqlite) in `backend/` (uvicorn on port 8000)
- **Database**: SQLite file at `backend/seo_platform.db` (tables auto-created via `init_db_async.py`)

## Architecture
- Frontend and backend run as separate compose services (separate origins).
- Frontend connects to backend via `VITE_API_URL` env var (set in compose to `https://8000-${BASE44_PUBLIC_HOST_SUFFIX}/api`).
- Backend has CORS `allow_origins=["*"]` (already in code).
- Auth uses JWT tokens stored in localStorage (no cookies), so separate origins work fine.

## Setup
```bash
docker compose -f docker-compose.base44.yml up -d --build
```

## Key Files
- `docker-compose.base44.yml` — dev compose (bind-mounts source, live reload)
- `backend/Dockerfile.base44` — builds Python deps into image (source bind-mounted at runtime)
- `backend/requirements.base44.txt` — trimmed deps (excludes heavy ML packages not imported by the app: prophet, cmdstanpy, scikit-learn, scipy, pandas, numpy, matplotlib)
- `.base44/environment.json` — metadata and secrets list

## External API Keys (all optional — app boots without them)
The AI/SEO features require external API keys. The app starts fine without them; endpoints that need a missing key return an error at call time.
- `OPENAI_API_KEY` — AI chat, content generation, strategy
- `DEEPSEEK_API_KEY` — DeepSeek chat completions
- `GEMINI_API_KEY` / `GEMINI_API_KEY_BACKUP` — Google Gemini AI
- `OPENROUTER_API_KEY` — OpenRouter model routing
- `SERPAPI_KEY` — search engine results
- `PAGESPEED_API_KEY` — Google PageSpeed Insights

Secrets are delivered via `/run/base44/app.env` (wired in compose as the last `env_file`).

## Verification
- Backend health: `curl http://localhost:8000/` → `{"message":"SEO AI Backend Running"}`
- Frontend health: `curl http://localhost:5173/` → HTML page
- Preview: `https://3000-${BASE44_PUBLIC_HOST_SUFFIX}`

## Notes
- `frontend/seo-saas-platform/` is a separate/duplicate sub-project — the active frontend is `frontend/` (root package.json).
- `frontend/dist/` contains a prebuilt bundle — not used; dev server serves live source.
- The backend `Dockerfile` (empty) is the original; `Dockerfile.base44` is the Base44 build file.
- Playwright is installed but browsers are not — the deep audit screenshot feature won't work without `playwright install` + system deps.
