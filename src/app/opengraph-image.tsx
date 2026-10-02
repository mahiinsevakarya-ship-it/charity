import { ImageResponse } from "next/og";

export const alt = "SevaKarya — Give What You Don't Need. Change Someone's Tomorrow.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0e5c43",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#fdfcfa",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "#f0b01c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
              }}
            >
              🌱
            </div>
            <span style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              SevaKarya
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.12)",
              padding: "10px 20px",
              borderRadius: "9999px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#a7f3d0",
            }}
          >
            ✓ Verified NGO Partner Network
          </div>
        </div>

        {/* Hero headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#ffffff",
              maxWidth: "960px",
            }}
          >
            Give what you don&apos;t need.
            <br />
            <span style={{ color: "#f0b01c" }}>Change someone&apos;s tomorrow.</span>
          </h1>
          <p
            style={{
              fontSize: "24px",
              lineHeight: 1.5,
              color: "rgba(253, 252, 250, 0.8)",
              margin: 0,
              maxWidth: "840px",
            }}
          >
            Donate pre-owned clothes, books, shoes and bags. Doorstep pickup, verified distribution,
            and Impact Star rewards.
          </p>
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "48px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "#f0b01c" }}>12,480+</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Items Reused</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "#a7f3d0" }}>45+</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Verified Partners</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff" }}>19</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Cities in India</span>
            </div>
          </div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            sevakarya.com ↗
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
