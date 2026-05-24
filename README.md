# SEO AI SaaS Platform

A comprehensive AI-powered SEO optimization platform combining advanced keyword research, competitive analysis, content recommendations, and SEO auditing capabilities.

## 🚀 Features

- **AI-Powered Keyword Research** - Generate long-tail keywords, semantic variations, and trending SEO phrases
- **SEO Audit & Analysis** - Comprehensive website audits with actionable recommendations
- **Competitor Intelligence** - Monitor and analyze competitor strategies
- **Content Recommendations** - AI-driven content suggestions for SEO optimization
- **Real-time Analytics** - Track performance metrics and KPIs
- **Integrated AI Agents** - Specialized AI agents for different SEO domains
- **CLI Tool** - Execute SEO tasks directly from your terminal

## 💻 CLI Usage

You can now run SEO tasks directly from the command line using the `seo-cli` tool.

### Setup
Ensure you have the backend environment set up and dependencies installed (see [Backend Setup](#2-backend-setup)).

### Commands

- **Run an SEO Audit:**
  ```bash
  ./seo-cli.bat audit https://example.com
  ```

- **Generate Keywords:**
  ```bash
  ./seo-cli.bat keywords "digital marketing"
  ```

- **Analyze Competitors:**
  ```bash
  ./seo-cli.bat competitors "best coffee beans"
  ```

- **Generate Content:**
  ```bash
  ./seo-cli.bat content "future of AI" --type "blog post"
  ```

- **Run Full Strategy (All Agents):**
  ```bash
  ./seo-cli.bat strategy "AI in SEO" --url https://example.com
  ```

*(Note: On macOS/Linux, use `./seo-cli.sh` instead of `./seo-cli.bat`)*

## 📋 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Generative AI (Gemini)** - Advanced AI capabilities for recommendations
- **Python 3.8+** - Core language

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Lightning-fast frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Axios** - HTTP client

### Infrastructure
- **Docker** - Containerization
- **Python Virtual Environment** - Dependency isolation

## 🛠️ Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- Docker and Docker Compose (optional)
- Google Generative AI API Key

## 📦 Installation

### 1. Clone and Navigate
```bash
cd seo-saas-platform
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_api_key_here > .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Backend
```bash
cd backend

# Activate virtual environment
venv\Scripts\activate

# Start server
python -m uvicorn app.main:app --reload
```
The backend will be available at `http://localhost:8000`

### Frontend
```bash
cd frontend

# Start development server
npm run dev
```
The frontend will typically be available at `http://localhost:5173`

## 📚 API Documentation

Comprehensive API documentation is available in [docs/api_docs.md](docs/api_docs.md).

### Quick API Reference

- `GET /` - Health check
- `GET /seo/audit` - Perform SEO audit on a website
- `POST /ai/recommendations` - Get AI recommendations
- `GET /keywords/analysis` - Analyze keywords for SEO insights

## 🏗️ Architecture

For detailed system architecture, see [docs/architecture.md](docs/architecture.md).

## 🚢 Deployment

For deployment instructions, see [docs/deployment.md](docs/deployment.md).

## 📁 Project Structure

```
seo-saas-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/          # API endpoints
│   │   ├── agents/              # AI agents
│   │   ├── services/            # Business logic
│   │   ├── models/              # Data models
│   │   └── core/                # Core configurations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── api/                 # API calls
│   │   └── context/             # Context providers
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── api_docs.md
│   ├── architecture.md
│   └── deployment.md
└── data/
    ├── raw/                     # Raw data
    ├── processed/               # Processed data
    └── exports/                 # Exported reports
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```
GEMINI_API_KEY=your_google_generative_ai_key
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure virtual environment is activated
- Check `GEMINI_API_KEY` is set in `.env`
- Run `pip install -r requirements.txt` again

### Frontend won't start
- Clear `node_modules` and reinstall: `npm install`
- Ensure Node.js version is 16+: `node --version`

### API connection issues
- Verify backend is running on port 8000
- Check CORS configuration in `app/main.py`
- Ensure frontend is making requests to correct API URL

## 📖 Documentation

- [API Documentation](docs/api_docs.md) - Complete API reference
- [Architecture Guide](docs/architecture.md) - System design and components
- [Deployment Guide](docs/deployment.md) - Deployment instructions

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

See LICENSE file for details.

## 📞 Support

For issues and questions, please open an issue in the repository.
