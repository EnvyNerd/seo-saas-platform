from fastapi import APIRouter

from app.services.deepseek_service import (
    generate_deepseek_content
)

router = APIRouter()


@router.post("/generate")
def generate_content(data: dict):

    topic = data.get("topic")

    result = generate_deepseek_content(topic)

    return {
        "content": result
    }