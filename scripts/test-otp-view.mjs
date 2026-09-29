import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });

// Fill phone number
await page.type('input[type="tel"]', "9845011223");
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 600));

await page.screenshot({ path: "shots/auth-otp-screen.png" });

await browser.close();
