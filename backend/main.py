import os
import time
from collections import defaultdict
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from routers.analyze import router as analyze_router

load_dotenv()

_ENV = os.getenv("ENVIRONMENT", "development")
_is_production = _env_lower = _ENV.lower() == "production"

app = FastAPI(
    title="GrowthOS API",
    description="AI-powered website conversion analysis",
    version="1.0.0",
    docs_url=None if _is_production else "/docs",
    redoc_url=None if _is_production else "/redoc",
    openapi_url=None if _is_production else "/openapi.json",
)

allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# ── Simple in-memory rate limiter: 10 requests / IP / 60 seconds ──
_rate_store: dict = defaultdict(list)
_RATE_LIMIT = 10
_RATE_WINDOW = 60


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/api/analyze":
        ip = request.client.host or "unknown"
        now = time.time()
        _rate_store[ip] = [t for t in _rate_store[ip] if now - t < _RATE_WINDOW]
        if len(_rate_store[ip]) >= _RATE_LIMIT:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please wait a minute before trying again."},
            )
        _rate_store[ip].append(now)
    return await call_next(request)


app.include_router(analyze_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "GrowthOS API"}
