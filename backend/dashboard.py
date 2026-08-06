import os
import sys
import time
import json
import asyncio
from colorama import init, Fore, Back, Style

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.agents.orchestrator import orchestrator
from app.agents.seo_audit_agent import audit_website
from app.agents.keyword_agent import run_keyword_agent
from app.agents.competitor_agent import analyze_competitors
from app.agents.content_agent import run_content_agent

init(autoreset=True)

# --- UI HELPER FUNCTIONS ---
def draw_line():
    print(Fore.CYAN + "  " + "━" * 65)

def header():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(Fore.CYAN + """
    ┌─────────────────────────────────────────────────────────────────┐
    │  %sSEO SAAS PLATFORM%s                                          │
    │  %sTerminal Command Center v2.0%s                               │
    └─────────────────────────────────────────────────────────────────┘
    """ % (Style.BRIGHT, Style.NORMAL, Fore.YELLOW, Fore.CYAN))

def print_step(step, status="PENDING"):
    colors = {"PENDING": Fore.WHITE, "RUNNING": Fore.YELLOW, "DONE": Fore.GREEN, "ERROR": Fore.RED}
    print(f"  {Fore.CYAN}[{colors[status]}●{Fore.CYAN}] {Fore.WHITE}{step.ljust(40)} {colors[status]}[{status}]")

# --- CORE TASKS ---
def run_audit():
    header()
    url = input(f"\n  {Fore.YELLOW}ENTER TARGET URL: {Fore.WHITE}")
    print_step("Initializing Web Crawler", "RUNNING")
    time.sleep(0.5)
    result = audit_website(url)
    
    header()
    print(f"\n  {Fore.GREEN}AUDIT RESULTS FOR: {url}")
    draw_line()

    if not result or result.get("error"):
        error_message = result.get("error") if isinstance(result, dict) else "Unknown error"
        print(f"  {Fore.RED}Audit failed: {Fore.WHITE}{error_message}")
        draw_line()
        input(f"\n  {Fore.CYAN}Press Enter to return to menu...")
        return

    seo_score = result.get("seo_score", 0)
    title = result.get("title") or "Missing"
    meta_description = result.get("meta_description") or "Missing"
    if len(meta_description) > 50:
        meta_description = meta_description[:50] + "..."
    h1_tags = result.get("h1_tags") or []
    total_links = result.get("total_links", 0)

    print(f"  {Fore.WHITE}SEO SCORE:        {Fore.YELLOW if seo_score < 80 else Fore.GREEN}{seo_score}/100")
    print(f"  {Fore.WHITE}PAGE TITLE:       {Fore.CYAN}{title}")
    print(f"  {Fore.WHITE}META DESCRIPTION: {Fore.CYAN}{meta_description}")
    print(f"  {Fore.WHITE}H1 TAGS:          {Fore.CYAN}{len(h1_tags)}")
    print(f"  {Fore.WHITE}TOTAL LINKS:      {Fore.CYAN}{total_links}")
    draw_line()
    input(f"\n  {Fore.CYAN}Press Enter to return to menu...")

async def run_full_strategy():
    header()
    topic = input(f"\n  {Fore.YELLOW}ENTER MAIN TOPIC: {Fore.WHITE}")
    url = input(f"  {Fore.YELLOW}ENTER URL (OPTIONAL): {Fore.WHITE}")
    
    print("\n  " + Fore.CYAN + "ORCHESTRATING AGENTS...")
    draw_line()
    
    # Run strategy
    result = await orchestrator.execute_full_strategy(topic, target_url=url if url else None)
    
    header()
    print(f"  {Fore.MAGENTA}COMPLETED STRATEGY: {topic.upper()}")
    draw_line()
    
    print(f"\n  {Fore.YELLOW}1. KEYWORD ANALYSIS")
    print(f"  {Fore.WHITE}{result['research']['keywords']['keywords_report'][:300]}...")
    
    print(f"\n  {Fore.YELLOW}2. COMPETITOR GAPS")
    print(f"  {Fore.WHITE}{result['research']['competitors']['insights'][:300]}...")
    
    print(f"\n  {Fore.YELLOW}3. AI CONTENT PREVIEW")
    print(f"  {Fore.GREEN}{result['output']['content'][:500]}...")
    
    draw_line()
    input(f"\n  {Fore.CYAN}Press Enter to return to menu...")

# --- MAIN MENU ---
def main_menu():
    while True:
        header()
        print(f"  {Fore.CYAN}[1] {Fore.WHITE}WEBSITE AUDIT           {Fore.CYAN}Analyze on-page SEO")
        print(f"  {Fore.CYAN}[2] {Fore.WHITE}KEYWORD RESEARCH        {Fore.CYAN}Generate SEO ideas")
        print(f"  {Fore.CYAN}[3] {Fore.WHITE}COMPETITOR SCAN         {Fore.CYAN}Analyze rivals")
        print(f"  {Fore.CYAN}[4] {Fore.WHITE}CONTENT GENERATOR       {Fore.CYAN}Create AI content")
        print(f"  {Fore.CYAN}[5] {Fore.MAGENTA}{Style.BRIGHT}FULL STRATEGY           {Fore.CYAN}Run All Agents")
        print(f"  {Fore.CYAN}[6] {Fore.RED}EXIT")
        print("\n")
        
        choice = input(f"  {Fore.YELLOW}SELECT OPTION > {Fore.WHITE}")
        
        if choice == '1': run_audit()
        elif choice == '2':
            header()
            topic = input(f"\n  {Fore.YELLOW}ENTER TOPIC: {Fore.WHITE}")
            print(f"\n  {Fore.CYAN}Researching...")
            res = run_keyword_agent(topic)
            print(f"\n{Fore.WHITE}{res['keywords_report']}")
            input(f"\n{Fore.CYAN}Press Enter...")
        elif choice == '5':
            asyncio.run(run_full_strategy())
        elif choice == '6':
            break

if __name__ == "__main__":
    main_menu()
