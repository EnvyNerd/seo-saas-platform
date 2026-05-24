from bs4 import BeautifulSoup
import requests


def audit_website(url: str):

    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "lxml")

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

        score = 100

        if title == "Missing":
            score -= 20

        if meta_description == "Missing":
            score -= 20

        if len(h1_tags) == 0:
            score -= 15

        if missing_alt > 0:
            score -= 10

        result = {
            "url": url,
            "seo_score": score,
            "title": title,
            "meta_description": meta_description,
            "h1_tags": h1_tags,
            "total_links": total_links,
            "missing_alt_images": missing_alt,
        }

        return result

    except Exception as e:
        return {"error": str(e)}