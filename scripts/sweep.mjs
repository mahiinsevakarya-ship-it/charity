import puppeteer from "puppeteer-core";
const routes = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
await page.setViewport({ width: 1440, height: 950 });
for (const r of routes) {
  errors.length = 0;
  const res = await page.goto(`http://localhost:3000${r}`, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((s) => setTimeout(s, 500));
  const name = r === "/" ? "home" : r.replace(/\//g, "-").replace(/^-/, "");
  await page.screenshot({ path: `shots/sweep${name}.png` });
  const hidden = await page.evaluate(() => {
    const reveals = [...document.querySelectorAll(".reveal")];
    return reveals.filter((el) => el.getBoundingClientRect().top < window.innerHeight && !el.classList.contains("is-visible")).length;
  });
  console.log(`${r} → ${res.status()} | errors=${errors.length}${errors.length ? " :: " + errors.join(" | ") : ""} | above-fold-hidden=${hidden}`);
}
await browser.close();
