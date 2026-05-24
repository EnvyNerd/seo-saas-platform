from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.gemini_service import generate_seo_recommendations
from app.agents.orchestrator import orchestrator
from app.core.database import get_db


class RecommendationRequest(BaseModel):
    data: dict

class StrategyRequest(BaseModel):
    topic: str
    target_url: Optional[str] = None
    project_id: Optional[int] = None
    humanize: Optional[bool] = False

class ChatRequest(BaseModel):
    message: str
    clear_history: Optional[bool] = False

router = APIRouter()


@router.post("/recommendations")
async def seo_ai_recommendations(req: RecommendationRequest = Body(...)):
    result = generate_seo_recommendations(req.data)
    return {"recommendations": result}

@router.post("/strategy")
async def get_full_strategy(
    strategy_in: StrategyRequest = Body(...), 
    db: AsyncSession = Depends(get_db)
):
    """
    Triggers the Orchestrator to run a full multi-agent SEO strategy.
    """
    try:
        # Use a real project ID if provided, otherwise find or create a default one
        # For now, we'll try to use the provided one or fallback to a safe execution
        result = await orchestrator.execute_full_strategy(
            topic=strategy_in.topic, 
            target_url=strategy_in.target_url,
            project_id=strategy_in.project_id,
            db=db
        )
        
        if strategy_in.humanize and result and 'output' in result and 'content' in result['output']:
            from app.services.humanizer_service import humanize_text
            result['output']['content'] = humanize_text(result['output']['content'])
            
        return result
    except Exception as e:
        print(f"Strategy Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat_with_assistant(req: ChatRequest = Body(...)):
    """💬 Chat with the AI SEO Assistant (maintaining session history)."""
    try:
        from app.agents.chat_agent import chat_agent
        if req.clear_history:
            chat_agent.clear_history()
            
        response = chat_agent.ask(req.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))