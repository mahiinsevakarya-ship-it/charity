import puppeteer from "puppeteer-core";
const [url, out, clickText, y = "0", width = "1440", height = "950"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE_ERROR:", m.text()));
await page.setViewport({ width: Number(width), height: Number(height) });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 700));
if (clickText && clickText !== "-") {
  const clicked = await page.evaluate((label) => {
    const els = [...document.querySelectorAll('[role="tab"], button, a')];
    const el = els.find((e) => (e.textContent || "").trim().startsWith(label));
    if (el) el.click();
    return !!el;
  }, clickText);
  console.log("clicked:", clicked);
  await new Promise((r) => setTimeout(r, 900));
}
await page.evaluate(async (target) => {
  window.scrollTo(0, target);
  await new Promise((r) => setTimeout(r, 2600));
}, Number(y));
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
