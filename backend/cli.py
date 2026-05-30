import click
import asyncio
import json
import sys
import os
import time
from dotenv import load_dotenv, set_key
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.markdown import Markdown
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich import box
from rich.rule import Rule

# Add the backend directory to sys.path to allow importing from 'app'
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from app.agents.orchestrator import orchestrator
from app.agents.seo_audit_agent import audit_website
from app.agents.keyword_agent import run_keyword_agent
from app.agents.competitor_agent import analyze_competitors
from app.agents.content_agent import run_content_agent
from app.agents.comparison_agent import analyze_content_gap
from app.services.humanizer_service import humanize_text
from app.services.gemini_service import generate_schema_markup
from app.agents.chat_agent import chat_agent

load_dotenv()
console = Console()

def export_result(data, filename, format='json'):
    """Helper to export data to a file."""
    try:
        if format == 'json':
            with open(filename, 'w') as f:
                json.dump(data, f, indent=2)
        elif format == 'md':
            with open(filename, 'w') as f:
                f.write(data)
        console.print(f"[green]Successfully exported to {filename}[/green]")
    except Exception as e:
        console.print(f"[red]Export failed: {str(e)}[/red]")

@click.group()
def cli():
    """🚀 SEO SaaS Platform CLI Tool"""
    pass

from app.core.database import engine, Base, AsyncSessionLocal
from app.models.project import Project
from app.models.seo_report import SEOReport
from app.models.keywords import KeywordResearch
from app.models.competitor import CompetitorAnalysis
from sqlalchemy import select, delete, func

# --- DB Command Group ---

@cli.group()
def db():
    """Manage platform database state."""
    pass

@db.command()
def init():
    """Initialize the database schema."""
    import asyncio
    from init_db_async import init_db
    with console.status("[bold green]Initializing database tables...", spinner="point"):
        asyncio.run(init_db())
    console.print("[bold green]✅ Database schema created successfully.[/bold green]")

@db.command()
def reset():
    """Wipe all data and reset the database."""
    import asyncio
    async def reset_logic():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
    
    if click.confirm("⚠️ This will DELETE ALL DATA. Are you sure?"):
        asyncio.run(reset_logic())
        console.print("[bold red]Database has been reset.[/bold red]")

# --- Project Command Group ---

@cli.group()
def project():
    """Manage SEO projects."""
    pass

@project.command(name='create')
@click.argument('name')
@click.option('--domain', default="N/A", help="Target domain for the project.")
def project_create(name, domain):
    """Create a new SEO project."""
    import asyncio
    async def create():
        async with AsyncSessionLocal() as session:
            new_project = Project(name=name, domain=domain)
            session.add(new_project)
            await session.commit()
            return new_project.id
            
    pid = asyncio.run(create())
    console.print(f"[bold green]✅ Project '{name}' created with ID: {pid}[/bold green]")

@project.command(name='list')
def project_list():
    """List all active projects."""
    import asyncio
    async def fetch():
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Project))
            return result.scalars().all()
            
    projects = asyncio.run(fetch())
    table = Table(title="SEO Projects", box=box.ROUNDED)
    table.add_column("ID", style="dim")
    table.add_column("Name", style="cyan")
    table.add_column("Created", style="dim")
    
    for p in projects:
        table.add_row(str(p.id), p.name, p.created_at.strftime("%Y-%m-%d"))
    console.print(table)

@project.command(name='delete')
@click.argument('project_id', type=int)
def project_delete(project_id):
    """Delete a project by ID."""
    import asyncio
    async def delete_p():
        async with AsyncSessionLocal() as session:
            await session.execute(delete(Project).where(Project.id == project_id))
            await session.commit()
            
    if click.confirm(f"Delete project {project_id}?"):
        asyncio.run(delete_p())
        console.print(f"[bold red]Project {project_id} deleted.[/bold red]")

@project.command(name='view')
@click.argument('project_id', type=int)
def project_view(project_id):
    """View details and history of an SEO project."""
    import asyncio
    async def fetch_details():
        async with AsyncSessionLocal() as session:
            proj = await session.get(Project, project_id)
            if not proj:
                return None
            
            # Fetch reports
            r_res = await session.execute(select(SEOReport).where(SEOReport.project_id == project_id).order_by(SEOReport.created_at.desc()))
            reports = r_res.scalars().all()
            
            # Fetch keyword researches
            k_res = await session.execute(select(KeywordResearch).where(KeywordResearch.project_id == project_id).order_by(KeywordResearch.created_at.desc()))
            keywords = k_res.scalars().all()
            
            # Fetch competitor analyses
            c_res = await session.execute(select(CompetitorAnalysis).where(CompetitorAnalysis.project_id == project_id).order_by(CompetitorAnalysis.created_at.desc()))
            competitors = c_res.scalars().all()
            
            return {
                "project": proj,
                "reports": reports,
                "keywords": keywords,
                "competitors": competitors
            }

    data = asyncio.run(fetch_details())
    if not data:
        console.print(f"[bold red]Error: Project with ID {project_id} not found.[/bold red]")
        return

    p = data["project"]
    console.print(Panel(
        f"[bold cyan]Project Name:[/bold cyan] {p.name}\n"
        f"[bold cyan]Target Domain:[/bold cyan] {p.domain}\n"
        f"[bold cyan]Created At:[/bold cyan] {p.created_at.strftime('%Y-%m-%d %H:%M:%S')}",
        title=f"Project Profile (ID: {p.id})",
        border_style="blue"
    ))

    # SEO Reports Table
    reports_table = Table(title="Audit History (SEO Reports)", box=box.ROUNDED)
    reports_table.add_column("Report ID", style="dim")
    reports_table.add_column("URL", style="blue")
    reports_table.add_column("SEO Score", style="bold")
    reports_table.add_column("Date", style="dim")
    
    for r in data["reports"]:
        score = r.seo_score
        color = "green" if score > 80 else "yellow" if score > 50 else "red"
        reports_table.add_row(str(r.id), r.url, f"[{color}]{score}/100[/{color}]", r.created_at.strftime("%Y-%m-%d %H:%M"))
    
    # Keywords Table
    keywords_table = Table(title="Keyword Strategies", box=box.ROUNDED)
    keywords_table.add_column("ID", style="dim")
    keywords_table.add_column("Topic", style="cyan")
    keywords_table.add_column("Date", style="dim")
    
    for k in data["keywords"]:
        keywords_table.add_row(str(k.id), k.topic, k.created_at.strftime("%Y-%m-%d %H:%M"))

    # Competitor Gaps Table
    competitors_table = Table(title="Competitor Analyses", box=box.ROUNDED)
    competitors_table.add_column("ID", style="dim")
    competitors_table.add_column("Keyword/Topic", style="magenta")
    competitors_table.add_column("Date", style="dim")
    
    for c in data["competitors"]:
        competitors_table.add_row(str(c.id), c.keyword, c.created_at.strftime("%Y-%m-%d %H:%M"))

    console.print(reports_table)
    console.print(keywords_table)
    console.print(competitors_table)


