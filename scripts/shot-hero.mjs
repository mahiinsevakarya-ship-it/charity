import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/new-hero-desktop.png" });

await page.setViewport({ width: 390, height: 844 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/new-hero-mobile.png" });

await browser.close();
console.log("New hero screenshots captured!");
