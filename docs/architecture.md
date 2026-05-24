# Architecture Documentation

## System Overview

The SEO AI SaaS Platform is built with a modern microservice-oriented architecture, separating concerns between frontend and backend, with specialized AI agents handling different SEO domains.

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages | Components | Hooks | Context | Styles      │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API (Axios)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               FastAPI Backend Server                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │ API Router Layer                                   │    │
│  │  ├─ /seo      → SEO Audit                          │    │
│  │  ├─ /ai       → AI Recommendations                 │    │
│  │  ├─ /keywords → Keyword Analysis                   │    │
│  │  ├─ /analytics → Analytics Data                    │    │
│  │  └─ /competitors → Competitor Analysis             │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Services & Business Logic                          │    │
│  │  ├─ SEO Audit Service                              │    │
│  │  ├─ Keyword Generation Service                     │    │
│  │  ├─ Gemini AI Service                              │    │
│  │  ├─ Google Search Console Service                  │    │
│  │  └─ Lighthouse Service                             │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │ AI Agents Layer                                    │    │
│  │  ├─ Keyword Agent                                  │    │
│  │  ├─ Content Agent                                  │    │
│  │  ├─ Competitor Agent                               │    │
│  │  ├─ SEO Audit Agent                                │    │
│  │  ├─ Prediction Agent                               │    │
│  │  └─ Orchestrator                                   │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐     ┌──────────────┐  ┌──────────┐
   │ Gemini  │     │ Google APIs  │  │Database  │
   │  API    │     │ (Search Cons)│  │ (TBD)    │
   └─────────┘     └──────────────┘  └──────────┘
```

## Layer Architecture

### 1. Frontend Layer (React + Vite)

**Location:** `/frontend`

**Responsibilities:**
- User interface and interactions
- Data visualization with Recharts
- State management with React Context API
- API communication via Axios

**Key Components:**
```
src/
├── components/
│   ├── dashboard/        # Dashboard widgets
│   ├── keywords/         # Keyword research UI
│   ├── seo/             # SEO audit interface
│   ├── competitors/     # Competitor analysis
│   ├── analytics/       # Real-time analytics
│   └── charts/          # Data visualization
├── pages/
│   ├── Dashboard.jsx
│   ├── Keywords.jsx
│   ├── SEOAudit.jsx
│   ├── Competitors.jsx
│   └── Settings.jsx
├── hooks/               # Custom React hooks
├── context/             # Global state
└── api/                # API client
```

**Technology Stack:**
- React 19 - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Recharts - Data visualization
- Lucide React - Icons
- Axios - HTTP client
- React Router - Navigation

---

### 2. Backend API Layer (FastAPI)

**Location:** `/backend/app`

**Responsibilities:**
- Request routing and validation
- Business logic coordination
- External API integration
- Error handling and logging

**Structure:**
```
app/
├── main.py              # App initialization
├── api/
│   └── routes/
│       ├── seo.py
│       ├── keywords.py
│       ├── ai.py
│       ├── analytics.py
│       ├── competitors.py
│       └── auth.py
├── services/            # Business logic
├── agents/              # AI agents
├── models/              # Data models
├── core/                # Configuration
└── utils/               # Helper functions
```

**Technology Stack:**
- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- Python-dotenv - Environment management

---

### 3. Services Layer

**Location:** `/backend/app/services`

**Core Services:**

#### SEO Audit Service
- Website crawling and analysis
- Performance metrics collection
- SEO compliance checking
- Report generation

#### Keyword Service
- Keyword generation
- Trend analysis
- Search volume estimation
- Competition analysis

#### Gemini AI Service
- AI prompt generation
- Content recommendations
- SEO suggestions
- Natural language processing

#### Google Integration Services
- Search Console data fetching
- Ranking tracking
- Query analysis
- Backlink monitoring

#### Lighthouse Service
- Performance auditing
- Accessibility checking
- Best practices validation
- SEO recommendations

---

### 4. AI Agents Layer

**Location:** `/backend/app/agents`

**Agent Types:**

#### Keyword Agent
- Generates keyword strategies
- Identifies long-tail opportunities
- Analyzes search intent
- Predicts keyword trends

#### Content Agent
- Content optimization recommendations
- Topic cluster generation
- Gap analysis
- Writing suggestions

#### Competitor Agent
- Competitor tracking
- Market positioning analysis
- Benchmarking
- Opportunity identification

#### SEO Audit Agent
- Website analysis
- Issue identification
- Priority ranking
- Action recommendations

#### Prediction Agent
- Traffic forecasting
- Ranking predictions
- Trend analysis
- Performance estimation

#### Orchestrator Agent
- Coordinates multi-agent workflows
- Manages execution flow
- Aggregates results
- Handles failures

---

### 5. Data Models Layer

**Location:** `/backend/app/models`

**Data Models:**
```python
├── user.py          # User accounts
├── project.py       # Projects/websites
├── keywords.py      # Keyword data
├── competitor.py    # Competitor data
├── seo_report.py    # SEO reports
└── analytics.py     # Analytics data
```

---

### 6. Core Configuration Layer

**Location:** `/backend/app/core`

**Configuration Files:**
- `config.py` - Application settings
- `database.py` - Database connections
- `security.py` - Authentication/authorization
- `logging.py` - Logging configuration

---

## Data Flow

### Keyword Analysis Flow

```
1. Frontend (GET /keywords/analysis?keyword=...)
   │
   ├─→ Keyword Router
   │
   ├─→ Keywords Service (get_keyword_data)
   │
   ├─→ Gemini AI Service
   │   ├─ Construct prompt
   │   ├─ Call Gemini API
   │   └─ Parse response
   │
   └─→ Response (formatted keywords)
       │
       └─→ Frontend (Display results)
