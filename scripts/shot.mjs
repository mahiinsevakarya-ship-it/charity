import puppeteer from "puppeteer-core";

const [url, out, width = "1440", height = "900", full = "1"] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
});

const page = await browser.newPage();
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE_ERROR:", m.text());
});
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
// trigger scroll reveals
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 400));
});
await page.screenshot({ path: out, fullPage: full === "1" });
await browser.close();
console.log("saved", out);
