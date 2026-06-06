import os
from typing import Optional
from supabase import create_client, Client

_client: Optional[Client] = None


def get_supabase() -> Client:
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env"
            )
        _client = create_client(url, key)
    return _client


async def save_analysis(
    url: str,
    score: int,
    problems: list,
    fixes: list,
    rewrite: dict,
    raw_response: str,
    user_id: Optional[str] = None,
) -> Optional[str]:
    """Persist analysis results to Supabase. Returns the record UUID."""
    try:
        sb = get_supabase()
        payload = {
            "url": url,
            "score": score,
            "problems": problems,
            "fixes": fixes,
            "rewrite": rewrite,
            "raw_response": raw_response,
        }
        if user_id:
            payload["user_id"] = user_id
        result = sb.table("analyses").insert(payload).execute()
        if result.data:
            return result.data[0]["id"]
    except Exception as e:
        print(f"[Supabase] save_analysis error: {e}")
    return None


async def get_recent_analyses(limit: int = 10) -> list:
    """Fetch the most recent analyses (url + score + timestamp only)."""
    try:
        sb = get_supabase()
        result = (
            sb.table("analyses")
            .select("id, url, score, created_at")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception as e:
        print(f"[Supabase] get_recent_analyses error: {e}")
        return []
