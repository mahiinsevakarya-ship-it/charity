import { Suspense } from "react";
import type { Metadata } from "next";
import { Shell } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/primitives";
import { VerifyClient } from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verifying sign-in link",
  robots: { index: false, follow: false },
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="mx-auto flex min-h-[50vh] max-w-md items-center justify-center">
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        </Shell>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
