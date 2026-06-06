import re
import ipaddress
import socket
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any
from urllib.parse import urlparse

_BLOCKED_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
]


def _is_safe_url(url: str) -> bool:
    """Reject URLs that resolve to private/internal addresses (SSRF protection)."""
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    if hostname.lower() in ("localhost", ""):
        return False
    try:
        resolved = socket.gethostbyname(hostname)
        addr = ipaddress.ip_address(resolved)
        return not any(addr in net for net in _BLOCKED_NETWORKS)
    except Exception:
        return False


async def scrape_website(url: str) -> Dict[str, Any]:
    """Fetch and parse a website, extracting conversion-relevant signals."""
    if not _is_safe_url(url):
        raise ValueError("URL resolves to a private or reserved address.")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }

    async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "noscript", "svg", "iframe"]):
        tag.decompose()

    # Page metadata
    title = soup.title.string.strip() if soup.title else ""

    meta_desc = ""
    meta = soup.find("meta", attrs={"name": "description"})
    if meta:
        meta_desc = meta.get("content", "").strip()

    # Headings
    h1 = [h.get_text(strip=True) for h in soup.find_all("h1")]
    h2 = [h.get_text(strip=True) for h in soup.find_all("h2")][:6]
    h3 = [h.get_text(strip=True) for h in soup.find_all("h3")][:6]

    # CTA buttons and links
    cta_texts = []
    for el in soup.find_all(["button", "a"]):
        text = el.get_text(strip=True)
        if text and len(text) < 80:
            cta_texts.append(text)
    cta_texts = list(dict.fromkeys(cta_texts))[:20]

    # Body text (cleaned)
    body_text = soup.get_text(separator=" ", strip=True)
    body_text = re.sub(r"\s+", " ", body_text)[:3500]

    # Conversion signals
    forms_count = len(soup.find_all("form"))
    has_testimonials = bool(
        soup.find(
            string=re.compile(
                r"testimonial|review|said|says|customer|client|loved|trusted", re.I
            )
        )
    )
    has_pricing = bool(
        soup.find(
            string=re.compile(
                r"pricing|price|\$|€|£|per month|per year|\/mo|plan|free trial", re.I
            )
        )
    )
    has_social_proof = bool(
        soup.find(
            string=re.compile(
                r"\d[\d,]+\s*(users|customers|companies|teams|startups|people)", re.I
            )
        )
    )

    # Images (check if alt texts are meaningful)
    images = soup.find_all("img")
    images_without_alt = sum(1 for img in images if not img.get("alt", "").strip())

    return {
        "url": url,
        "title": title,
        "meta_description": meta_desc,
        "h1": h1,
        "h2": h2,
        "h3": h3,
        "cta_texts": cta_texts,
        "body_text": body_text,
        "forms_count": forms_count,
        "has_testimonials": has_testimonials,
        "has_pricing": has_pricing,
        "has_social_proof": has_social_proof,
        "images_without_alt": images_without_alt,
        "total_images": len(images),
    }
