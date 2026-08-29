"use client";

import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/Button";
import Link from "next/link";

const floatPills = [
  { label: "Listening", className: "bg-white text-accent border-accent/20", pos: "-top-6 left-2", delay: "animate-float" },
  { label: "Understanding", className: "bg-white text-ink border-border", pos: "top-1/2 -right-5 -translate-y-1/2", delay: "animate-float-delay" },
  { label: "Organizing", className: "bg-white text-accent border-accent/20", pos: "bottom-0 left-8", delay: "animate-float-delay2" },
] as const;

export default function WelcomePage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <BrandHeader />
        <span className="inline-flex items-center gap-2 rounded-full bg-keypoint-soft px-3 py-1.5 text-xs font-semibold text-keypoint">
          <span className="h-1.5 w-1.5 rounded-full bg-keypoint" />
          Ready when you are
        </span>
      </header>

      <main className="flex flex-1 items-center gap-10 py-10">
        <div className="max-w-xl">
          <h1 className="text-[40px] font-semibold leading-[1.15] tracking-tight text-ink">
            Meetings become notes.
            <br />
            <span className="text-accent">Without the typing.</span>
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            Copilot listens during meetings, lectures, and workshops — turning
            what is said into clean, structured notes in real time. Correct it in
            plain language if it gets something wrong.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/setup">
              <Button size="lg">Start a new session</Button>
            </Link>
            <Link href="/notes">
              <Button size="lg" variant="secondary">
                View previous notes
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative hidden flex-1 items-center justify-center md:flex">
          <div className="relative flex h-64 w-64 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-line bg-accent-soft/40" />
            <div className="absolute inset-6 rounded-full border border-dashed border-accent/30" />
            <BrandHeader subtitle={false} />
          </div>

          {floatPills.map((p) => (
            <div
              key={p.label}
              className={`absolute ${p.pos} ${p.delay} inline-flex rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${p.className}`}
            >
              {p.label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
