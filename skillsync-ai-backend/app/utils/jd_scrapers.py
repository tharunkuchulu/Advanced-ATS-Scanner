from playwright.async_api import async_playwright
import httpx
from bs4 import BeautifulSoup

async def extract_jd_from_linkedin(url: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            await page.goto(url, timeout=60000)

            # Wait for job description to appear
            await page.wait_for_selector("div.description__text", timeout=10000)
            
            # Extract job description text
            job_description = await page.inner_text("div.description__text")

            await browser.close()
            return job_description.strip()

        except Exception as e:
            await browser.close()
            raise Exception(f"Failed to extract job description: {str(e)}")

async def extract_from_indeed(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            soup = BeautifulSoup(response.text, "html.parser")

            job_desc = soup.find("div", {"id": "jobDescriptionText"})
            return job_desc.get_text(strip=True) if job_desc else ""
    except Exception:
        return ""

async def extract_from_google_jobs(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            soup = BeautifulSoup(response.text, "html.parser")

            job_desc = soup.find("div", {"class": "job-description"})  # May vary
            return job_desc.get_text(strip=True) if job_desc else ""
    except Exception:
        return ""