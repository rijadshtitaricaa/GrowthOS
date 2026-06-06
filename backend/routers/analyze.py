import re
import base64
import json
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException, Header
from models.schemas import AnalyzeRequest, AnalysisResult
from services.scraper import scrape_website
from services.ai_service import analyze_with_ai
from services.supabase_service import save_analysis


def _user_id_from_token(authorization: Optional[str]) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        payload = authorization[7:].split(".")[1]
        payload += "=" * (-len(payload) % 4)
        data = json.loads(base64.b64decode(payload))
        return data.get("sub")
    except Exception:
        return None

router = APIRouter()

_URL_RE = re.compile(
    r"^https?://"
    r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
    r"localhost|"
    r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
    r"(?::\d+)?"
    r"(?:/?|[/?]\S+)$",
    re.IGNORECASE,
)


def _normalize_url(url: str) -> str:
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_website(
    request: AnalyzeRequest,
    authorization: Optional[str] = Header(None),
):
    user_id = _user_id_from_token(authorization)
    url = _normalize_url(request.url)

    if not _URL_RE.match(url):
        raise HTTPException(status_code=400, detail="Invalid URL format.")

    # 1 — Scrape
    try:
        scraped = await scrape_website(url)
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="The website took too long to respond. Try again.",
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not access website (HTTP {e.response.status_code}).",
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not fetch website. Check the URL and try again.",
        )

    # 2 — AI analysis
    try:
        result, raw_json = await analyze_with_ai(scraped)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}",
        )

    # 3 — Persist to Supabase (non-blocking — a storage failure won't break the response)
    analysis_id = await save_analysis(
        url=result.url,
        score=result.score,
        problems=[p.model_dump() for p in result.problems],
        fixes=[f.model_dump() for f in result.fixes],
        rewrite=result.rewrite.model_dump(),
        raw_response=raw_json,
        user_id=user_id,
    )

    if analysis_id:
        result.id = analysis_id

    return result
