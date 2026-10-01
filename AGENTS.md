# Base44 Dev Environment

## Architecture

Full-stack SEO SaaS platform ("VISIORAX PROJECT by RigVisionX Technology™"):
- **Frontend**: Vite 6 + React 19 + Tailwind CSS, served on host port 3000 (Vite dev server on 5173)
- **Backend**: FastAPI + uvicorn (async, `--reload`) on host port 8000, SQLite via aiosqlite (file-based, no DB service)

## Running

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Frontend depends on backend being healthy before starting.

## Key Setup Details

- **Backend deps** are baked into the `backend/Dockerfile.base44` image (pip install from `requirements.txt`); source is bind-mounted at `/app` so edits are live with uvicorn `--reload`.
- **Frontend deps** are installed on startup via `npm ci` (node_modules is bind-mounted from the repo; `npm ci` ensures Linux-platform binaries like esbuild are correct).
- **Frontend→Backend**: separate origins. The frontend's axios client reads `VITE_API_URL` (set to `https://8000-<public-suffix>/api` in compose). Backend CORS is `allow_origins=["*"]`.
- **Vite host allowlist**: `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed bare (no value) so the platform supplies the sandbox-domain wildcard; do NOT override it with the public suffix.
- **Database**: SQLite file at `backend/seo_platform.db`; tables created on startup via `python init_db_async.py` (idempotent `create_all`).

## The Build Fix

`requirements.txt` pinned `playwright==1.42.0`, which requires `greenlet==3.0.3` exactly, conflicting with the pinned `greenlet==3.5.0`. Upgraded to `playwright==1.63.0` (requires `greenlet>=3.1.1,<4.0.0`), resolving the conflict.

## External API Keys (all optional)

The backend gracefully handles missing keys: `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `SERPAPI_KEY`, `PAGESPEED_API_KEY`. No secrets are required to boot. `SECRET_KEY` and `DATABASE_URL` have dev defaults.

## Verification

- Backend health: `curl http://localhost:8000/` → `{"message":"SEO AI Backend Running"}`
- Frontend health: `curl http://localhost:3000/` → Vite-served HTML with live `/src/main.jsx`
- Preview: landing page at `/` renders the hero ("Rank higher with AI-driven SEO workflows") with no console errors.
