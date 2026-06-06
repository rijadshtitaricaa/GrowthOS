import os
import json
from typing import Dict, Any, Tuple
from openai import AsyncOpenAI
from models.schemas import AnalysisResult, Problem, Fix, Rewrite

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com",
        )
    return _client

SYSTEM_PROMPT = """You are a world-class growth consultant and conversion rate optimization expert with 15+ years experience helping startups scale from 0 to $10M ARR.

You analyze websites with surgical precision and identify exactly why they are failing to convert visitors into paying customers. You are direct, blunt, and specific. You never give generic advice. Every single point you make references something you actually found on the website.

You think like a founder who has shipped multiple successful products and knows what actually moves the needle. You prioritize revenue impact above all else."""


def _build_prompt(data: Dict[str, Any]) -> str:
    return f"""Analyze this website and identify exactly why it is failing to convert visitors into customers.

WEBSITE DATA:
URL: {data['url']}
Page Title: {data['title'] or 'Not set'}
Meta Description: {data['meta_description'] or 'Not set'}
H1 Headings: {', '.join(data['h1']) if data['h1'] else 'None found'}
H2 Headings: {', '.join(data['h2']) if data['h2'] else 'None found'}
H3 Headings: {', '.join(data['h3']) if data['h3'] else 'None found'}
CTA Buttons/Links: {', '.join(data['cta_texts'][:12]) if data['cta_texts'] else 'None found'}
Has Social Proof / Testimonials: {data['has_testimonials']}
Has Pricing Information: {data['has_pricing']}
Has Social Proof Numbers: {data['has_social_proof']}
Number of Forms: {data['forms_count']}
Images missing alt text: {data['images_without_alt']} of {data['total_images']}
Page Content Excerpt:
{data['body_text'][:2500]}

Return a JSON object with EXACTLY this structure (no markdown, no explanation — raw JSON only):
{{
  "score": <integer 0-100 — conversion readiness score. Be brutally honest. Most startup sites score 20-50. Only genuinely excellent sites score 70+>,
  "problems": [
    {{
      "title": "<short, punchy problem title — max 8 words>",
      "explanation": "<2-3 sentences. Be specific. Reference actual content from the site. Explain the revenue impact.>",
      "severity": "<High|Medium|Low>"
    }}
  ],
  "fixes": [
    {{
      "step": <integer starting at 1>,
      "action": "<One specific, concrete action the founder can execute today. No vague advice. Start with a verb.>",
      "impact": "<High|Medium|Low>"
    }}
  ],
  "rewrite": {{
    "headline": "<Rewritten headline. Outcome-focused, specific, no jargon. Should make a visitor immediately understand the value.>",
    "cta": "<Rewritten CTA button text. Specific, action-oriented. Not 'Get Started' or 'Sign Up'.>",
    "value_proposition": "<2-3 sentences. Direct, specific value prop. Who is it for, what does it do, why is it better. No buzzwords.>"
  }}
}}

Rules:
- problems: 3-5 items, sorted High → Medium → Low severity
- fixes: 4-6 items, sorted High → Medium impact
- Every problem and fix must reference something specific from the website data above
- The rewrite must be dramatically better than what exists — do not be conservative
- Score: if the H1 is missing or vague, that alone drops the score significantly"""


async def analyze_with_ai(scraped_data: Dict[str, Any]) -> Tuple[AnalysisResult, str]:
    """Send scraped data to DeepSeek and return a structured AnalysisResult."""
    prompt = _build_prompt(scraped_data)

    response = await _get_client().chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=2000,
    )

    raw_json = response.choices[0].message.content
    data = json.loads(raw_json)

    problems = [Problem(**p) for p in data["problems"]]
    fixes = [Fix(**f) for f in data["fixes"]]
    rewrite = Rewrite(**data["rewrite"])

    result = AnalysisResult(
        url=scraped_data["url"],
        score=int(data["score"]),
        problems=problems,
        fixes=fixes,
        rewrite=rewrite,
    )

    return result, raw_json
