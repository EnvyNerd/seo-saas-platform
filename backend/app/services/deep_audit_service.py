"""
Deep SEO Audit Service
======================
Full 6-pillar SEO analysis:
  1. Crawlability & Indexability
  2. Technical Performance
  3. Content Quality & Intent Match
  4. Search Visibility
  5. Brand Representation
  6. Authority Signals
"""

import re
import time
import json
from datetime import datetime
from urllib.parse import urlparse, urljoin

import requests
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup


# ──────────────────────────────────────────────
# 1. RAW DATA COLLECTION (Playwright + requests)
# ──────────────────────────────────────────────

def _fetch_page(url: str, timeout: int = 30000) -> dict:
    """
    Fetch a page with Playwright and return raw extracted data.
    Returns dict with: soup, status_code, headers, response_time, raw_html, final_url
    """
    result = {
        "url": url,
        "final_url": url,
        "status_code": None,
        "response_time_ms": None,
        "headers": {},
        "html": "",
        "soup": None,
        "screenshot_path": None,
        "error": None,
    }

    try:
        start = time.time()
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
            )
            page = context.new_page()

            response = page.goto(url, wait_until="networkidle", timeout=timeout)
            result["response_time_ms"] = round((time.time() - start) * 1000, 1)
            result["status_code"] = response.status if response else None
            result["final_url"] = page.url

            time.sleep(1)  # Late JS
            html = page.content()
            result["html"] = html
            result["soup"] = BeautifulSoup(html, "lxml")

            browser.close()
    except Exception as e:
        result["error"] = str(e)

    return result


def _fetch_response_headers(url: str) -> dict:
    """Get HTTP response headers via requests (lightweight)."""
    try:
        r = requests.head(url, timeout=10, allow_redirects=True)
        return dict(r.headers)
    except Exception:
        return {}


def _check_robots_txt(url: str) -> dict:
    """Check robots.txt for crawl rules."""
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    try:
        r = requests.get(robots_url, timeout=10)
        if r.status_code == 200:
            content = r.text
            sitemaps = re.findall(r'^[Ss]itemap:\s*(.+)$', content, re.MULTILINE)
            disallowed = re.findall(r'^[Dd]isallow:\s*(.+)$', content, re.MULTILINE)
            return {
                "exists": True,
                "sitemaps": sitemaps,
                "disallowed_paths": disallowed[:20],
                "raw": content[:2000],
            }
        return {"exists": False, "status_code": r.status_code}
    except Exception as e:
        return {"exists": False, "error": str(e)}


def _check_sitemap(url: str) -> dict:
    """Check if sitemap.xml exists."""
    parsed = urlparse(url)
    sitemap_url = f"{parsed.scheme}://{parsed.netloc}/sitemap.xml"
    try:
        r = requests.get(sitemap_url, timeout=10)
        if r.status_code == 200:
            return {"exists": True, "url": sitemap_url, "size_bytes": len(r.content)}
        return {"exists": False, "status_code": r.status_code}
    except Exception as e:
        return {"exists": False, "error": str(e)}


# ──────────────────────────────────────────────
# 2. PILLAR SCORING ENGINES
# ──────────────────────────────────────────────

