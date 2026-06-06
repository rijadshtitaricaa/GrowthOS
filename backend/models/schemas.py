from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class AnalyzeRequest(BaseModel):
    url: str


class Problem(BaseModel):
    title: str
    explanation: str
    severity: str  # "High" | "Medium" | "Low"


class Fix(BaseModel):
    step: int
    action: str
    impact: str  # "High" | "Medium" | "Low"


class Rewrite(BaseModel):
    headline: str
    cta: str
    value_proposition: str


class AnalysisResult(BaseModel):
    id: Optional[str] = None
    url: str
    score: int
    problems: List[Problem]
    fixes: List[Fix]
    rewrite: Rewrite
    created_at: Optional[datetime] = None
