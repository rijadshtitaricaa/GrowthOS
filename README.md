# GrowthOS

AI-powered website conversion analysis. Paste a URL → get exactly why it's not converting + actionable fixes + rewritten copy.

---

## Project Structure

```
GrowthOS/
├── backend/                   # Python FastAPI
│   ├── main.py                # App entry point + CORS
│   ├── requirements.txt
│   ├── .env.example           # ← copy to .env and fill keys
│   ├── models/
│   │   └── schemas.py         # Pydantic request/response models
│   ├── routers/
│   │   └── analyze.py         # POST /api/analyze
│   └── services/
│       ├── scraper.py         # httpx + BeautifulSoup scraping
│       ├── ai_service.py      # OpenAI GPT-4o analysis
│       └── supabase_service.py# Supabase persistence
│
├── frontend/                  # React + Vite
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
│       ├── App.jsx            # State machine (landing→loading→results)
│       ├── index.css          # Full design system
│       └── components/
│           ├── LandingPage.jsx
│           ├── LoadingState.jsx
│           └── ResultsPage.jsx
│
├── supabase_schema.sql        # Run once in Supabase SQL Editor
└── README.md
```

---

## API Keys — Where to Put Them

All secrets live in **`backend/.env`** (never commit this file).

```bash
# 1. Create .env from the example
cp backend/.env.example backend/.env
```

Then open `backend/.env` and fill in:

| Variable | Where to find it |
|---|---|
| `DEEPSEEK_API_KEY` | [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon / public |
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Project Settings → API → service_role *(never expose publicly)* |
| `ALLOWED_ORIGINS` | Comma-separated frontend URLs (default: `http://localhost:5173`) |
| `ENVIRONMENT` | Set to `production` in your deployment platform to disable `/docs` |

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**
3. Paste the full contents of `supabase_schema.sql` and click **Run**
4. Copy your **Project URL** and **API keys** into `backend/.env`

---

## Running Locally

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Start the dev server
uvicorn main:app --reload --port 8000
```

API runs at → `http://localhost:8000`  
Docs at → `http://localhost:8000/docs`

---

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

> The Vite dev server proxies `/api/*` to `http://localhost:8000` automatically.  
> You do **not** need to set `VITE_API_URL` during local development.

---

## API Reference

### `POST /api/analyze`

**Request**
```json
{ "url": "https://example.com" }
```

**Response**
```json
{
  "id": "uuid",
  "url": "https://example.com",
  "score": 38,
  "problems": [
    {
      "title": "No clear value proposition above the fold",
      "explanation": "The H1 reads 'Welcome to Acme' — this tells visitors nothing about what the product does or who it's for. Visitors decide to stay or leave in under 5 seconds.",
      "severity": "High"
    }
  ],
  "fixes": [
    {
      "step": 1,
      "action": "Rewrite the H1 to state exactly what you do and who it's for, e.g. 'Automate invoice follow-ups for freelancers — get paid 2x faster.'",
      "impact": "High"
    }
  ],
  "rewrite": {
    "headline": "Stop chasing invoices. Get paid automatically.",
    "cta": "Start collecting payments",
    "value_proposition": "Acme sends automated payment reminders on your behalf so you never have to follow up again. Built for freelancers and small agencies who bill monthly. Set up in 5 minutes, no code required."
  }
}
```

### `GET /health`

Returns `{ "status": "ok" }` — use this to confirm the backend is running.

---

## Production Deployment

- **Backend**: Deploy to [Railway](https://railway.app), [Render](https://render.com), or any Python host. Set all `.env` variables as environment variables in the platform dashboard. Set `ENVIRONMENT=production`.
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Set `VITE_API_URL` to your deployed backend URL, plus `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Update `ALLOWED_ORIGINS` in the backend to include your production frontend URL.
- **Never commit `.env` files** — use the platform's environment variable settings instead.
