import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.agents.keyword_agent import run_keyword_agent
from app.agents.competitor_agent import analyze_competitors
from app.agents.content_agent import run_content_agent
from app.agents.seo_audit_agent import audit_website
from app.agents.deep_audit_agent import run_deep_audit_agent
from app.models.seo_report import SEOReport

class SEOOrchestrator:
    """
    The Orchestrator is the central brain that coordinates multiple specialized agents
    to fulfill complex SEO requests.
    """

    async def execute_full_strategy(self, topic: str, target_url: str = None, project_id: int = None, db: AsyncSession = None):
        """
        Runs a complete SEO workflow:
        1. Keyword Research
        2. Competitor Analysis
        3. Content Strategy & Generation
        4. (Optional) Audit target URL
        5. (Optional) Save to DB
        """
        print(f"Orchestrator: Starting full strategy for '{topic}'")
        
        # Phase 1: Research (Run in parallel for speed)
        keyword_task = asyncio.to_thread(run_keyword_agent, topic)
        competitor_task = asyncio.to_thread(analyze_competitors, topic)
        
        tasks = [keyword_task, competitor_task]
        if target_url:
            tasks.append(asyncio.to_thread(audit_website, target_url))
            
        results = await asyncio.gather(*tasks)
        
        keyword_data = results[0]
        competitor_data = results[1]
        audit_data = results[2] if target_url else None
        
        # Phase 2: Synthesis & Content Generation
        context = f"KEYWORDS:\n{keyword_data['keywords_report']}\n\nCOMPETITOR GAPS:\n{competitor_data['insights']}"
        
        content_data = await asyncio.to_thread(
            run_content_agent, 
            topic=topic, 
            context=context
        )
        
        full_result = {
            "summary": f"Complete SEO Strategy for {topic}",
            "research": {
                "keywords": keyword_data,
                "competitors": competitor_data,
                "site_audit": audit_data
            },
            "output": content_data
        }

        # Optional Persistence
        if db and project_id:
            try:
                report = SEOReport(
                    project_id=project_id,
                    url=target_url or topic, # Use topic as identifier if no URL
                    seo_score=audit_data.get("seo_score") if audit_data else 0,
                    data=full_result,
                    ai_recommendations=content_data.get("content")
                )
                db.add(report)
                await db.commit()
                await db.refresh(report)
                full_result["report_id"] = report.id
            except Exception as e:
                print(f"Orchestrator DB Error: {str(e)}")
        
        return full_result

    async def quick_analysis(self, topic: str):
        """Just keywords and competitors."""
        results = await asyncio.gather(
            asyncio.to_thread(run_keyword_agent, topic),
            asyncio.to_thread(analyze_competitors, topic)
        )
        return {
            "keywords": results[0],
            "competitors": results[1]
        }

    async def run_deep_audit(self, url: str, project_id: int = None, db: AsyncSession = None):
        """
        Run the 6-pillar deep SEO audit and optionally save to DB.
        """
        print(f"Orchestrator: Running deep 6-pillar audit for {url}")
        deep_result = await asyncio.to_thread(run_deep_audit_agent, url, True)

        full_result = {
            "type": "deep_audit",
            "url": url,
            "overall_score": deep_result.get("overall_score", 0),
            "overall_grade": deep_result.get("overall_grade", "?"),
            "pillars": deep_result.get("pillars", []),
            "ai_recommendations": deep_result.get("ai_recommendations", ""),
            "metadata": deep_result.get("metadata", {}),
            "technical_meta": deep_result.get("technical_meta", {}),
        }

        if db and project_id:
            try:
                report = SEOReport(
                    project_id=project_id,
                    url=url,
                    seo_score=int(deep_result.get("overall_score", 0)),
                    data=deep_result,
                    ai_recommendations=deep_result.get("ai_recommendations", ""),
                )
                db.add(report)
                await db.commit()
                await db.refresh(report)
                full_result["report_id"] = report.id
            except Exception as e:
                print(f"Orchestrator DB Error: {str(e)}")

        return full_result

# Singleton instance
orchestrator = SEOOrchestrator()
