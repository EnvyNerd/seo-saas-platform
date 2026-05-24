from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import os
import time
from datetime import datetime

def audit_website(url: str):
    """
    Deep SEO Audit Agent: Uses Playwright for JS rendering and BeautifulSoup for parsing.
    """
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # Navigate with a timeout and wait for network idle
            page.goto(url, wait_until="networkidle", timeout=30000)
            
            # Give it an extra second for any late JS
            time.sleep(1)
            
            # Take a screenshot for the report
            screenshot_name = f"audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            screenshot_dir = os.path.join("data", "screenshots")
            if not os.path.exists(screenshot_dir):
                os.makedirs(screenshot_dir)
            
            screenshot_path = os.path.join(screenshot_dir, screenshot_name)
            page.screenshot(path=screenshot_path)
            
            # Get the rendered HTML
            content = page.content()
            soup = BeautifulSoup(content, "lxml")
            
            title = soup.title.string if soup.title else "Missing"
            
            meta_description = soup.find("meta", attrs={"name": "description"})
            meta_description = (
                meta_description["content"]
                if meta_description and "content" in meta_description.attrs
                else "Missing"
            )
            
            h1_tags = [h1.text.strip() for h1 in soup.find_all("h1")]
            
            images = soup.find_all("img")
            missing_alt = sum(1 for img in images if not img.get("alt"))
            
            links = soup.find_all("a")
            total_links = len(links)
            
            # Basic score logic
            score = 100
            if title == "Missing": score -= 20
            if meta_description == "Missing": score -= 20
            if len(h1_tags) == 0: score -= 15
            if missing_alt > 0: score -= 10
            
            browser.close()
            
            return {
                "url": url,
                "seo_score": score,
                "title": title,
                "meta_description": meta_description,
                "h1_tags": h1_tags,
                "total_links": total_links,
                "missing_alt_images": missing_alt,
                "screenshot_path": screenshot_path,
                "timestamp": datetime.now().isoformat()
            }

    except Exception as e:
        return {"error": str(e)}
