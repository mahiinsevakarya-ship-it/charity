import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE_ERROR:", m.text()));
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/donate", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 700));

const clickByText = (text, selector = "button, a, [role=button]") =>
  page.evaluate(
    (text, selector) => {
      const el = [...document.querySelectorAll(selector)].find((e) =>
        (e.textContent || "").replace(/\s+/g, " ").trim().includes(text),
      );
      if (!el) return false;
      el.click();
      return true;
    },
    text,
    selector,
  );

const setInput = (selector, value) =>
  page.evaluate(
    (selector, value) => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    },
    selector,
    value,
  );

const step1 = await clickByText("Trousers, shirts, kurtas, jackets");
console.log("step1 pick clothes:", step1);
await clickByText("Continue");
await new Promise((r) => setTimeout(r, 500));

// step 2 — quantities (defaults are fine)
await clickByText("Continue");
await new Promise((r) => setTimeout(r, 500));

// step 3 — condition
const step3 = await page.evaluate(() => {
  const headings = [...document.querySelectorAll("h3, p, span, button")];
  const el = headings.find((e) => (e.textContent || "").trim() === "Good" || (e.textContent || "").trim().startsWith("Good ·") || (e.textContent || "").trim().startsWith("Good -"));
  if (!el) return false;
  (el.closest("button") || el).click();
  return true;
});
console.log("step3 condition:", step3);
await clickByText("Continue");
await new Promise((r) => setTimeout(r, 500));

// step 4 — photos optional
await clickByText("Continue");
await new Promise((r) => setTimeout(r, 500));

// step 5 — pickup details
console.log("address:", await setInput("textarea", "42, 4th Cross, Jayanagar, Bengaluru 560041"));
console.log("phone:", await setInput('input[inputmode="tel"]', "9845011223"));
const pickedDate = await page.evaluate(() => {
  const label = [...document.querySelectorAll("label, p, span")].find((e) => (e.textContent || "").trim() === "Preferred date");
  const box = label?.parentElement;
  const btn = box ? [...box.querySelectorAll("button")][0] : null;
  if (!btn) return false;
  btn.click();
  return true;
});
const pickedSlot = await page.evaluate(() => {
  const label = [...document.querySelectorAll("label, p, span")].find((e) => (e.textContent || "").trim() === "Preferred time slot");
  const box = label?.parentElement;
  const btn = box ? [...box.querySelectorAll("button")][0] : null;
  if (!btn) return false;
  btn.click();
  return true;
});
console.log("date:", pickedDate, "| slot:", pickedSlot);
await new Promise((r) => setTimeout(r, 400));
await clickByText("Continue");
await new Promise((r) => setTimeout(r, 700));

// step 6 — review + submit
await page.screenshot({ path: "shots/wizard-review.png" });
await clickByText("Submit Donation");
await new Promise((r) => setTimeout(r, 2500));
console.log("url after submit:", page.url());
await page.screenshot({ path: "shots/wizard-success.png" });

const stored = await page.evaluate(() => {
  const raw = localStorage.getItem("rekindle:v1");
  const state = raw ? JSON.parse(raw) : null;
  const d = state?.donations?.[0];
  return {
    count: state?.donations?.length,
    first: d && { code: d.code, status: d.status, items: d.items, expectedStars: d.expectedStars, method: d.pickup?.method },
  };
});
console.log("stored:", JSON.stringify(stored));
await browser.close();