```

### SEO Audit Flow

```
1. Frontend (GET /seo/audit?url=...)
   │
   ├─→ SEO Router
   │
   ├─→ SEO Audit Service
   │   ├─ Fetch website
   │   ├─ Lighthouse audit
   │   ├─ Parse HTML
   │   ├─ Check SEO elements
   │   └─ Compile report
   │
   ├─→ SEO Audit Agent (generate recommendations)
   │
   └─→ Response (audit results + recommendations)
       │
       └─→ Frontend (Display audit report)
```

### AI Recommendations Flow

```
1. Frontend (POST /ai/recommendations)
   │
   ├─→ AI Router
   │
   ├─→ Gemini AI Service
   │   ├─ Aggregate input data
   │   ├─ Create SEO-focused prompt
   │   ├─ Call Gemini API
   │   └─ Parse recommendations
   │
   ├─→ Content Agent (validates & enhances)
   │
   └─→ Response (recommendations)
       │
       └─→ Frontend (Display recommendations)
```

---

## External Integrations

### Google Generative AI (Gemini)
- **Purpose:** AI-powered recommendations and analysis
- **Rate Limits:** As per Google API quotas
- **Authentication:** API Key in environment variables
- **Endpoints Used:**
  - `generateContent()` - Text generation

### Google Search Console (Optional)
- **Purpose:** Search data and query analysis
- **Endpoints:** Search analytics, Query insights
- **Authentication:** OAuth 2.0

### Lighthouse (Built-in)
- **Purpose:** Performance and SEO auditing
- **Integration:** Python bindings
- **Metrics:** Performance, Accessibility, Best Practices, SEO

---

## Security Architecture

### API Security
- CORS enabled for frontend communication
- Environment variables for sensitive data
- Input validation with Pydantic
- Error handling without exposing internals

### API Key Management
- Stored in `.env` (never committed)
- Loaded at startup
- Validated before use
- Fails gracefully if missing

### Frontend Security
- HTTPS in production
- No sensitive data in localStorage
- API requests include CORS headers
- Environment-based API URLs

---

## Deployment Architecture

### Development
- Local FastAPI server (http://localhost:8000)
- Local Vite dev server (http://localhost:5173)
- Hot reloading enabled

### Production
- Docker containerization
- Nginx reverse proxy
- Environment variables for configuration
- SSL/TLS termination

---

## Performance Considerations

### Caching
- API response caching for expensive operations
- Frontend state management with Context API
- Service worker caching (optional)

### Optimization
- Database query optimization
- Lazy loading in frontend
- Code splitting in Vite
- Compression for API responses

### Scalability
- Stateless API design
- Horizontal scaling ready
- Load balancer support
- Cache layer support

---

## Monitoring & Logging

### Backend Logging
- Structured logging to files
- API request/response logging
- Error tracking and reporting
- Performance metrics

### Frontend Monitoring
- Console error tracking
- API call monitoring
- User action logging
- Performance profiling

---

## Database Schema (Future)

```
Users
├─ id
├─ email
├─ password_hash
├─ created_at
└─ updated_at

Projects
├─ id
├─ user_id → Users.id
├─ url
├─ name
└─ created_at

Keywords
├─ id
├─ project_id → Projects.id
├─ keyword
├─ volume
├─ difficulty
└─ last_updated

SEO Reports
├─ id
├─ project_id → Projects.id
├─ score
├─ issues (JSON)
├─ recommendations (JSON)
└─ created_at

Competitors
├─ id
├─ project_id → Projects.id
├─ url
├─ analysis_data (JSON)
└─ last_updated
```

---

## API Routes Hierarchy

```
/
├── GET /              (Health check)
├── /seo
│   └── GET /audit     (Perform SEO audit)
├── /ai
│   └── POST /recommendations (Get AI recommendations)
├── /keywords
│   └── GET /analysis  (Analyze keywords)
├── /analytics
│   └── GET /metrics   (Get analytics data)
└── /competitors
    └── GET /analyze   (Analyze competitors)
```

---

## Error Handling Strategy

### Frontend Errors
1. Try-catch blocks for API calls
2. User-friendly error messages
3. Fallback UI states
4. Error logging to console

### Backend Errors
1. Exception handling in routes
2. Structured error responses
3. HTTP status code mapping
4. Detailed logging for debugging

---

## Extensibility Points

### Adding New Features
1. Create service in `/services`
2. Create agent in `/agents` (if AI-powered)
3. Create routes in `/api/routes`
4. Create frontend components
5. Integrate with existing services

### Adding New APIs
1. Create service for external API
2. Add authentication in core/security
3. Create wrapper service
4. Use in agents/services

---

## Technology Choices Rationale

| Technology | Reason                                     |
|------------|-------------------------------------------|
| FastAPI   | High-performance, async support, auto docs|
| React     | Component-based, large ecosystem          |
| Vite      | Lightning-fast development experience     |
| Gemini AI | Advanced capabilities, cost-effective     |
| Tailwind  | Utility-first, highly customizable        |
| Recharts  | Simple yet powerful data visualization    |

---

See [API Documentation](api_docs.md) for endpoint details and [Deployment Guide](deployment.md) for production setup.