def _score_crawlability(page: dict, headers: dict, robots: dict, sitemap: dict) -> dict:
    """
    Pillar 1: Crawlability & Indexability
    Checks: robots.txt, sitemap, status codes, canonical, noindex, redirects, page speed
    """
    score = 100
    findings = []
    soup = page.get("soup")

    # Status code
    status = page.get("status_code")
    if status and status >= 400:
        score -= 30
        findings.append(f"❌ HTTP {status} — page is not accessible to crawlers")
    elif status == 301 or status == 302:
        score -= 5
        findings.append(f"⚠️ HTTP {status} redirect — ensure it's permanent (301) not temporary")
    elif status == 200:
        findings.append("✅ HTTP 200 — page is accessible")

    # robots.txt
    if robots.get("exists"):
        findings.append("✅ robots.txt found")
    else:
        score -= 5
        findings.append("⚠️ No robots.txt — not critical but recommended")

    # Sitemap
    if sitemap.get("exists"):
        findings.append("✅ sitemap.xml found")
    else:
        score -= 10
        findings.append("❌ No sitemap.xml — hinders discovery of pages")

    # Canonical tag
    if soup:
        canonical = soup.find("link", attrs={"rel": "canonical"})
        if canonical:
            findings.append(f"✅ Canonical tag present: {canonical.get('href', '')}")
        else:
            score -= 10
            findings.append("❌ No canonical tag — risk of duplicate content issues")

    # Noindex / nofollow meta
    if soup:
        robots_meta = soup.find("meta", attrs={"name": re.compile(r"robots", re.I)})
        if robots_meta:
            content = robots_meta.get("content", "").lower()
            if "noindex" in content:
                score -= 40
                findings.append("🚫 noindex meta tag — page will NOT be indexed")
            if "nofollow" in content:
                score -= 5
                findings.append("⚠️ nofollow meta tag — link equity won't pass")
            if "noindex" not in content and "nofollow" not in content:
                findings.append(f"✅ robots meta: {content}")
        else:
            findings.append("✅ No restrictive robots meta tag")

    # Response time
    resp_time = page.get("response_time_ms")
    if resp_time:
        if resp_time > 5000:
            score -= 15
            findings.append(f"🐌 Slow response: {resp_time}ms — Google penalizes slow pages")
        elif resp_time > 3000:
            score -= 8
            findings.append(f"⚠️ Response time: {resp_time}ms — aim for <2s")
        else:
            findings.append(f"✅ Response time: {resp_time}ms")

    # X-Robots-Tag header
    x_robots = headers.get("X-Robots-Tag", "")
    if x_robots:
        if "noindex" in x_robots.lower():
            score -= 40
            findings.append(f"🚫 X-Robots-Tag: noindex header — page blocked from indexing")
        else:
            findings.append(f"ℹ️ X-Robots-Tag header: {x_robots}")

    return {
        "pillar": "1. Crawlability & Indexability",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


def _score_technical(page: dict, headers: dict) -> dict:
    """
    Pillar 2: Technical Performance
    Checks: SSL, viewport, HTML lang, structured data, resource hints, mixed content, page weight
    """
    score = 100
    findings = []
    soup = page.get("soup")
    url = page.get("url", "")

    # SSL / HTTPS
    if url.startswith("https://"):
        findings.append("✅ HTTPS enabled")
    elif url.startswith("http://"):
        score -= 20
        findings.append("❌ HTTP (not HTTPS) — ranking signal and trust issue")

    # HSTS header
    hsts = headers.get("Strict-Transport-Security", "")
    if hsts:
        findings.append("✅ HSTS header present")
    elif url.startswith("https://"):
        score -= 5
        findings.append("⚠️ No HSTS header — consider enabling for security")

    # Viewport (mobile-friendly)
    if soup:
        viewport = soup.find("meta", attrs={"name": "viewport"})
        if viewport:
            findings.append("✅ Viewport meta tag present (mobile-friendly)")
        else:
            score -= 15
            findings.append("❌ No viewport meta tag — not mobile-friendly")

    # HTML lang attribute
    if soup and soup.html:
        lang = soup.html.get("lang")
        if lang:
            findings.append(f"✅ HTML lang attribute: {lang}")
        else:
            score -= 5
            findings.append("⚠️ No HTML lang attribute — helps search engines understand language")

    # Structured data / JSON-LD
    if soup:
        jsonld = soup.find_all("script", attrs={"type": "application/ld+json"})
        if jsonld:
            findings.append(f"✅ {len(jsonld)} JSON-LD structured data block(s) found")
            for block in jsonld:
                try:
                    data = json.loads(block.string or "")
                    sd_type = data.get("@type", "Unknown")
                    findings.append(f"   📦 Schema type: {sd_type}")
                except (json.JSONDecodeError, TypeError):
                    findings.append("   ⚠️ Structured data block has invalid JSON")
        else:
            score -= 10
            findings.append("❌ No JSON-LD structured data — missing rich snippet opportunity")

    # Open Graph / social meta
    if soup:
        og_title = soup.find("meta", attrs={"property": "og:title"})
        og_desc = soup.find("meta", attrs={"property": "og:description"})
        og_image = soup.find("meta", attrs={"property": "og:image"})
        og_count = sum(1 for x in [og_title, og_desc, og_image] if x)
        if og_count >= 2:
            findings.append(f"✅ Open Graph tags present ({og_count}/3 core tags)")
        else:
            score -= 5
            findings.append(f"⚠️ Open Graph tags incomplete ({og_count}/3) — social sharing won't be optimized")

    # Twitter Card
    if soup:
        tw_card = soup.find("meta", attrs={"name": "twitter:card"})
        if tw_card:
            findings.append("✅ Twitter Card meta present")
        else:
            score -= 3
            findings.append("⚠️ No Twitter Card meta — social previews may be suboptimal")

    # Resource hints (preload, prefetch, preconnect)
    if soup:
        resource_hints = soup.find_all("link", attrs={"rel": re.compile(r"preload|prefetch|preconnect", re.I)})
        if resource_hints:
            findings.append(f"✅ {len(resource_hints)} resource hint(s) for performance")
        else:
            findings.append("ℹ️ No resource hints — preload key assets for faster rendering")

    # Mixed content (HTTP resources on HTTPS page)
    if soup and url.startswith("https://"):
        mixed = soup.find_all(src=re.compile(r"^http://"))
        mixed += soup.find_all(href=re.compile(r"^http://"))
        # Filter out external links
        page_domain = urlparse(url).netloc
        mixed_insecure = [el for el in mixed if page_domain in (el.get("src") or el.get("href") or "")]
        if mixed_insecure:
            score -= 10
            findings.append(f"⚠️ Mixed content: {len(mixed_insecure)} insecure resource(s) on HTTPS page")
        else:
            findings.append("✅ No mixed content issues")

    return {
        "pillar": "2. Technical Performance",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


def _score_content_quality(page: dict, url: str) -> dict:
    """
    Pillar 3: Content Quality & Intent Match
    Checks: title, meta description, headings hierarchy, content length, keyword density,
            readability signals, media, freshness, E-E-A-T signals
    """
    score = 100
    findings = []
    soup = page.get("soup")

    if not soup:
        return {"pillar": "3. Content Quality & Intent Match", "score": 0, "max_score": 100, "findings": ["Could not parse page content"]}

    # Title tag
    title = soup.title.string if soup.title else ""
    if title:
        tlen = len(title)
        if 30 <= tlen <= 60:
            findings.append(f"✅ Title ({tlen} chars): {title[:80]}")
        elif tlen > 60:
            score -= 10
            findings.append(f"⚠️ Title too long ({tlen} chars, aim for 50-60): {title[:80]}...")
        else:
            score -= 10
            findings.append(f"⚠️ Title too short ({tlen} chars): {title}")
    else:
        score -= 25
        findings.append("❌ No title tag — critical SEO element missing")

    # Meta description
    meta_desc = soup.find("meta", attrs={"name": "description"})
    meta_content = meta_desc["content"] if meta_desc and "content" in meta_desc.attrs else ""
    if meta_content:
        dlen = len(meta_content)
        if 120 <= dlen <= 160:
            findings.append(f"✅ Meta description ({dlen} chars)")
        elif dlen > 160:
            score -= 5
            findings.append(f"⚠️ Meta description too long ({dlen} chars): {meta_content[:80]}...")
        else:
            score -= 5
            findings.append(f"⚠️ Meta description too short ({dlen} chars): {meta_content}")
    else:
        score -= 15
        findings.append("❌ No meta description — missing CTR optimization opportunity")

    # Heading hierarchy
    h1_tags = soup.find_all("h1")
    h2_tags = soup.find_all("h2")
    h3_tags = soup.find_all("h3")

    if len(h1_tags) == 1:
        findings.append(f"✅ One H1 tag: {h1_tags[0].text.strip()[:80]}")
    elif len(h1_tags) == 0:
        score -= 20
        findings.append("❌ No H1 tag — page lacks clear primary topic")
    else:
        score -= 10
        findings.append(f"⚠️ {len(h1_tags)} H1 tags — should have exactly one")

    if h2_tags:
        findings.append(f"✅ {len(h2_tags)} H2 subheadings for structure")
    else:
        score -= 10
        findings.append("❌ No H2 headings — content lacks structure")

    if h3_tags:
        findings.append(f"✅ {len(h3_tags)} H3 subheadings for deeper structure")

    # Content body text length
    body_text = soup.get_text(separator=" ", strip=True)
    word_count = len(body_text.split())
    if word_count >= 1500:
        findings.append(f"✅ Content length: ~{word_count} words (comprehensive)")
    elif word_count >= 800:
        score -= 5
        findings.append(f"⚠️ Content length: ~{word_count} words (consider expanding)")
    elif word_count >= 300:
        score -= 15
        findings.append(f"❌ Thin content: ~{word_count} words — aim for 1000+")
    else:
        score -= 25
        findings.append(f"❌ Very thin content: ~{word_count} words — insufficient for ranking")

    # Images & media
    images = soup.find_all("img")
    if images:
        missing_alt = sum(1 for img in images if not img.get("alt"))
        alt_ratio = (len(images) - missing_alt) / len(images)
        if missing_alt == 0:
            findings.append(f"✅ All {len(images)} images have alt text")
        else:
            score -= min(10, missing_alt * 2)
            findings.append(f"⚠️ {missing_alt}/{len(images)} images missing alt text ({alt_ratio:.0%} have alt)")
    else:
        findings.append("ℹ️ No images — consider adding visual content for engagement")

    # Internal / external links
    page_domain = urlparse(url).netloc
    all_links = soup.find_all("a", href=True)
    internal_links = [a for a in all_links if page_domain in a["href"] or a["href"].startswith("/")]
    external_links = [a for a in all_links if page_domain not in a["href"] and a["href"].startswith("http")]
    findings.append(f"🔗 {len(internal_links)} internal links, {len(external_links)} external links")

    if len(internal_links) < 3:
        score -= 5
        findings.append("⚠️ Few internal links — helps with crawl depth and topical authority")

    # Readability signals (paragraph length avg)
    paragraphs = soup.find_all("p")
    if paragraphs:
        avg_p_len = sum(len(p.text.split()) for p in paragraphs) / len(paragraphs)
        if avg_p_len > 60:
            score -= 5
            findings.append(f"⚠️ Long paragraphs (avg {avg_p_len:.0f} words) — break into shorter chunks")
        else:
            findings.append(f"✅ Readable paragraphs (avg {avg_p_len:.0f} words)")

    # Lists usage (good for readability and featured snippets)
    lists = soup.find_all(["ul", "ol"])
    if lists:
        findings.append(f"✅ {len(lists)} list(s) detected — good for readability and snippets")
    else:
        findings.append("ℹ️ No lists — consider adding bullet points or numbered steps")

    # E-E-A-T signals
    has_about = any("about" in (a.get("href") or a.text or "").lower() for a in all_links)
    has_author = soup.find(attrs={"class": re.compile(r"author|byline", re.I)})
    has_contact = any("contact" in (a.get("href") or a.text or "").lower() for a in all_links)

    eeat_signals = []
    if has_about:
        eeat_signals.append("About page")
    if has_author:
        eeat_signals.append("Author info")
    if has_contact:
        eeat_signals.append("Contact page")

    if eeat_signals:
        findings.append(f"✅ E-E-A-T signals found: {', '.join(eeat_signals)}")
    else:
        score -= 10
        findings.append("⚠️ No clear E-E-A-T signals — add About, Author, Contact pages")

    return {
        "pillar": "3. Content Quality & Intent Match",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


def _score_search_visibility(page: dict, url: str, headers: dict) -> dict:
    """
    Pillar 4: Search Visibility
    Checks: domain info, https, web vital hints, rendering, page size, content-type,
            international signals (hreflang), AMP, fresh content markers
    """
    score = 100
    findings = []
    soup = page.get("soup")

    parsed = urlparse(url)
    domain = parsed.netloc

    # HTTPS
    if url.startswith("https://"):
        findings.append("✅ HTTPS (confirmed ranking signal)")
    else:
        score -= 15
        findings.append("❌ HTTP — HTTPS is a confirmed ranking factor")

    # Content-Type header
    content_type = headers.get("Content-Type", "")
    if "text/html" in content_type:
        findings.append("✅ Content-Type: text/html — crawlable")
    else:
        score -= 5
        findings.append(f"⚠️ Content-Type: {content_type}")

    # Page size (HTML)
    html_size = len(page.get("html", ""))
    if html_size > 500_000:
        score -= 10
        findings.append(f"⚠️ Large page: {html_size // 1024}KB — may slow crawl/render")
    elif html_size < 1_000 and not page.get("error"):
        score -= 5
        findings.append(f"⚠️ Very small page: {html_size}B — may be thin or JS-rendered")
    else:
        findings.append(f"✅ Page size: {html_size // 1024}KB")

    # Hreflang (multilingual)
    if soup:
        hreflang = soup.find_all("link", attrs={"rel": "alternate", "hreflang": True})
        if hreflang:
            langs = set(h.get("hreflang") for h in hreflang)
            findings.append(f"✅ Hreflang tags for {len(langs)} language(s): {', '.join(sorted(langs)[:5])}")
        else:
            findings.append("ℹ️ No hreflang tags — add if targeting multiple regions/languages")

    # Fresh content signals
    if soup:
        dates = soup.find_all("time", attrs={"datetime": True})
        if dates:
            findings.append(f"✅ Found {len(dates)} time element(s) — helps search engines detect freshness")
        else:
            findings.append("ℹ️ No <time> elements — add publication/update dates for freshness")

    # AMP
    if soup:
        amp_html = soup.find("html", attrs={"amp": True}) or soup.find("link", attrs={"rel": "amphtml"})
        if amp_html:
            findings.append("✅ AMP version detected — may help mobile visibility")
        else:
            findings.append("ℹ️ No AMP — optional, less critical since mobile-first indexing")

    # Security headers (trust signals)
    security_headers = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "clickjacking protection",
        "Content-Security-Policy": "CSP",
    }
    for header, desc in security_headers.items():
        if header in headers:
            findings.append(f"✅ {header} header ({desc})")
        else:
            score -= 2
            findings.append(f"⚠️ Missing {header} header ({desc})")

    # Canonical consistency
    if soup:
        canonical = soup.find("link", attrs={"rel": "canonical"})
        if canonical:
            canon_url = canonical.get("href", "")
            if canon_url and canon_url != url and canon_url != page.get("final_url"):
                findings.append(f"ℹ️ Canonical points to: {canon_url}")

    return {
        "pillar": "4. Search Visibility",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


def _score_brand_representation(page: dict, url: str) -> dict:
    """
    Pillar 5: Brand Representation
    Checks: brand consistency, logo/schema, social presence, favicon,
            consistent naming, professional appearance signals
    """
    score = 100
    findings = []
    soup = page.get("soup")

    if not soup:
        return {"pillar": "5. Brand Representation", "score": 0, "max_score": 100, "findings": ["Could not parse page"]}

    # Favicon
    favicon = soup.find("link", attrs={"rel": re.compile(r"icon|shortcut icon", re.I)})
    if favicon:
        findings.append("✅ Favicon present")
    else:
        score -= 10
        findings.append("❌ No favicon — unprofessional appearance in SERPs and tabs")

    # Logo structured data / image
    if soup:
        org_schema = None
        for script in soup.find_all("script", attrs={"type": "application/ld+json"}):
            try:
                data = json.loads(script.string or "")
                if data.get("@type") in ("Organization", "Brand", "WebSite", "LocalBusiness"):
                    org_schema = data
                    break
            except (json.JSONDecodeError, TypeError):
                pass

        if org_schema:
            name = org_schema.get("name", "")
            logo = org_schema.get("logo", "")
            findings.append(f"✅ Organization schema found: {name}")
            if logo:
                if isinstance(logo, dict):
                    logo = logo.get("url", "")
                findings.append(f"✅ Logo in schema: {logo}")
            else:
                score -= 5
                findings.append("⚠️ No logo in Organization schema")
        else:
            score -= 10
            findings.append("❌ No Organization/Brand schema — add for SERP brand presence")

    # Brand name consistency in title
    title = soup.title.string if soup.title else ""
    og_title_el = soup.find("meta", attrs={"property": "og:title"})
    og_title = og_title_el["content"] if og_title_el and "content" in og_title_el.attrs else ""

    if title and og_title:
        # Check if one is a substring of the other or they share significant overlap
        title_lower = title.lower()
        og_lower = og_title.lower()
        if title_lower in og_lower or og_lower in title_lower:
            findings.append("✅ Title and OG title are consistent")
        else:
            score -= 3
            findings.append("⚠️ Title and OG title differ — ensure brand consistency")

    # Social media links
    social_domains = ["facebook.com", "twitter.com", "x.com", "instagram.com",
                      "linkedin.com", "youtube.com", "tiktok.com", "pinterest.com"]
    all_links = soup.find_all("a", href=True)
    found_social = []
    for a in all_links:
        href = a["href"].lower()
        for sd in social_domains:
            if sd in href:
                # Normalize x.com -> twitter
                display = "twitter" if sd == "x.com" else sd.split(".")[0]
                if display not in found_social:
                    found_social.append(display)
                break

    if found_social:
        findings.append(f"✅ Social profiles linked: {', '.join(found_social)}")
    else:
        score -= 5
        findings.append("⚠️ No social media links — add to strengthen brand signals")

    # Brand colors/site identity (has styleheets)
    stylesheets = soup.find_all("link", attrs={"rel": "stylesheet"})
    if stylesheets:
        findings.append(f"✅ {len(stylesheets)} stylesheet(s) — polished appearance")
    else:
        score -= 5
        findings.append("⚠️ No external stylesheets — site may lack professional appearance")

    # Sitelinks searchbox schema (brand SERP feature)
    if soup and org_schema:
        if org_schema.get("@type") == "WebSite":
            potential_actions = org_schema.get("potentialAction", [])
            if isinstance(potential_actions, dict):
                potential_actions = [potential_actions]
            for action in potential_actions:
                if action.get("@type") == "SearchAction":
                    findings.append("✅ Sitelinks SearchAction schema — enables sitelinks search box in SERPs")

    return {
        "pillar": "5. Brand Representation",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


def _score_authority_signals(page: dict, url: str) -> dict:
    """
    Pillar 6: Authority Signals
    Checks: backlinks hints, domain authority signals, E-E-A-T, citation consistency,
            external references, age signals, link quality patterns
    """
    score = 100
    findings = []
    soup = page.get("soup")

    if not soup:
        return {"pillar": "6. Authority Signals", "score": 0, "max_score": 100, "findings": ["Could not parse page"]}

    all_links = soup.find_all("a", href=True)
    page_domain = urlparse(url).netloc

    # External outbound links quality
    outbound = [a for a in all_links if a["href"].startswith("http") and page_domain not in a["href"]]
    nofollow_out = sum(1 for a in outbound if "nofollow" in (a.get("rel") or []))
    ugc_out = sum(1 for a in outbound if "ugc" in (a.get("rel") or []))
    sponsored_out = sum(1 for a in outbound if "sponsored" in (a.get("rel") or []))
    follow_out = len(outbound) - nofollow_out - ugc_out - sponsored_out

    findings.append(f"🔗 Outbound links: {len(outbound)} total ({follow_out} follow, {nofollow_out} nofollow)")

    if outbound:
        # Check if linking to authoritative domains
        edu_gov = [a for a in outbound if ".edu" in a["href"] or ".gov" in a["href"]]
        if edu_gov:
            findings.append(f"✅ Links to {len(edu_gov)} .edu/.gov domain(s) — strong authority signal")
    else:
        score -= 5
        findings.append("⚠️ No outbound links — reference authoritative sources for E-E-A-T")

    # Internal linking depth
    internal = [a for a in all_links if a["href"].startswith("/") or page_domain in a["href"]]
    if len(internal) >= 10:
        findings.append(f"✅ Strong internal link structure ({len(internal)} internal links)")
    elif len(internal) >= 3:
        findings.append(f"⚠️ Moderate internal links ({len(internal)}) — aim for 10+ per page")
    else:
        score -= 10
        findings.append(f"❌ Weak internal linking ({len(internal)} links) — hinders crawl and authority flow")

    # Author / byline presence
    author_selectors = [
        {"class": re.compile(r"author|byline|writer", re.I)},
        {"itemprop": "author"},
        {"name": "author"},
    ]
    author_found = None
    for sel in author_selectors:
        author_found = soup.find(attrs=sel)
        if author_found:
            break

    if author_found:
        author_text = author_found.get("content", "") or author_found.text.strip()
        findings.append(f"✅ Author identified: {author_text[:60]}")
    else:
        score -= 10
        findings.append("❌ No author attribution — add for E-E-A-T compliance")

    # Date signals
    date_published = soup.find("meta", attrs={"property": "article:published_time"})
    date_modified = soup.find("meta", attrs={"property": "article:modified_time"})
    time_el = soup.find("time", attrs={"datetime": True})

    date_signals = []
    if date_published:
        date_signals.append(f"Published: {date_published.get('content', '')}")
    if date_modified:
        date_signals.append(f"Modified: {date_modified.get('content', '')}")
    if time_el:
        date_signals.append(f"Date element: {time_el.get('datetime', '')}")

    if date_signals:
        findings.extend([f"✅ {d}" for d in date_signals])
    else:
        score -= 5
        findings.append("⚠️ No publication date signals — add for freshness and credibility")

    # Copyright / legal
    footer = soup.find("footer")
    if footer:
        footer_text = footer.text.lower()
        has_copyright = "©" in footer_text or "copyright" in footer_text or "all rights reserved" in footer_text
        has_privacy = "privacy" in footer_text
        has_terms = "terms" in footer_text

        legal_signals = []
        if has_copyright:
            legal_signals.append("Copyright")
        if has_privacy:
            legal_signals.append("Privacy Policy")
        if has_terms:
            legal_signals.append("Terms")

        if len(legal_signals) >= 2:
            findings.append(f"✅ Legal pages: {', '.join(legal_signals)}")
        else:
            score -= 5
            findings.append(f"⚠️ Missing legal pages (found: {', '.join(legal_signals) if legal_signals else 'none'})")

    # Contact information
    page_text = soup.get_text().lower()
    has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', page_text))
    has_phone = bool(re.search(r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,}', page_text))

    if has_email or has_phone:
        contact_signals = []
        if has_email:
            contact_signals.append("Email")
        if has_phone:
            contact_signals.append("Phone")
        findings.append(f"✅ Contact info found: {', '.join(contact_signals)} — builds trust")
    else:
        findings.append("ℹ️ No contact info detected on page — add for local/trust signals")

    return {
        "pillar": "6. Authority Signals",
        "score": max(0, score),
        "max_score": 100,
        "findings": findings,
    }


# ──────────────────────────────────────────────
# 3. MASTER AUDIT FUNCTION
# ──────────────────────────────────────────────

def run_deep_audit(url: str) -> dict:
    """
    Run the full 6-pillar SEO audit on a URL.
    Returns structured results with overall score, per-pillar scores, and AI recommendations.
    """
    start_time = datetime.now()
    page_data = _fetch_page(url)
    headers = _fetch_response_headers(page_data.get("final_url") or url)
    robots = _check_robots_txt(page_data.get("final_url") or url)
    sitemap = _check_sitemap(page_data.get("final_url") or url)

    # If page fetch failed completely
    if page_data.get("error") and not page_data.get("soup"):
        return {
            "url": url,
            "error": page_data["error"],
            "overall_score": 0,
            "pillars": [],
            "metadata": {"audit_time": str(datetime.now() - start_time)},
        }

    # Run all six pillar analyses
    pillars = [
        _score_crawlability(page_data, headers, robots, sitemap),
        _score_technical(page_data, headers),
        _score_content_quality(page_data, url),
        _score_search_visibility(page_data, url, headers),
        _score_brand_representation(page_data, url),
        _score_authority_signals(page_data, url),
    ]

    # Overall weighted score
    # Weights: crawlability 20%, technical 20%, content 25%, visibility 15%, brand 10%, authority 10%
    weights = [0.20, 0.20, 0.25, 0.15, 0.10, 0.10]
    overall = sum(p["score"] * w for p, w in zip(pillars, weights))

    elapsed = str(datetime.now() - start_time)

    return {
        "url": url,
        "final_url": page_data.get("final_url", url),
        "status_code": page_data.get("status_code"),
        "response_time_ms": page_data.get("response_time_ms"),
        "overall_score": round(overall, 1),
        "overall_grade": _score_to_grade(overall),
        "pillars": pillars,
        "technical_meta": {
            "title": page_data["soup"].title.string if page_data.get("soup") and page_data["soup"].title else None,
            "has_robots_txt": robots.get("exists", False),
            "has_sitemap_xml": sitemap.get("exists", False),
            "http_status": page_data.get("status_code"),
            "response_time_ms": page_data.get("response_time_ms"),
        },
        "metadata": {
            "audited_at": datetime.now().isoformat(),
            "audit_duration": elapsed,
            "word_count": len(page_data["soup"].get_text(separator=" ", strip=True).split()) if page_data.get("soup") else 0,
            "total_links": len(page_data["soup"].find_all("a", href=True)) if page_data.get("soup") else 0,
            "total_images": len(page_data["soup"].find_all("img")) if page_data.get("soup") else 0,
        },
        "aeo_geo": _analyze_aeo_geo(page_data),
    }


def _analyze_aeo_geo(page_data: dict) -> dict:
    html = page_data.get("html") or ""
    soup = page_data.get("soup")
    visible_text = ""
    headings = []
    schema_org = ""

    if soup:
        visible_text = soup.get_text(separator=" ", strip=True)
        headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2", "h3"])][:30]
        jsonld_blocks = soup.find_all("script", attrs={"type": "application/ld+json"})
        schema_items = []
        for block in jsonld_blocks:
            raw = (block.string or "").strip()
            if raw:
                schema_items.append(raw)
        schema_org = "\n".join(schema_items)

    from app.services.aeo_geo_service import analyze_geo
    return analyze_geo(html, visible_text, schema_org)


def _score_to_grade(score: float) -> str:
    """Convert numeric score to letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B+"
    elif score >= 70:
        return "B"
    elif score >= 60:
        return "C+"
    elif score >= 50:
        return "C"
    elif score >= 40:
        return "D"
    else:
        return "F"
