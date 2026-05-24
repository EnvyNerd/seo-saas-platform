import asyncio
from app.core.database import engine, Base
# Import all models to ensure they are registered with Base
from app.models.user import User
from app.models.project import Project
from app.models.seo_report import SEOReport
from app.models.keywords import KeywordResearch
from app.models.competitor import CompetitorAnalysis

async def init_db():
    print("Initializing database...")
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # Optional: clear DB
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized successfully!")

if __name__ == "__main__":
    asyncio.run(init_db())
