# API Documentation

## Overview

The SEO AI SaaS Platform provides a RESTful API for performing SEO analysis, keyword research, competitive analysis, and AI-powered recommendations.

**Base URL:** `http://localhost:8000`

## Authentication

Currently, the API does not require authentication. In production, implement API key authentication or OAuth 2.0.

## Response Format

All responses are in JSON format:

```json
{
  "status": "success",
  "data": {},
  "error": null
}
```

---

## Endpoints

### Health Check

#### GET /

Check if the API is running.

**Request:**
```bash
GET http://localhost:8000/
```

**Response (200):**
```json
{
  "message": "SEO AI Backend Running"
}
```

---

### SEO Audit

#### GET /seo/audit

Perform a comprehensive SEO audit on a website.

**Parameters:**
| Parameter | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| url       | string | Yes      | Website URL to audit |

**Request:**
```bash
GET http://localhost:8000/seo/audit?url=https://example.com
```

**Response (200):**
```json
{
  "url": "https://example.com",
  "audit_results": {
    "score": 85,
    "issues": [
      {
        "type": "warning",
        "message": "Missing meta descriptions",
        "severity": "high"
      }
    ],
    "recommendations": [
      "Optimize meta descriptions for better CTR",
      "Improve internal linking structure"
    ]
  }
}
```

**Error (400):**
```json
{
  "detail": "Invalid URL provided"
}
```

---

### AI Recommendations

#### POST /ai/recommendations

Get AI-powered SEO recommendations based on website data.

**Request Body:**
```json
{
  "url": "https://example.com",
  "current_keywords": ["seo", "optimization"],
  "content_type": "blog_post",
  "target_audience": "digital_marketers"
}
```

**Request:**
```bash
POST http://localhost:8000/ai/recommendations
Content-Type: application/json

{
  "url": "https://example.com",
  "current_keywords": ["seo", "optimization"],
  "content_type": "blog_post",
  "target_audience": "digital_marketers"
}
```

**Response (200):**
```json
{
  "recommendations": "1. Focus on long-tail keywords targeting digital marketers\n2. Create comprehensive guides on SEO best practices\n3. Implement schema markup for better SERP visibility\n4. Improve page load speed to under 3 seconds..."
}
```

**Error (400):**
```json
{
  "detail": "Missing required fields"
}
```

---

### Keyword Analysis

#### GET /keywords/analysis

Analyze keywords and generate SEO-optimized keyword strategies.

**Parameters:**
| Parameter | Type   | Required | Description              |
|-----------|--------|----------|--------------------------|
| keyword   | string | Yes      | Keyword or topic to analyze |

**Request:**
```bash
GET http://localhost:8000/keywords/analysis?keyword=digital+marketing
```

**Response (200):**
```json
{
  "keyword": "digital marketing",
  "analysis": "### Long-tail Keywords\n- digital marketing strategy for startups\n- best digital marketing tools 2024\n- digital marketing course\n\n### Semantic Keywords\n- online marketing\n- web marketing\n- internet marketing\n\n### Trending SEO Phrases\n- AI in digital marketing\n- automation marketing\n- marketing analytics\n\n### Content Topic Ideas\n- The Ultimate Digital Marketing Guide\n- How to Build a Digital Marketing Strategy\n- Digital Marketing Tools Comparison 2024"
}
```

**Error (400):**
```json
{
  "detail": "Keyword cannot be empty"
}
```

---

### Competitor Analysis

#### GET /competitors

Analyze competitor strategies and performance (if implemented).

**Parameters:**
| Parameter        | Type   | Required | Description                |
|------------------|--------|----------|----------------------------|
| competitor_url   | string | Yes      | Competitor website URL     |
| comparison_url   | string | No       | Your website URL (optional) |

**Request:**
```bash
GET http://localhost:8000/competitors?competitor_url=https://competitor.com
```

**Response (200):**
```json
{
  "competitor": "competitor.com",
  "analysis": {
    "top_keywords": ["seo", "digital marketing"],
    "estimated_traffic": 50000,
    "backlink_profile": {...},
    "content_strategy": {...}
  }
}
```

---

## Error Handling

The API returns standard HTTP status codes:

| Status Code | Meaning                  | Example                           |
|-------------|--------------------------|-----------------------------------|
| 200         | Success                  | Request completed successfully    |
| 400         | Bad Request              | Invalid parameters or malformed request |
| 404         | Not Found                | Endpoint doesn't exist            |
| 500         | Internal Server Error    | Unexpected server error           |
| 503         | Service Unavailable      | External API (Gemini) is down     |

**Error Response Format:**
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, implement rate limiting:
- Requests per minute per IP
- Requests per day per user
- Burst limits for concurrent requests

---

## Code Examples

### Python (Requests)
```python
import requests

# Perform SEO Audit
response = requests.get(
    "http://localhost:8000/seo/audit",
    params={"url": "https://example.com"}
)
print(response.json())

# Get AI Recommendations
response = requests.post(
    "http://localhost:8000/ai/recommendations",
    json={
        "url": "https://example.com",
        "current_keywords": ["seo"],
        "content_type": "blog_post"
    }
)
print(response.json())

# Analyze Keywords
response = requests.get(
    "http://localhost:8000/keywords/analysis",
    params={"keyword": "digital marketing"}
)
print(response.json())
```

### JavaScript (Fetch)
```javascript
// Perform SEO Audit
const auditResponse = await fetch(
  'http://localhost:8000/seo/audit?url=https://example.com'
);
const auditData = await auditResponse.json();
console.log(auditData);

// Get AI Recommendations
const recResponse = await fetch(
  'http://localhost:8000/ai/recommendations',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://example.com',
      current_keywords: ['seo'],
      content_type: 'blog_post'
    })
  }
);
const recData = await recResponse.json();
console.log(recData);

// Analyze Keywords
const keywordResponse = await fetch(
  'http://localhost:8000/keywords/analysis?keyword=digital%20marketing'
);
const keywordData = await keywordResponse.json();
console.log(keywordData);
```

### cURL
```bash
# Health Check
curl http://localhost:8000/

# SEO Audit
curl "http://localhost:8000/seo/audit?url=https://example.com"

# AI Recommendations
curl -X POST http://localhost:8000/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "current_keywords": ["seo"],
    "content_type": "blog_post"
  }'

# Keyword Analysis
curl "http://localhost:8000/keywords/analysis?keyword=digital+marketing"
```

---

## CORS Policy

The API allows requests from any origin:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Version History

| Version | Date       | Changes                    |
|---------|------------|----------------------------|
| 1.0.0   | 2024-01-15 | Initial API release        |
| 1.1.0   | 2024-02-20 | Added keyword analysis     |
| 1.2.0   | 2024-03-10 | Added competitor endpoint  |

---

## Support

For API issues or questions, please refer to the [Architecture Documentation](architecture.md) or create an issue in the repository.
