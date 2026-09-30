import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });

// 1. Visit /impact when not signed in
await page.goto("http://localhost:3000/impact", { waitUntil: "networkidle0" });
// Ensure signed out state in fresh incognito context
await page.evaluate(() => {
  localStorage.setItem("rekindle:v1", JSON.stringify({ sessionId: null }));
});
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/gate-impact-unauth.png" });

// 2. Visit /rewards when not signed in
await page.goto("http://localhost:3000/rewards", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/gate-rewards-unauth.png" });

await browser.close();
console.log("Auth gate testing completed!");
