import type { Metadata } from "next";

import { SupportSection } from "@/components/SupportSection";

export const metadata: Metadata = {
  title: "Support RentSetGo",
  description:
    "Optional support for RentSetGo — help keep Nashik's owner-first rental platform running.",
};

export default function SupportPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(100%,48rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-200/30 via-emerald-100/20 to-transparent blur-3xl dark:from-rose-500/10 dark:via-emerald-500/10"
        aria-hidden
      />
      <SupportSection variant="page" />
    </div>
  );
}
