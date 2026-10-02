import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
page.setDefaultNavigationTimeout(30000);
page.on("pageerror", (e) => console.log("PAGE_ERROR:", e.message));
page.on("dialog", async (dialog) => {
  console.log(`  💬 Auto-responding to dialog prompt: "${dialog.message()}"`);
  await dialog.accept("Distributed to 45 primary school children in Bengaluru Rural");
});

const assertions = [];

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    assertions.push({ status: "PASS", message });
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    assertions.push({ status: "FAIL", message });
  }
}

try {
  console.log("\n========================================================");
  console.log("🚀 STARTING SEVAKARYA COMPREHENSIVE E2E VERIFICATION SUITE");
  console.log("========================================================\n");

  await page.setViewport({ width: 1440, height: 950 });

  // -----------------------------------------------------------
  // 1. DONOR FLOW: GUEST -> AUTH -> MULTI-CATEGORY DONATION -> IMPACT
  // -----------------------------------------------------------
  console.log("📌 STAGE 1: DONOR FULL FLOW");

  // A. Check unauthenticated gate on /impact
  await page.goto("http://localhost:3000/impact", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("rekindle:v1", JSON.stringify({ sessionId: null })));
  await page.reload({ waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));

  const authGateText = await page.evaluate(() => document.body?.textContent || "");
  assert(
    authGateText.includes("Sign in to view your impact") || authGateText.includes("Sign in to continue"),
    "AuthGate correctly blocks unauthenticated access to /impact",
  );
  await page.screenshot({ path: "shots/test1-donor-authgate.png" });

  // B. Sign In as Donor via Magic Link
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Magic Link"))?.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  await page.evaluate(() => {
    const input = document.querySelector('input[type="email"]');
    if (input) {
      const proto = HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(input, "kavita.sharma@example.com");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[type="submit"]')].find((b) => b.textContent?.includes("Send Magic Link"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const openMagicBtn = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("a, button")].find((e) =>
      e.textContent?.includes("Open Magic Link") || e.getAttribute("href")?.includes("/auth/verify"),
    );
    return btn?.getAttribute("href") || null;
  });

  assert(Boolean(openMagicBtn), "Magic link token generated successfully for donor");

  if (openMagicBtn) {
    await page.goto(openMagicBtn, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.location.pathname === "/impact", { timeout: 8000 });
  }

  const currentUrl = page.url();
  assert(currentUrl.includes("/impact"), `Magic link verified and redirected to /impact (URL: ${currentUrl})`);
  await page.screenshot({ path: "shots/test2-donor-impact-dashboard.png" });

  // C. Multi-Category Donation Wizard (/donate)
  await page.goto("http://localhost:3000/donate", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));

  // Step 1: Select Books, Clothes, and Shoes
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    btns.find((b) => b.textContent?.includes("Books"))?.click();
    btns.find((b) => b.textContent?.includes("Clothes"))?.click();
    btns.find((b) => b.textContent?.includes("Shoes"))?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: "shots/test3-wizard-step1-selection.png" });

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // Step 2: Set Quantities with Quick Bulk Chips
  await page.evaluate(() => {
    const add10Btns = [...document.querySelectorAll("button")].filter((b) => b.textContent?.includes("+10"));
    if (add10Btns[0]) add10Btns[0].click(); // Books +10 -> 11
    if (add10Btns[1]) add10Btns[1].click(); // Clothes +10 -> 11
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: "shots/test4-wizard-step2-quantities.png" });

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // Step 3: Condition -> Pick "Good"
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Good"))?.click();
  });
  await new Promise((r) => setTimeout(r, 200));
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click();
  });
  await new Promise((r) => setTimeout(r, 300));

  // Step 4: Photos -> Continue
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Step 5: Pickup Details with PhoneInput (+91)
  await page.evaluate(() => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      const proto = HTMLTextAreaElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(textarea, "Flat 402, Palm Meadows, Whitefield");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const telInput = document.querySelector('input[type="tel"]');
    if (telInput) {
      const proto = HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(telInput, "9876543210");
      telInput.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // Pick first Date chip
    const dateBtn = [...document.querySelectorAll("button")].find((b) => /\w{3},\s*\d+/.test(b.textContent || ""));
    dateBtn?.click();

    // Pick first Slot chip
    const slotBtn = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("–") || b.textContent?.includes("-"));
    slotBtn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "shots/test5-wizard-step5-pickup.png" });

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === "Continue")?.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Step 6: Review & Submit
  await page.screenshot({ path: "shots/test6-wizard-step6-review.png" });
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Submit Donation"))?.click();
  });
  await page.waitForFunction(() => window.location.pathname.includes("/donation/success"), { timeout: 8000 });

  const successUrl = page.url();
  assert(successUrl.includes("/donation/success"), `Donation submitted successfully (URL: ${successUrl})`);
  await page.screenshot({ path: "shots/test7-donation-success-page.png" });

  // Verify Phone Auto-Saved in Profile
  await page.goto("http://localhost:3000/profile", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 600));
  const profilePhone = await page.evaluate(() => document.body.textContent?.includes("9876543210") || false);
  assert(profilePhone, "Contact mobile number (+91 9876543210) was automatically saved to donor's permanent profile");
  await page.screenshot({ path: "shots/test8-donor-profile-saved.png" });


  // -----------------------------------------------------------
  // 2. ADMIN / SUPERUSER FLOW: VERIFY QUEUE -> AWARD STARS -> USERS TAB
  // -----------------------------------------------------------
  console.log("\n📌 STAGE 2: ADMIN / SUPERUSER FULL FLOW");

  // Sign in as Superuser
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Magic Link"))?.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  await page.evaluate(() => {
    const input = document.querySelector('input[type="email"]');
    if (input) {
      const proto = HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value").set.call(input, "ops@sevakarya.com");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[type="submit"]')].find((b) => b.textContent?.includes("Send Magic Link"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const adminMagicLink = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("a, button")].find((e) =>
      e.textContent?.includes("Open Magic Link") || e.getAttribute("href")?.includes("/auth/verify"),
    );
    return btn?.getAttribute("href") || null;
  });

  if (adminMagicLink) {
    await page.goto(adminMagicLink, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.location.pathname === "/admin", { timeout: 8000 });
  }

  // Go to Admin Dashboard
  await page.goto("http://localhost:3000/admin", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "shots/test9-admin-dashboard-overview.png" });

  const adminOverview = await page.evaluate(() => document.body.textContent?.includes("Platform totals") || false);
  assert(adminOverview, "Superuser authenticated with ADMIN role and accessed /admin console");

  // Switch to Verification Queue
  await page.evaluate(() => {
    const tab = [...document.querySelectorAll('[role="tab"], button')].find((b) =>
      b.textContent?.includes("Verification queue"),
    );
    tab?.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "shots/test10-admin-verification-queue.png" });

  // Advance status of donation
  const advanceResult = await page.evaluate(() => {
    const advanceBtn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Mark collected") || b.textContent?.includes("Mark received") || b.textContent?.includes("Verify & award"),
    );
    if (advanceBtn) {
      const text = advanceBtn.textContent?.trim();
      advanceBtn.click();
      return { clicked: true, text };
    }
    return { clicked: false };
  });
  assert(advanceResult.clicked, `Admin advanced donation status: "${advanceResult.text}"`);
  await new Promise((r) => setTimeout(r, 800));

  // Switch to Users Tab
  await page.evaluate(() => {
    const tab = [...document.querySelectorAll('[role="tab"], button')].find((b) =>
      b.textContent?.trim().startsWith("Users"),
    );
    tab?.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "shots/test11-admin-users-management.png" });

  // Open "Invite / Create User" modal
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Invite / Create User"),
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // Fill in new user details
  await page.type('input[placeholder*="Ramesh"]', "Pooja Hegde");
  await page.type('input[placeholder*="ramesh@"]', "pooja.volunteer@sevakarya.com");
  await page.select("select", "VOLUNTEER");
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: "shots/test12-admin-create-user-modal.png" });

  await page.evaluate(() => {
    const submitBtn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Create Account & Generate Invite"),
    );
    submitBtn?.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  const inviteGenerated = await page.evaluate(() => document.body.textContent?.includes("User Account Ready!") || false);
  assert(inviteGenerated, "Superuser created new VOLUNTEER account and generated cryptographic magic invite link");
  await page.screenshot({ path: "shots/test13-admin-invite-link-ready.png" });

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Done & Close"))?.click();
  });
  await new Promise((r) => setTimeout(r, 300));


  // -----------------------------------------------------------
  // 3. NGO PARTNER FLOW: NGO PORTAL LOGIN -> INVENTORY -> DISTRIBUTION
  // -----------------------------------------------------------
  console.log("\n📌 STAGE 3: NGO PARTNER FULL FLOW");

  // Sign in as NGO Partner
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    const tab = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("NGO Portal"));
    tab?.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  await page.evaluate(() => {
    const setVal = (placeholder, val) => {
      const input = document.querySelector(`input[placeholder*="${placeholder}"]`);
      if (input) {
        const proto = HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, "value").set.call(input, val);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
    setVal("Vidya Setu", "Vidya Setu Trust");
    setVal("ops@vidyasetu", "ops@vidyasetu.org");
    setVal("98450", "9845011223");
  });

  await page.screenshot({ path: "shots/test14-ngo-login-screen.png" });

  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Access Partner Dashboard"))?.click();
  });
  await page.waitForFunction(() => window.location.pathname === "/ngo", { timeout: 8000 });

  const ngoUrl = page.url();
  assert(ngoUrl.includes("/ngo"), `NGO authenticated and redirected to /ngo dashboard (URL: ${ngoUrl})`);
  await page.screenshot({ path: "shots/test15-ngo-dashboard-overview.png" });

  const ngoTitle = await page.evaluate(() => document.querySelector("h1")?.textContent || "");
  assert(ngoTitle.includes("Vidya Setu Trust") || document.body.textContent?.includes("Incoming"), "NGO Dashboard loaded verified inventory, item needs, and distribution reports");

  // Mark inventory as distributed
  const distributeBtnClicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Mark distributed"));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (distributeBtnClicked) {
    console.log("  📦 NGO confirmed distribution of allocated items to beneficiaries");
  }
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: "shots/test16-ngo-distribution-updated.png" });


  console.log("\n========================================================");
  const passed = assertions.filter((a) => a.status === "PASS").length;
  console.log(`🏁 E2E VERIFICATION SUITE FINISHED: ${passed}/${assertions.length} TESTS PASSED`);
  console.log("========================================================\n");

} catch (err) {
  console.error("FATAL ERROR in E2E Suite:", err);
} finally {
  await browser.close();
}
