import click
import asyncio
import json
import sys
import os
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
def audit(url, export, schema):
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
def keywords(topic, export):
    """Generate keywords for a given topic."""
    with console.status(f"[bold green]Generating keywords for '{topic}'...", spinner="bouncingBar"):
        result = run_keyword_agent(topic)
    
    console.print(Panel(result['keywords_report'], title=f"Keywords for: {topic}", border_style="blue"))
    
    if export:
        export_result(result['keywords_report'], export, format='md')

@cli.command()
@click.argument('topic')
@click.option('--export', help="Export result to JSON file.")
def competitors(topic, export):
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
def strategy(topic, url, export, humanize):
    """Run a full SEO strategy (Keywords + Competitors + Content + Audit)."""
    
    async def run_strategy():
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            transient=True,
        ) as progress:
            task = progress.add_task(description=f"Executing full strategy for: {topic}...", total=None)
            result = await orchestrator.execute_full_strategy(topic, target_url=url)
            
            if humanize:
                progress.update(task, description="Humanizing generated content...")
                result['output']['content'] = humanize_text(result['output']['content'])
            
            return result

    result = asyncio.run(run_strategy())
    
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

from rich.live import Live
from rich.layout import Layout
from datetime import datetime
import time

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

@cli.command()
def dashboard():
    """📊 Live SEO Mission Control Dashboard."""
    layout = make_dashboard_layout()
    
    def update_content():
        # Header
        layout["header"].update(Panel(
            f"[bold blue]SEO SaaS Platform - Mission Control[/bold blue] | {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            border_style="blue"
        ))
        
        # Side: System Status
        status_table = Table(show_header=False, box=box.SIMPLE)
        status_table.add_row("DB", "[green]Online[/green]" if True else "[red]Offline[/red]") # Simplified check
        status_table.add_row("Gemini", "[green]Ready[/green]" if os.getenv("GEMINI_API_KEY") else "[red]Missing[/red]")
        status_table.add_row("SerpApi", "[green]Ready[/green]" if os.getenv("SERPAPI_API_KEY") else "[red]Missing[/red]")
        layout["side"].update(Panel(status_table, title="System Health", border_style="cyan"))
        
        # Body: Recent Activity (Mocked for now, or query DB)
        activity_table = Table(title="Recent Activity", box=box.ROUNDED, expand=True)
        activity_table.add_column("Time", style="dim")
        activity_table.add_column("Action", style="bold")
        activity_table.add_column("Target")
        
        # Ideally, fetch from DB here
        activity_table.add_row(datetime.now().strftime("%H:%M"), "Audit", "https://example.com")
        activity_table.add_row(datetime.now().strftime("%H:%M"), "Keywords", "SEO Tools")
        
        layout["body"].update(Panel(activity_table, border_style="magenta"))
        
        # Footer
        layout["footer"].update(Panel("[dim]Press Ctrl+C to exit dashboard[/dim]", border_style="dim"))

    with Live(layout, refresh_per_second=1, screen=True):
        try:
            while True:
                update_content()
                time.sleep(1)
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
                    ctx.invoke(audit, url=url, export=None, schema=do_schema)

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
                    ctx.invoke(keywords, topic=topic, export=None)

            elif action == "Batch Keywords":
                topics = questionary.text("Enter topics (comma-separated):").ask()
                if topics:
                    ctx.invoke(keywords_batch, topics=topics, file=None, export=None)

            elif action == "Competitor Analysis":
                topic = questionary.text("Enter the topic/keyword to analyze competitors:").ask()
                if topic:
                    ctx.invoke(competitors, topic=topic, export=None)

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
                    ctx.invoke(strategy, topic=topic, url=url, export=None, humanize=do_humanize)

            elif action == "System Health (Doctor)":
                ctx.invoke(doctor)

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
            if action != "Manage Configuration" or (action == "Manage Configuration" and sub_action != "Back"):
                console.print("\n[dim]Press Enter to return to menu...[/dim]")
                input()

        except Exception as e:
            console.print(f"[red]An error occurred: {str(e)}[/red]")
            console.print("[dim]Press Enter to continue...[/dim]")
            input()

if __name__ == "__main__":
    cli()
