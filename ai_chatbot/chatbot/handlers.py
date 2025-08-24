
from pydantic import BaseModel, Field
from typing import List, Optional
from .model import get_llm
import json

class Filters(BaseModel):
    skills: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    rate_type: Optional[str] = None   # "fixed" | "hourly" | None
    remote: Optional[bool] = None
    duration_days_max: Optional[int] = None
    top_k: int = 5

class ChatResult(BaseModel):
    message: str
    filters: Filters
    should_fetch_jobs: bool = True

FILTER_PROMPT = """
Convert the user's natural-language job request into a STRICT JSON object:

{{
  "skills": [str],
  "keywords": [str],
  "budget_min": int|null,
  "budget_max": int|null,
  "rate_type": "fixed"|"hourly"|null,
  "remote": true|false|null,
  "duration_days_max": int|null,
  "top_k": int
}}

Rules:
- Output ONLY valid JSON (no prose, no code fences).
- Normalize skills/keywords to lowercase.
- Money like "$1000" or ">$30/hour": map to budget_* and set rate_type.
- "remote" => remote=true. "< 1 month" => duration_days_max ≈ 30.

User:
\"\"\"{user_prompt}\"\"\"
"""

SUMMARY_PROMPT = """
Write a brief, friendly message in English explaining what you will search for,
based on the filters below (JSON). Keep it to 2–3 sentences. Do NOT list jobs.

{filters_json}
"""

def _strip_code_fences(s: str) -> str:
    t = s.strip()
    if t.startswith("```"):
        t = t.strip("` \n\r\t")
        if t.lower().startswith("json"):
            t = t[4:].strip()
    return t

def parse_filters(user_prompt: str) -> Filters:
    llm = get_llm()
    raw = llm.invoke(FILTER_PROMPT.format(user_prompt=user_prompt)).content or ""
    raw = _strip_code_fences(raw)
    try:
        js = json.loads(raw)
    except Exception:
        js = {
            "skills": [], "keywords": [],
            "budget_min": None, "budget_max": None,
            "rate_type": None, "remote": None,
            "duration_days_max": None, "top_k": 5
        }
    if js.get("rate_type") not in (None, "fixed", "hourly"):
        js["rate_type"] = None
    try:
        tk = int(js.get("top_k", 5))
        js["top_k"] = max(1, min(tk, 20))
    except Exception:
        js["top_k"] = 5
    return Filters(**js)

def build_reply(filters: Filters) -> str:
    llm = get_llm()
    return llm.invoke(SUMMARY_PROMPT.format(filters_json=filters.json())).content

def handle_chat(user_prompt: str) -> ChatResult:
    filters = parse_filters(user_prompt)
    message = build_reply(filters)
    return ChatResult(message=message, filters=filters)