# --- Report Command Group ---

@cli.group()
def report():
    """Manage saved SEO reports."""
    pass

@report.command(name='list')
def report_list():
    """List all saved SEO reports."""
    import asyncio
    async def fetch_reports():
        async with AsyncSessionLocal() as session:
            stmt = select(SEOReport, Project.name).join(Project, SEOReport.project_id == Project.id).order_by(SEOReport.created_at.desc())
            res = await session.execute(stmt)
            return res.all()
            
    reports = asyncio.run(fetch_reports())
    
    table = Table(title="Saved SEO Reports", box=box.ROUNDED)
    table.add_column("Report ID", style="dim")
    table.add_column("Project", style="cyan")
    table.add_column("URL", style="blue")
    table.add_column("SEO Score", style="bold")
    table.add_column("Created At", style="dim")
    
    for r, proj_name in reports:
        score = r.seo_score
        color = "green" if score > 80 else "yellow" if score > 50 else "red"
        table.add_row(
            str(r.id),
            proj_name,
            r.url,
            f"[{color}]{score}/100[/{color}]",
            r.created_at.strftime("%Y-%m-%d %H:%M")
        )
    console.print(table)

@report.command(name='view')
@click.argument('report_id', type=int)
def report_view(report_id):
    """View details of a saved SEO report."""
    import asyncio
    async def fetch_report():
        async with AsyncSessionLocal() as session:
            stmt = select(SEOReport, Project.name).join(Project, SEOReport.project_id == Project.id).where(SEOReport.id == report_id)
            res = await session.execute(stmt)
            return res.first()
            
    res = asyncio.run(fetch_report())
    if not res:
        console.print(f"[bold red]Error: Report with ID {report_id} not found.[/bold red]")
        return
        
    r, proj_name = res
    console.print(Rule(f"SEO REPORT DETAIL: ID {r.id}", style="bold blue"))
    
    info_table = Table(show_header=False, box=box.SIMPLE)
    info_table.add_row("Project Name:", proj_name)
    info_table.add_row("Target URL:", r.url)
    score_color = "green" if r.seo_score > 80 else "yellow" if r.seo_score > 50 else "red"
    info_table.add_row("SEO Score:", f"[{score_color}]{r.seo_score}/100[/{score_color}]")
    info_table.add_row("Audited On:", r.created_at.strftime("%Y-%m-%d %H:%M:%S"))
    
    console.print(Panel(info_table, title="Audit Info", border_style="cyan"))
    
    if r.ai_recommendations:
        console.print("\n[bold green]AI Recommendations:[/bold green]")
        console.print(Markdown(r.ai_recommendations))
    else:
        console.print("\n[dim]No AI recommendations generated for this report.[/dim]")

