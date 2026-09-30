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

// 1. Visit /admin as standard USER (Mahesh Rao) -> Should show Gated Screen
await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/admin-gated-user.png" });

// 2. Click "Sign in as Superuser (Demo Admin)"
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Sign in as Superuser"),
  );
  btn?.click();
});
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "shots/admin-superuser-overview.png" });

// 3. Switch to Users Tab
await page.evaluate(() => {
  const tab = [...document.querySelectorAll('[role="tab"], button')].find((b) =>
    b.textContent?.trim().startsWith("Users"),
  );
  tab?.click();
});
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: "shots/admin-users-tab.png" });

// 4. Click "Invite / Create User" to open the invite modal
await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Invite / Create User"),
  );
  btn?.click();
});
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: "shots/admin-invite-modal.png" });

await browser.close();
console.log("Admin gate and invite testing finished!");
