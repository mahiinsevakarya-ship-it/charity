"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORY_MAP } from "@/lib/catalog";
import { itemWords } from "@/lib/format";
import { Button } from "@/components/ui/primitives";

export function DownloadReport() {
  const { donations } = useApp();
  const [done, setDone] = useState(false);

  function download() {
    const header = [
      "donation_code",
      "status",
      "created_at",
      "method",
      "city",
      "items",
      "expected_stars",
      "awarded_stars",
    ];
    const rows = donations.map((d) =>
      [
        d.code,
        d.status,
        d.createdAt.slice(0, 10),
        d.pickup.method,
        d.pickup.city ?? "",
        d.items
          .map((i) => itemWords(i.quantity, i.category))
          .join(" + "),
        d.expectedStars,
        d.awardedStars ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rekindle-transparency-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    setDone(true);
    window.setTimeout(() => setDone(false), 3000);
  }

  return (
    <Button variant="secondary" onClick={download}>
      <Download className="h-4 w-4" />
      {done ? "Report downloaded" : "Export donation report (CSV)"}
    </Button>
  );
}

export function CategoryBar({ category, value, max }: { category: keyof typeof CATEGORY_MAP; value: number; max: number }) {
  const meta = CATEGORY_MAP[category];
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-bold text-ink">
          {meta.emoji} {meta.label}
        </span>
        <span className="font-extrabold text-forest tabular-nums">
          {value.toLocaleString("en-IN")}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-forest transition-[width] duration-1000 ease-out"
          style={{ width: `${Math.round((value / max) * 100)}%` }}
        />
      </div>
    </div>
  );
}
