import asyncio
from playwright.async_api import async_playwright

async def run():
    async def capture_focus(page, selector, name):
        await page.focus(selector)
        await asyncio.sleep(0.5)
        await page.screenshot(path=f"/home/jules/verification/{name}.png")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:5000/auth/signup")

        await capture_focus(page, "#email-input", "signup_focus")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