@report.command(name='export')
@click.argument('report_id', type=int)
@click.option('--format', type=click.Choice(['json', 'md', 'html']), default='json', help="Export format.")
@click.argument('output_file')
def report_export(report_id, output_file, format):
    """Export a saved report to a file."""
    import asyncio
    async def fetch_report():
        async with AsyncSessionLocal() as session:
            return await session.get(SEOReport, report_id)
            
    r = asyncio.run(fetch_report())
    if not r:
        console.print(f"[bold red]Error: Report with ID {report_id} not found.[/bold red]")
        return
        
    if format == 'json':
        export_result(r.data, output_file, 'json')
    elif format == 'md':
        md = f"# SEO Report: {r.url}\n\n"
        md += f"**Score:** {r.seo_score}/100\n"
        md += f"**Date:** {r.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        if r.ai_recommendations:
            md += f"## AI Recommendations\n\n{r.ai_recommendations}\n"
        export_result(md, output_file, 'md')
    elif format == 'html':
        recs_html = r.ai_recommendations.replace('\n', '<br>') if r.ai_recommendations else "None"
        html = f"""<html>
<head>
    <title>SEO Report for {r.url}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }}
        h1, h2 {{ color: #0056b3; }}
        .score {{ font-size: 24px; font-weight: bold; color: {'green' if r.seo_score > 80 else 'orange' if r.seo_score > 50 else 'red'}; }}
        .meta {{ background: #f4f4f4; padding: 15px; border-left: 5px solid #0056b3; margin-bottom: 20px; }}
    </style>
</head>
<body>
    <h1>SEO Report</h1>
    <div class="meta">
        <p><strong>URL:</strong> {r.url}</p>
        <p><strong>Score:</strong> <span class="score">{r.seo_score}/100</span></p>
        <p><strong>Date:</strong> {r.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
    </div>
    <h2>AI Recommendations</h2>
    <div>{recs_html}</div>
</body>
</html>"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html)
            console.print(f"[green]Successfully exported HTML to {output_file}[/green]")
        except Exception as e:
            console.print(f"[red]Export failed: {str(e)}[/red]")


# --- Configuration Command Group ---

@cli.group()
def config():
    """Manage CLI configuration and API keys."""
    pass

@config.command(name='set')
@click.argument('key')
@click.argument('value')
def set_config(key, value):
    """Set a configuration value in .env file."""
    env_path = os.path.join(backend_dir, '.env')
    set_key(env_path, key.upper(), value)
    console.print(f"[green]Config {key.upper()} updated successfully.[/green]")

@config.command(name='get')
@click.argument('key')
def get_config(key):
    """Get a configuration value."""
    value = os.getenv(key.upper())
    if value:
        console.print(f"[cyan]{key.upper()}[/cyan] = [yellow]{value}[/yellow]")
    else:
        console.print(f"[red]Key {key.upper()} not found.[/red]")

@config.command(name='list')
def list_config():
    """List all configured keys (masked)."""
    table = Table(title="Current Configuration", box=box.ROUNDED)
    table.add_column("Key", style="cyan")
    table.add_column("Value", style="yellow")
    
    for key, value in os.environ.items():
        if any(secret in key.upper() for secret in ['KEY', 'SECRET', 'PASSWORD', 'TOKEN']):
            masked = value[:4] + "*" * (len(value) - 8) + value[-4:] if len(value) > 8 else "****"
            table.add_row(key, masked)
        elif key.upper().startswith('GEMINI_') or key.upper().startswith('OPENAI_'):
             table.add_row(key, "****")
             
    console.print(table)

# --- SEO Commands ---

@cli.command()
@click.argument('url')
@click.option('--export', help="Export result to JSON file.")
@click.option('--schema', is_flag=True, help="Generate JSON-LD Schema Markup.")
@click.option('--project-id', '-p', type=int, help="Associate report with a project ID.")
def audit(url, export, schema, project_id):
    """Run a Deep SEO audit on a website URL (Playwright-powered)."""
    with console.status(f"[bold green]Deep Auditing {url} (Rendering JS)...", spinner="earth"):
        result = audit_website(url)
    
    if "error" in result:
        console.print(Panel(f"[red]Error: {result['error']}[/red]", title="Audit Failed"))
        return

    table = Table(title=f"SEO Audit: {url}", box=box.DOUBLE_EDGE)
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="white")

    score_color = "green" if result['seo_score'] > 80 else "yellow" if result['seo_score'] > 50 else "red"
    table.add_row("SEO Score", f"[{score_color}]{result['seo_score']}/100[/{score_color}]")
    table.add_row("Title", result['title'])
    table.add_row("Meta Description", result['meta_description'][:100] + "..." if len(result['meta_description']) > 100 else result['meta_description'])
    table.add_row("H1 Tags", ", ".join(result['h1_tags']) if result['h1_tags'] else "None")
    table.add_row("Total Links", str(result['total_links']))
    table.add_row("Missing Alt Images", f"[red]{result['missing_alt_images']}[/red]" if result['missing_alt_images'] > 0 else "0")
    table.add_row("Screenshot", result['screenshot_path'])

    console.print(table)
    
    if schema:
        with console.status("[bold green]Generating Schema Markup...", spinner="dots"):
            markup = generate_schema_markup(result)
        console.print(Panel(markup, title="JSON-LD Schema Markup", border_style="yellow"))

    if project_id:
        async def save_report():
            async with AsyncSessionLocal() as session:
                proj = await session.get(Project, project_id)
                if not proj:
                    console.print(f"[red]Error: Project with ID {project_id} does not exist.[/red]")
                    return None
                
                from app.services.gemini_service import generate_seo_recommendations
                with console.status("[bold green]Generating AI SEO recommendations...", spinner="dots"):
                    try:
                        recs = generate_seo_recommendations(result)
                    except Exception as e:
                        recs = f"Error generating recommendations: {str(e)}"
                
                report = SEOReport(
                    project_id=project_id,
                    url=url,
                    seo_score=result['seo_score'],
                    data=result,
                    ai_recommendations=recs
                )
                session.add(report)
                await session.commit()
                await session.refresh(report)
                return report.id

        report_id = asyncio.run(save_report())
        if report_id:
            console.print(f"[bold green]Report saved to Database under Project {project_id} with Report ID: {report_id}[/bold green]")

    if export:
        export_result(result, export)

@cli.command()
@click.argument('my_url')
@click.argument('competitor_url')
@click.option('--export', help="Export gap report to Markdown file.")
def compare(my_url, competitor_url, export):
    """Run a Content Gap Analysis between two sites."""
    with console.status(f"[bold green]Comparing {my_url} vs {competitor_url}...", spinner="bouncingBar"):
        result = analyze_content_gap(my_url, competitor_url)
    
    if "error" in result:
        console.print(f"[red]Error: {result['error']}[/red]")
        return
        
    console.print(Rule(f"CONTENT GAP REPORT", style="bold blue"))
    console.print(Markdown(result['gap_report']))
    
    if export:
        export_result(result['gap_report'], export, format='md')

@cli.command()
@click.argument('topic')
@click.option('--export', help="Export keywords to text file.")
@click.option('--project-id', '-p', type=int, help="Associate keywords with a project ID.")
def keywords(topic, export, project_id):
    """Generate keywords for a given topic."""
    with console.status(f"[bold green]Generating keywords for '{topic}'...", spinner="bouncingBar"):
        result = run_keyword_agent(topic)
    
    console.print(Panel(result['keywords_report'], title=f"Keywords for: {topic}", border_style="blue"))
    
    if project_id:
        async def save_keywords():
            async with AsyncSessionLocal() as session:
                proj = await session.get(Project, project_id)
                if not proj:
                    console.print(f"[red]Error: Project with ID {project_id} does not exist.[/red]")
                    return False
                
                kw_research = KeywordResearch(
                    project_id=project_id,
                    topic=topic,
                    results=result['keywords_report']
                )
                session.add(kw_research)
                await session.commit()
                return True
        if asyncio.run(save_keywords()):
            console.print(f"[bold green]Keyword strategy saved to Database under Project {project_id}[/bold green]")

    if export:
        export_result(result['keywords_report'], export, format='md')

@cli.command()
@click.argument('topic')
@click.option('--export', help="Export result to JSON file.")
@click.option('--project-id', '-p', type=int, help="Associate competitors with a project ID.")
def competitors(topic, export, project_id):
    """Analyze competitors for a given keyword/topic."""
    with console.status(f"[bold green]Analyzing competitors for '{topic}'...", spinner="earth"):
        result = analyze_competitors(topic)
    
    console.print(Panel(result['insights'], title="Competitor Insights", border_style="magenta"))
    
    table = Table(title="Competitors", box=box.SIMPLE)
    table.add_column("Title", style="cyan")
    table.add_column("URL", style="blue")
    
    for comp in result['competitors']:
        table.add_row(comp['title'], comp['link'])
    
    console.print(table)
    
    if project_id:
        async def save_competitors():
            async with AsyncSessionLocal() as session:
                proj = await session.get(Project, project_id)
                if not proj:
                    console.print(f"[red]Error: Project with ID {project_id} does not exist.[/red]")
                    return False
                
                comp_analysis = CompetitorAnalysis(
                    project_id=project_id,
                    keyword=topic,
                    competitors_data=result['competitors'],
                    ai_insights=result['insights']
                )
                session.add(comp_analysis)
                await session.commit()
                return True
        if asyncio.run(save_competitors()):
            console.print(f"[bold green]Competitor analysis saved to Database under Project {project_id}[/bold green]")

    if export:
        export_result(result, export)

@cli.command()
@click.argument('topic')
@click.option('--context', default="", help="Additional context for content generation.")
@click.option('--type', 'content_type', default="blog post", help="Type of content to generate.")
@click.option('--export', help="Export content to Markdown file.")
@click.option('--humanize', is_flag=True, help="Humanize the content to bypass AI detection.")
@click.option('--arena', is_flag=True, help="Run Arena Mode (Multi-Model Comparison).")
def content(topic, context, content_type, export, humanize, arena):
    """Generate SEO-optimized content."""
    with console.status(f"[bold green]Generating {content_type}...", spinner="runner"):
        result = run_content_agent(topic, context, content_type, humanize=humanize, arena=arena)
    
    if arena:
        import questionary
        console.print(Rule("CONTENT ARENA", style="bold blue"))
        model_names = list(result['results'].keys())
        for model in model_names:
            output = result['results'][model]
            console.print(f"\n[bold green]Model: {model}[/bold green]")
            console.print(Panel(Markdown(output[:500] + "..."), subtitle="Preview (First 500 chars)"))
        
        selected_model = questionary.select(
            "Which model's content would you like to read in full?",
            choices=model_names + ["None (Exit)"]
        ).ask()
        
        if selected_model and selected_model != "None (Exit)":
            full_content = result['results'][selected_model]
            console.print(Rule(f"FULL CONTENT: {selected_model}", style="bold green"))
            console.print(Markdown(full_content))
            
            if questionary.confirm("Would you like to export this version?").ask():
                filename = export if export else f"content_{selected_model.replace(' ', '_').lower()}.md"
                export_result(full_content, filename, format='md')
        return

    console.print(Markdown(result['content']))
    
    if export:
        export_result(result['content'], export, format='md')

@cli.command()
@click.argument('topic')
@click.option('--url', help="Target URL for audit as part of the strategy.")
@click.option('--export', help="Export full strategy to JSON file.")
@click.option('--humanize', is_flag=True, help="Humanize the generated content.")
@click.option('--project-id', '-p', type=int, help="Associate strategy with a project ID.")
def strategy(topic, url, export, humanize, project_id):
    """Run a full SEO strategy (Keywords + Competitors + Content + Audit)."""
    
    async def run_strategy():
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
        ) as progress:
            task = progress.add_task(description=f"Executing full strategy for: {topic}...", total=None)
            
            db = None
            if project_id:
                async with AsyncSessionLocal() as session:
                    proj = await session.get(Project, project_id)
                    if not proj:
                        console.print(f"[red]Error: Project with ID {project_id} does not exist.[/red]")
                        return None
                db = AsyncSessionLocal()
            
            try:
                result = await orchestrator.execute_full_strategy(topic, target_url=url, project_id=project_id, db=db)
                if db:
                    await db.close()
            except Exception as e:
                if db:
                    await db.close()
                raise e
            
            if result and humanize:
                progress.update(task, description="Humanizing generated content...")
                result['output']['content'] = humanize_text(result['output']['content'])
            
            return result

    result = asyncio.run(run_strategy())
    if not result:
        return
    
    console.print(Rule(f"STRATEGY REPORT: {topic}", style="bold blue"))
    console.print(Panel(result['summary'], subtitle="Executive Summary"))
    
    # Research Tabs or Sections
    console.print("\n[bold]1. Keyword Research[/bold]")
    console.print(Panel(result['research']['keywords']['keywords_report'], border_style="blue"))
    
    console.print("\n[bold]2. Competitor Analysis[/bold]")
    console.print(Panel(result['research']['competitors']['insights'], border_style="magenta"))
    
    if result['research']['site_audit']:
        console.print("\n[bold]3. Site Audit[/bold]")
        audit = result['research']['site_audit']
        score_color = "green" if audit['seo_score'] > 80 else "yellow" if audit['seo_score'] > 50 else "red"
        console.print(f"Score: [{score_color}]{audit['seo_score']}/100[/{score_color}]")
        console.print(f"Title: {audit['title']}")
    
    console.print("\n[bold]4. Content Draft[/bold]")
    # Truncate content for display but keep full for export
    content_preview = result['output']['content'][:500] + "..." if len(result['output']['content']) > 500 else result['output']['content']
    console.print(Panel(Markdown(content_preview), title="Content Preview (First 500 chars)"))
    
    if export:
        export_result(result, export)

@cli.command()
@click.option('--text', help="Direct text to humanize.")
@click.option('--file', help="Path to a file containing text to humanize.")
@click.option('--export', help="Export humanized text to file.")
def humanize(text, file, export):
    """Rewrite AI-generated text to sound more human."""
    content_to_fix = ""
    if file:
        try:
            with open(file, 'r', encoding='utf-8') as f:
                content_to_fix = f.read()
        except Exception as e:
            console.print(f"[red]Error reading file: {str(e)}[/red]")
            return
    elif text:
        content_to_fix = text
    else:
        console.print("[yellow]Please provide either --text or --file.[/yellow]")
        return

    with console.status("[bold green]Humanizing content...", spinner="aesthetic"):
        humanized = humanize_text(content_to_fix)
    
    console.print(Panel(Markdown(humanized), title="Humanized Content"))
    
    if export:
        export_result(humanized, export, format='md')

@cli.command()
@click.argument('prompt', required=False)
def chat(prompt):
    """💬 Chat with the AI Assistant (General purpose)."""
    if prompt:
        # Single question mode
        with console.status("[bold green]Thinking...", spinner="dots"):
            response = chat_agent.ask(prompt)
        console.print(Panel(Markdown(response), title="AI Assistant", border_style="green"))
        return

    # Interactive REPL mode
    console.print(Panel.fit(" [bold green]AI Assistant - Chat Mode[/bold green] \n[dim]Type 'exit' or 'quit' to end session.[/dim] ", border_style="green"))
    
    import questionary
    while True:
        user_input = questionary.text("You:", qmark="👤").ask()
        
        if not user_input or user_input.lower() in ['exit', 'quit']:
            break
            
        with console.status("[bold green]Thinking...", spinner="dots"):
            response = chat_agent.ask(user_input)
            
        console.print(Markdown(f"**Assistant:**\n{response}"))
        console.print(Rule(style="dim"))

@cli.command()
@click.argument('urls', required=False)
@click.option('--file', help="Path to a file containing URLs (one per line).")
@click.option('--export', help="Export results to JSON file.")
def audit_batch(urls, file, export):
    """Run SEO audits on multiple URLs in batch."""
    url_list = []
    if file:
        try:
            with open(file, 'r') as f:
                url_list = [line.strip() for line in f if line.strip()]
        except Exception as e:
            console.print(f"[red]Error reading file: {str(e)}[/red]")
            return
    elif urls:
        url_list = [u.strip() for u in urls.split(',')]
    else:
        console.print("[yellow]Please provide URLs as an argument or via --file.[/yellow]")
        return

    results = []
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=False,
    ) as progress:
        task = progress.add_task(description="Batch auditing...", total=len(url_list))
        
        for url in url_list:
            progress.update(task, description=f"Auditing {url}...")
            res = audit_website(url)
            results.append(res)
            progress.advance(task)

    table = Table(title="Batch SEO Audit Results", box=box.ROUNDED)
    table.add_column("URL", style="blue")
    table.add_column("Score", style="bold")
    table.add_column("Title", style="cyan")
    table.add_column("Status", style="green")

    for res in results:
        if "error" in res:
            table.add_row(res.get('url', 'Unknown'), "[red]N/A[/red]", "Error", f"[red]{res['error']}[/red]")
        else:
            score = res['seo_score']
            color = "green" if score > 80 else "yellow" if score > 50 else "red"
            table.add_row(res['url'], f"[{color}]{score}[/{color}]", res['title'][:30], "✅ Success")

    console.print(table)
    
    if export:
        export_result(results, export)

@cli.command()
@click.argument('topics', required=False)
@click.option('--file', help="Path to a file containing topics (one per line).")
@click.option('--export', help="Export results to JSON file.")
def keywords_batch(topics, file, export):
    """Generate keywords for multiple topics in batch."""
    topic_list = []
    if file:
        try:
            with open(file, 'r') as f:
                topic_list = [line.strip() for line in f if line.strip()]
        except Exception as e:
            console.print(f"[red]Error reading file: {str(e)}[/red]")
            return
    elif topics:
        topic_list = [t.strip() for t in topics.split(',')]
    else:
        console.print("[yellow]Please provide topics as an argument or via --file.[/yellow]")
        return

    results = []
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=False,
    ) as progress:
        task = progress.add_task(description="Batch keyword generation...", total=len(topic_list))
        
        for topic in topic_list:
            progress.update(task, description=f"Processing '{topic}'...")
            res = run_keyword_agent(topic)
            results.append(res)
            progress.advance(task)

    console.print(Rule("Batch Keyword Results", style="bold blue"))
    for res in results:
        console.print(f"\n[bold cyan]Topic:[/bold cyan] {res['topic']}")
        preview = res['keywords_report'][:200] + "..." if len(res['keywords_report']) > 200 else res['keywords_report']
        console.print(Panel(preview, border_style="blue"))

    if export:
        export_result(results, export)

import subprocess
import signal

# --- Service Orchestration ---

@cli.group()
def serve():
    """Launch platform services (Backend & Frontend)."""
    pass

@serve.command(name='all')
@click.option('--port', default=8000, help="Backend port.")
@click.option('--host', default="0.0.0.0", help="Backend host.")
def serve_all(port, host):
    """Start both Backend (FastAPI) and Frontend (Vite) in parallel."""
    console.print(Rule("Launching SEO SaaS Services", style="bold green"))
    
    backend_cmd = [sys.executable, "-m", "uvicorn", "app.main:app", "--host", host, "--port", str(port), "--reload"]
    frontend_dir = os.path.join(os.path.dirname(backend_dir), 'frontend')
    frontend_cmd = ["npm", "run", "dev"]
    
    processes = []
    try:
        console.print(f"[cyan]🚀 Starting Backend on http://{host}:{port}[/cyan]")
        p_back = subprocess.Popen(backend_cmd, cwd=backend_dir)
        processes.append(p_back)
        
        console.print(f"[cyan]🚀 Starting Frontend in {frontend_dir}[/cyan]")
        p_front = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)
        processes.append(p_front)
        
        console.print("\n[bold yellow]Press Ctrl+C to stop all services.[/bold yellow]\n")
        
        # Keep main thread alive
        while True:
            time.sleep(1)
            if p_back.poll() is not None or p_front.poll() is not None:
                break
                
    except KeyboardInterrupt:
        console.print("\n[bold red]Stopping services...[/bold red]")
    finally:
        for p in processes:
            p.terminate()
            p.wait()
        console.print("[dim]Services stopped.[/dim]")

# --- Model Intelligence ---

@cli.group()
def models():
    """Manage and benchmark AI models."""
    pass

@models.command(name='list')
def models_list():
    """List all supported and active AI models."""
    from app.core.config import settings
    table = Table(title="AI Model Registry", box=box.ROUNDED)
    table.add_column("Provider", style="cyan")
    table.add_column("Model ID", style="yellow")
    table.add_column("Status", style="bold")
    
    providers = [
        ("Google Gemini", settings.GEMINI_MODEL, "GEMINI_API_KEY"),
        ("OpenRouter", "DeepSeek-V3", "OPENROUTER_API_KEY"),
        ("SerpApi", "Google Search", "SERPAPI_API_KEY"),
    ]
    
    for name, mid, env_key in providers:
        status = "[green]Ready[/green]" if os.getenv(env_key) else "[red]Not Configured[/red]"
        table.add_row(name, mid, status)
        
    console.print(table)

@models.command(name='bench')
def models_bench():
    """Benchmark configured models and services with a latency test."""
    from app.services.gemini_service import get_gemini_model, generate_with_openrouter
    from app.services.serpapi_service import fetch_competitors
    
    results = []
    
    with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}")) as progress:
        # 1. Gemini Benchmark
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if gemini_api_key and not gemini_api_key.startswith("ADD_YOUR"):
            task = progress.add_task("[cyan]Benchmarking Google Gemini...", total=None)
            start = time.time()
            try:
                model = get_gemini_model()
                if model:
                    model.generate_content("ping")
                    latency = (time.time() - start) * 1000
                    results.append(("Google Gemini", "gemini-2.0-flash", f"[green]Online[/green]", f"{latency:.0f}ms"))
                    progress.update(task, description="[cyan]Benchmarking Google Gemini... [green]Done[/green]")
                else:
                    results.append(("Google Gemini", "gemini-2.0-flash", "[red]Failed[/red]", "N/A"))
                    progress.update(task, description="[cyan]Benchmarking Google Gemini... [red]Failed[/red]")
            except Exception as e:
                results.append(("Google Gemini", "gemini-2.0-flash", f"[red]Error: {str(e)}[/red]", "N/A"))
                progress.update(task, description="[cyan]Benchmarking Google Gemini... [red]Failed[/red]")
        else:
            results.append(("Google Gemini", "gemini-2.0-flash", "[yellow]Not Configured[/yellow]", "N/A"))

        # 2. OpenRouter Benchmark
        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if openrouter_api_key and not openrouter_api_key.startswith("ADD_YOUR"):
            task = progress.add_task("[cyan]Benchmarking OpenRouter (Gemini Pro)...", total=None)
            start = time.time()
            try:
                res = generate_with_openrouter("ping")
                if res and "AI Error" not in res:
                    latency = (time.time() - start) * 1000
                    results.append(("OpenRouter", "gemini-2.0-flash-001", "[green]Online[/green]", f"{latency:.0f}ms"))
                    progress.update(task, description="[cyan]Benchmarking OpenRouter... [green]Done[/green]")
                else:
                    results.append(("OpenRouter", "gemini-2.0-flash-001", "[red]Failed[/red]", "N/A"))
                    progress.update(task, description="[cyan]Benchmarking OpenRouter... [red]Failed[/red]")
            except Exception as e:
                results.append(("OpenRouter", "gemini-2.0-flash-001", f"[red]Error: {str(e)}[/red]", "N/A"))
                progress.update(task, description="[cyan]Benchmarking OpenRouter... [red]Failed[/red]")
        else:
            results.append(("OpenRouter", "gemini-2.0-flash-001", "[yellow]Not Configured[/yellow]", "N/A"))

        # 3. SerpApi Benchmark
        serpapi_key = os.getenv("SERPAPI_KEY") or os.getenv("SERPAPI_API_KEY")
        if serpapi_key and not serpapi_key.startswith("ADD_YOUR"):
            os.environ["SERPAPI_KEY"] = serpapi_key
            task = progress.add_task("[cyan]Benchmarking SerpApi...", total=None)
            start = time.time()
            try:
                fetch_competitors("ping")
                latency = (time.time() - start) * 1000
                results.append(("SerpApi", "Google Search Engine", "[green]Online[/green]", f"{latency:.0f}ms"))
                progress.update(task, description="[cyan]Benchmarking SerpApi... [green]Done[/green]")
            except Exception as e:
                results.append(("SerpApi", "Google Search Engine", f"[red]Error: {str(e)}[/red]", "N/A"))
                progress.update(task, description="[cyan]Benchmarking SerpApi... [red]Failed[/red]")
        else:
            results.append(("SerpApi", "Google Search Engine", "[yellow]Not Configured[/yellow]", "N/A"))

    table = Table(title="Model & API Latency Benchmark", box=box.ROUNDED)
    table.add_column("Provider/Service", style="cyan")
    table.add_column("Model/Target", style="yellow")
    table.add_column("Status", style="bold")
    table.add_column("Latency", style="green")
    
    for provider, model_id, status, latency in results:
        table.add_row(provider, model_id, status, latency)
        
    console.print(table)

@cli.command()
@click.option('--format', type=click.Choice(['json', 'md', 'html']), default='json', help="Export format.")
@click.argument('url')
@click.argument('output_file')
def export_audit(url, output_file, format):
    """Deep audit a URL and export in multiple formats."""
    with console.status(f"Auditing {url}..."):
        result = audit_website(url)
        
    if format == 'json':
        export_result(result, output_file, 'json')
    elif format == 'md':
        md = f"# SEO Report: {url}\n\n"
        md += f"**Score:** {result['seo_score']}/100\n\n"
        md += f"**Title:** {result['title']}\n\n"
        md += "## Meta Data\n"
        md += f"- **Description:** {result['meta_description']}\n"
        md += f"- **Links Found:** {result['total_links']}\n"
        export_result(md, output_file, 'md')
    elif format == 'html':
        html = f"<html><body><h1>SEO Report: {url}</h1><p>Score: {result['seo_score']}</p></body></html>"
        with open(output_file, 'w') as f:
            f.write(html)
        console.print(f"Exported HTML to {output_file}")

from rich.live import Live
from rich.layout import Layout
from datetime import datetime

def make_dashboard_layout() -> Layout:
    """Create the dashboard layout structure."""
    layout = Layout()
    layout.split_column(
        Layout(name="header", size=3),
        Layout(name="main", ratio=1),
        Layout(name="footer", size=3),
    )
    layout["main"].split_row(
        Layout(name="side", ratio=1),
        Layout(name="body", ratio=3),
    )
    return layout

from rich.live import Live
from rich.layout import Layout
from datetime import datetime

def make_dashboard_layout() -> Layout:
    """Create the TUI dashboard layout structure."""
    layout = Layout()
    layout.split_column(
        Layout(name="header", size=3),
        Layout(name="main", ratio=1),
        Layout(name="footer", size=3),
    )
    layout["main"].split_row(
        Layout(name="side", ratio=1),
        Layout(name="body", ratio=3),
    )
    return layout

from rich.live import Live
from rich.layout import Layout
from datetime import datetime

def make_dashboard_layout() -> Layout:
    layout = Layout()
    layout.split_column(
        Layout(name="header", size=3),
        Layout(name="main", ratio=1),
        Layout(name="footer", size=3),
    )
    layout["main"].split_row(
        Layout(name="side", ratio=1),
        Layout(name="body", ratio=3),
    )
    return layout

# --- Enhanced Dashboard ---

@cli.command()
def dashboard():
    """📊 Live SEO Mission Control Dashboard."""
    layout = make_dashboard_layout()
    
    async def get_dashboard_stats():
        async with AsyncSessionLocal() as session:
            p_res = await session.execute(select(func.count(Project.id)))
            projects_count = p_res.scalar() or 0
            
            r_res = await session.execute(select(func.count(SEOReport.id), func.avg(SEOReport.seo_score)))
            r_row = r_res.first()
            reports_count = r_row[0] or 0
            avg_score = r_row[1] or 0.0
            
            k_res = await session.execute(select(func.count(KeywordResearch.id)))
            keywords_count = k_res.scalar() or 0
            
            c_res = await session.execute(select(func.count(CompetitorAnalysis.id)))
            competitors_count = c_res.scalar() or 0
            
            reports_latest = await session.execute(
                select(SEOReport.url, SEOReport.created_at)
                .order_by(SEOReport.created_at.desc())
                .limit(5)
            )
            activities = [("AuditAgent", row[0], "[green]DONE[/green]", row[1]) for row in reports_latest.all()]
            
            keywords_latest = await session.execute(
                select(KeywordResearch.topic, KeywordResearch.created_at)
                .order_by(KeywordResearch.created_at.desc())
                .limit(5)
            )
            activities += [("KeywordAgent", row[0], "[green]DONE[/green]", row[1]) for row in keywords_latest.all()]
            
            competitors_latest = await session.execute(
                select(CompetitorAnalysis.keyword, CompetitorAnalysis.created_at)
                .order_by(CompetitorAnalysis.created_at.desc())
                .limit(5)
            )
            activities += [("CompetitorAgent", row[0], "[green]DONE[/green]", row[1]) for row in competitors_latest.all()]
            
            activities.sort(key=lambda x: x[3], reverse=True)
            latest_activities = activities[:5]
            
            return {
                "projects": projects_count,
                "audits": reports_count,
                "avg_score": float(avg_score),
                "keywords": keywords_count,
                "competitors": competitors_count,
                "activities": latest_activities
            }

    def update_content():
        now = datetime.now().strftime("%H:%M:%S")
        layout["header"].update(Panel(
            f"[bold blue]SEO SaaS Platform - Mission Control[/bold blue] | {now}",
            border_style="blue"
        ))
        
        try:
            stats = asyncio.run(get_dashboard_stats())
        except Exception as e:
            stats = {
                "projects": 0,
                "audits": 0,
                "avg_score": 0.0,
                "keywords": 0,
                "competitors": 0,
                "activities": []
            }
            
        status_table = Table(show_header=False, box=box.SIMPLE)
        status_table.add_row("Backend", "[green]Healthy[/green]")
        status_table.add_row("Projects", str(stats["projects"]))
        status_table.add_row("Total Audits", str(stats["audits"]))
        status_table.add_row("Avg SEO Score", f"{stats['avg_score']:.1f}/100")
        status_table.add_row("Keyword Strat", str(stats["keywords"]))
        status_table.add_row("Competitor Runs", str(stats["competitors"]))
        status_table.add_row("Gemini", "[green]Ready[/green]" if os.getenv("GEMINI_API_KEY") else "[red]OFF[/red]")
        layout["side"].update(Panel(status_table, title="System Stats", border_style="cyan"))
        
        activity_table = Table(title="Recent Orchestrations", box=box.ROUNDED, expand=True)
        activity_table.add_column("Agent", style="bold")
        activity_table.add_column("Topic/URL")
        activity_table.add_column("Status", style="dim")
        activity_table.add_column("Time", style="dim")
        
        for agent, target, status, dt in stats["activities"]:
            time_str = dt.strftime("%H:%M:%S")
            activity_table.add_row(agent, target[:45] + "..." if len(target) > 45 else target, status, time_str)
            
        if not stats["activities"]:
            activity_table.add_row("None", "No recent runs in database.", "", "")
            
        layout["body"].update(Panel(activity_table, border_style="magenta"))
        layout["footer"].update(Panel("[dim]Dashboard v2.5 • Ctrl+C to Exit[/dim]", border_style="dim"))

    with Live(layout, refresh_per_second=2, screen=True):
        try:
            while True:
                update_content()
                time.sleep(0.5)
        except KeyboardInterrupt:
            pass

# --- Utility Commands ---

@cli.command()
def doctor():
    """🩺 Check system health and connectivity."""
    console.print(Rule("SEO Platform Diagnostic", style="bold blue"))
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=False,
    ) as progress:
        # 1. Environment Check
        task1 = progress.add_task(description="Checking .env file...", total=1)
        env_path = os.path.join(backend_dir, '.env')
        if os.path.exists(env_path):
            progress.update(task1, completed=1, description="[green]✅ .env file found[/green]")
        else:
            progress.update(task1, completed=1, description="[red]❌ .env file missing[/red]")

        # 2. Database Check
        task2 = progress.add_task(description="Checking Database connectivity...", total=1)
        try:
            from app.core.database import engine
            import asyncio
            from sqlalchemy import text
            
            async def check_db():
                async with engine.connect() as conn:
                    await conn.execute(text("SELECT 1"))
            
            asyncio.run(check_db())
            progress.update(task2, completed=1, description="[green]✅ Database connected[/green]")
        except Exception as e:
            progress.update(task2, completed=1, description=f"[red]❌ Database error: {str(e)}[/red]")

        # 3. API Keys Check
        task3 = progress.add_task(description="Checking API Keys...", total=1)
        keys = {
            "GEMINI_API_KEY": os.getenv("GEMINI_API_KEY"),
            "OPENROUTER_API_KEY": os.getenv("OPENROUTER_API_KEY"),
            "SERPAPI_API_KEY": os.getenv("SERPAPI_API_KEY")
        }
        
        missing_keys = [k for k, v in keys.items() if not v or v.startswith("ADD_YOUR")]
        if not missing_keys:
            progress.update(task3, completed=1, description="[green]✅ All primary API keys configured[/green]")
        else:
            progress.update(task3, completed=1, description=f"[yellow]⚠️ Missing keys: {', '.join(missing_keys)}[/yellow]")

        # 4. Internet Connectivity
        task4 = progress.add_task(description="Checking internet connectivity...", total=1)
        try:
            import requests
            requests.get("https://google.com", timeout=5)
            progress.update(task4, completed=1, description="[green]✅ Internet connection active[/green]")
        except:
            progress.update(task4, completed=1, description="[red]❌ No internet connection[/red]")

    console.print("\n[bold cyan]System Status Summary:[/bold cyan]")
    if not missing_keys and os.path.exists(env_path):
        console.print(Panel("✨ Everything looks good! You're ready to dominate SEO.", border_style="green"))
    else:
        console.print(Panel("🔧 Some issues were found. Please check your .env file and API keys.", border_style="yellow"))

# --- Interactive Mode Helpers ---

async def get_projects_list():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Project))
        return result.scalars().all()

async def db_create_project(name: str, domain: str):
    async with AsyncSessionLocal() as session:
        p = Project(name=name, domain=domain)
        session.add(p)
        await session.commit()
        return p.id

def prompt_select_project(action_name: str) -> int:
    """Prompt the user to optionally associate an action with a project, returning project_id or None."""
    import questionary
    import asyncio
    
    if not questionary.confirm(f"Would you like to associate this {action_name} with an SEO Project?").ask():
        return None
        
    projects = asyncio.run(get_projects_list())
    if not projects:
        if questionary.confirm("No projects exist. Create one now?").ask():
            name = questionary.text("Project Name:").ask()
            domain = questionary.text("Target Domain:").ask()
            if name and domain:
                return asyncio.run(db_create_project(name, domain))
        return None
        
    choices = [f"{p.id}: {p.name} ({p.domain})" for p in projects] + ["Create New Project", "Skip / No Project"]
    selection = questionary.select("Choose a project:", choices=choices).ask()
    
    if selection == "Create New Project":
        name = questionary.text("Project Name:").ask()
        domain = questionary.text("Target Domain:").ask()
        if name and domain:
            return asyncio.run(db_create_project(name, domain))
    elif selection != "Skip / No Project" and selection:
        return int(selection.split(":")[0])
        
    return None

# --- Interactive Mode ---

@cli.command()
def interactive():
    """🚀 Start a guided SEO session."""
    import questionary
    
    while True:
        console.clear()
        console.print(Panel.fit(" [bold blue]SEO SaaS Platform - Interactive Mode[/bold blue] ", border_style="blue"))
        
        action = questionary.select(
            "What would you like to do?",
            choices=[
                "Mission Control (Dashboard)",
                "Quick SEO Audit",
                "Batch SEO Audit",
                "Content Gap Analysis (Spy Mode)",
                "Keyword Research",
                "Batch Keywords",
                "Competitor Analysis",
                "Content Generation",
                "Content Arena (Compare AIs)",
                "Humanize Existing Text",
                "AI Assistant (Chat)",
                "Full SEO Strategy",
                "System Health (Doctor)",
                "Manage Projects",
                "Manage Configuration",
                "Exit"
            ]
        ).ask()
        
        if not action or action == "Exit":
            console.print("[yellow]Goodbye! 👋[/yellow]")
            break
        
        ctx = click.get_current_context()
        
        try:
            if action == "Mission Control (Dashboard)":
                ctx.invoke(dashboard)

            elif action == "Quick SEO Audit":
                url = questionary.text("Enter the website URL to audit:").ask()
                if url:
                    do_schema = questionary.confirm("Generate JSON-LD Schema Markup?").ask()
                    project_id = prompt_select_project("Audit")
                    ctx.invoke(audit, url=url, export=None, schema=do_schema, project_id=project_id)

            elif action == "Batch SEO Audit":
                urls = questionary.text("Enter URLs (comma-separated):").ask()
                if urls:
                    ctx.invoke(audit_batch, urls=urls, file=None, export=None)

            elif action == "Content Gap Analysis (Spy Mode)":
                my_url = questionary.text("Enter YOUR website URL:").ask()
                comp_url = questionary.text("Enter COMPETITOR website URL:").ask()
                if my_url and comp_url:
                    ctx.invoke(compare, my_url=my_url, competitor_url=comp_url, export=None)
                    
            elif action == "Keyword Research":
                topic = questionary.text("Enter the topic for keyword research:").ask()
                if topic:
                    project_id = prompt_select_project("Keyword Research")
                    ctx.invoke(keywords, topic=topic, export=None, project_id=project_id)

            elif action == "Batch Keywords":
                topics = questionary.text("Enter topics (comma-separated):").ask()
                if topics:
                    ctx.invoke(keywords_batch, topics=topics, file=None, export=None)

            elif action == "Competitor Analysis":
                topic = questionary.text("Enter the topic/keyword to analyze competitors:").ask()
                if topic:
                    project_id = prompt_select_project("Competitor Analysis")
                    ctx.invoke(competitors, topic=topic, export=None, project_id=project_id)

            elif action == "Content Generation":
                topic = questionary.text("Enter the topic for content generation:").ask()
                if topic:
                    content_type = questionary.select(
                        "What type of content?",
                        choices=["blog post", "product description", "landing page", "email"]
                    ).ask()
                    do_humanize = questionary.confirm("Apply humanization to the output?").ask()
                    
                    ctx.invoke(content, topic=topic, context="", content_type=content_type, export=None, humanize=do_humanize, arena=False)

            elif action == "Content Arena (Compare AIs)":
                topic = questionary.text("Enter the topic to compare AI outputs:").ask()
                if topic:
                    ctx.invoke(content, topic=topic, context="", content_type="blog post", export=None, humanize=False, arena=True)

            elif action == "Humanize Existing Text":
                text = questionary.text("Paste the text you want to humanize:").ask()
                if text:
                    ctx.invoke(humanize, text=text, file=None, export=None)

            elif action == "AI Assistant (Chat)":
                ctx.invoke(chat, prompt=None)

            elif action == "Full SEO Strategy":
                topic = questionary.text("Enter the main topic for the strategy:").ask()
                if topic:
                    url = questionary.text("Enter target URL (optional):").ask()
                    do_humanize = questionary.confirm("Humanize the generated content?").ask()
                    project_id = prompt_select_project("Full Strategy")
                    ctx.invoke(strategy, topic=topic, url=url, export=None, humanize=do_humanize, project_id=project_id)

            elif action == "System Health (Doctor)":
                ctx.invoke(doctor)

            elif action == "Manage Projects":
                proj_action = questionary.select(
                    "Project Task:",
                    choices=["List Projects", "Create Project", "View Project Details", "Delete Project", "Back"]
                ).ask()
                
                if proj_action == "List Projects":
                    ctx.invoke(project_list)
                elif proj_action == "Create Project":
                    name = questionary.text("Project Name:").ask()
                    domain = questionary.text("Target Domain:").ask()
                    if name and domain:
                        ctx.invoke(project_create, name=name, domain=domain)
                elif proj_action == "View Project Details":
                    projects = asyncio.run(get_projects_list())
                    if not projects:
                        console.print("[yellow]No projects exist.[/yellow]")
                    else:
                        choices = [f"{p.id}: {p.name} ({p.domain})" for p in projects]
                        sel = questionary.select("Select project to view:", choices=choices).ask()
                        if sel:
                            pid = int(sel.split(":")[0])
                            ctx.invoke(project_view, project_id=pid)
                elif proj_action == "Delete Project":
                    projects = asyncio.run(get_projects_list())
                    if not projects:
                        console.print("[yellow]No projects exist.[/yellow]")
                    else:
                        choices = [f"{p.id}: {p.name} ({p.domain})" for p in projects]
                        sel = questionary.select("Select project to delete:", choices=choices).ask()
                        if sel:
                            pid = int(sel.split(":")[0])
                            ctx.invoke(project_delete, project_id=pid)

            elif action == "Manage Configuration":
                sub_action = questionary.select(
                    "Configuration Task:",
                    choices=["List All", "Set Key", "Get Key", "Back"]
                ).ask()
                
                if sub_action == "List All":
                    ctx.invoke(list_config)
                elif sub_action == "Set Key":
                    key = questionary.text("Key name:").ask()
                    val = questionary.password("Value:").ask()
                    if key and val:
                        ctx.invoke(set_config, key=key, value=val)
                elif sub_action == "Get Key":
                    key = questionary.text("Key name:").ask()
                    if key:
                        ctx.invoke(get_config, key=key)
            
            # Pause after each action so user can see output
            should_pause = True
            if action == "Manage Configuration" and sub_action == "Back":
                should_pause = False
            elif action == "Manage Projects" and proj_action == "Back":
                should_pause = False
                
            if should_pause:
                console.print("\n[dim]Press Enter to return to menu...[/dim]")
                input()

        except Exception as e:
            console.print(f"[red]An error occurred: {str(e)}[/red]")
            console.print("[dim]Press Enter to continue...[/dim]")
            input()

if __name__ == "__main__":
    cli()
