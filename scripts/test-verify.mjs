import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new", args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE_ERROR:", m.text()));
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 800));
await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].find((e) => e.textContent.includes("Verification queue"))?.click());
await new Promise((r) => setTimeout(r, 600));
const before = await page.evaluate(() => document.querySelector("header")?.textContent || "");
const found = await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")];
  const verify = btns.find((b) => b.textContent.includes("Verify & award stars"));
  if (!verify) return { ok: false };
  const card = verify.closest("div.rounded-2xl, .surface-card");
  verify.click();
  return { ok: true, card: (card?.textContent || "").slice(0, 80) };
});
console.log("verify click:", JSON.stringify(found));
await new Promise((r) => setTimeout(r, 1200));
const after = await page.evaluate(() => document.querySelector("header")?.textContent || "");
const toast = await page.evaluate(() => [...document.querySelectorAll("div")].map((d) => d.className).filter((c) => typeof c === "string" && c.includes("anim-slide-up")).length);
const state = await page.evaluate(() => {
  const raw = localStorage.getItem("rekindle:v1");
  return raw ? JSON.parse(raw) : null;
});
const awarded = state ? state.donations.filter((d) => d.awardedStars).length : -1;
const balance = state ? state.transactions.reduce((s, t) => s + t.stars, 0) : -1;
console.log("stars before:", before.match(/\d[\d,]*/)?.[0], "| after:", after.match(/\d[\d,]*/)?.[0]);
console.log("toast nodes:", toast, "| awarded donations:", awarded, "| ledger balance:", balance);
await page.screenshot({ path: "shots/admin-verify-result.png" });
await browser.close();
