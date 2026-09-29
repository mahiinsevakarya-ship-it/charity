import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE_ERROR:", m.text()));

// 1. Desktop Screenshot of Login Page
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/auth-login-phone.png" });

// 2. Open Google Auth Modal
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Continue with Google"),
  );
  btn?.click();
});
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: "shots/auth-google-modal.png" });

// Close Google Modal
await page.evaluate(() => {
  const closeBtn = document.querySelector(".fixed svg.lucide-x")?.closest("button");
  closeBtn?.click();
});
await new Promise((r) => setTimeout(r, 400));

// 3. Switch to Magic Link Tab
await page.evaluate(() => {
  const tab = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Magic Link"),
  );
  tab?.click();
});
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "shots/auth-magic-tab.png" });

// 4. Switch to NGO Portal Tab
await page.evaluate(() => {
  const tab = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("NGO Portal"),
  );
  tab?.click();
});
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: "shots/auth-ngo-tab.png" });

// 5. Test Mobile Viewport (390px)
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: "shots/auth-mobile-390.png" });

// 6. Test Magic Link Verification Route End-to-End
const tokenRes = await fetch("http://localhost:3000/api/auth/magic-link", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "donor.live@rekindle.org", name: "Rahul Verma" }),
});
const tokenData = await tokenRes.json();
console.log("Magic Link API output:", JSON.stringify(tokenData));

if (tokenData.verifyUrl) {
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto(tokenData.verifyUrl, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  console.log("URL after magic link verify:", page.url());
  await page.screenshot({ path: "shots/auth-verify-success.png" });
}

await browser.close();
console.log("Auth flow automated testing completed!");
