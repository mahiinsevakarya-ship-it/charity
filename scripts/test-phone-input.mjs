import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/donate", { waitUntil: "networkidle0" });

// Advance to Step 5
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Clothes"))?.click());
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click());
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click());
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Good"))?.click());
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click());
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click());
await new Promise((r) => setTimeout(r, 400));

// Scroll down to Contact Mobile Number section
await page.evaluate(() => window.scrollBy(0, 380));
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: "shots/donate-step5-phone-zoomed.png" });

await browser.close();
console.log("Scrolled screenshot captured!");
