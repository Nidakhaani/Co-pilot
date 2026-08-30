import Link from "next/link";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/Button";
import { LogoMark } from "@/components/BrandHeader";

const NOTE_TYPES = [
  {
    type: "Key Point",
    desc: "A notable statement or insight worth keeping.",
    cls: "bg-keypoint-soft text-keypoint",
    dot: "bg-keypoint",
  },
  {
    type: "Decision",
    desc: "Something the group agreed on.",
    cls: "bg-decision-soft text-decision",
    dot: "bg-decision",
  },
  {
    type: "Action Item",
    desc: "A task with an implied or stated owner.",
    cls: "bg-action-soft text-action",
    dot: "bg-action",
  },
  {
    type: "Question",
    desc: "An open question raised but not yet resolved.",
    cls: "bg-question-soft text-question",
    dot: "bg-question",
  },
  {
    type: "Note",
    desc: "Everything else that fits a normal note.",
    cls: "bg-note-soft text-note",
    dot: "bg-note",
  },
];

const LOOP_STEPS = [
  {
    n: "01",
    title: "It listens",
    body: "During a meeting, lecture, or workshop, Copilot captures the raw conversation in real time.",
    color: "text-accent",
  },
  {
    n: "02",
    title: "It understands",
    body: "Each spoken chunk is classified into one of five note types, with a confidence score.",
    color: "text-keypoint",
  },
  {
    n: "03",
    title: "You refine",
    body: "Notes appear automatically — nothing blocks the session. If Copilot mislabels one, edit it in a sentence or a tap.",
    color: "text-action",
  },
  {
    n: "04",
    title: "It wraps up",
    body: "At the end, Copilot groups everything into a review: Key points, Decisions, Action items, Open questions.",
    color: "text-decision",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <BrandHeader />
          <div className="flex items-center gap-3">
            <Link href="/notes" className="text-sm font-medium text-muted transition-colors hover:text-ink">
              Previous notes
            </Link>
            <Link href="/welcome">
              <Button size="sm">Try the demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Ambient Knowledge Companion
          </span>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.12] tracking-tight text-ink">
            Meetings become notes.
            <br />
            <span className="text-accent">Without the typing.</span>
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            Copilot is a real-time editor, not a transcription tool. It listens
            quietly, turns the conversation into clean, structured notes while
            it happens, and lets you fix anything it gets wrong — all without
            interrupting the flow.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/welcome">
              <Button size="lg">Start a new session</Button>
            </Link>
            <Link href="/notes">
              <Button size="lg" variant="secondary">
                View previous notes
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <Link href="/" aria-label="Copilot — go to home">
            <div className="relative flex h-72 w-72 items-center justify-center transition-transform hover:scale-[1.02]">
              <div className="absolute inset-0 rounded-full border border-line bg-accent-soft/40" />
              <div className="absolute inset-8 rounded-full border border-dashed border-accent/30" />
              <LogoMark size={44} />
            </div>
          </Link>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {NOTE_TYPES.map((t) => (
              <span key={t.type} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${t.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                {t.type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Watch the demo */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-action-soft px-3 py-1.5 text-xs font-semibold text-action">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch the demo
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              See it work in under a minute
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Watch how a raw conversation turns into clean, structured notes in
              real time — and how a flagged note gets fixed without stopping the
              session. The demo walkthrough video is on its way.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/welcome">
                <Button size="lg">Try the interactive demo</Button>
              </Link>
              <Link href="/notes">
                <Button size="lg" variant="secondary">
                  View previous notes
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-line bg-canvas">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-line">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-action">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-sm font-semibold text-ink">Demo video coming soon</span>
              <span className="text-xs text-muted">A short walkthrough is being prepared</span>
            </div>
          </div>
        </div>
      </section>

      {/* The core loop */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            The core loop
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Raw transcript comes in on the left. Copilot classifies each chunk
            into a structured &ldquo;block&rdquo; on the right. Flags anything it&apos;s
            unsure about. You correct only what is wrong.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP_STEPS.map((s) => (
              <div key={s.n} className="rounded-[12px] border border-line bg-card p-5">
                <div className={`text-sm font-bold ${s.color}`}>{s.n}</div>
                <div className="mt-2 text-[15px] font-semibold text-ink">{s.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The five note types */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Five kinds of thing Copilot recognizes
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Every capture is color-coded by type and given a confidence score.
          Blocks below the confidence threshold are flagged so you can spot and
          fix them quickly.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {NOTE_TYPES.map((t) => (
            <div key={t.type} className="rounded-[12px] border border-line bg-card p-5">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.cls}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                {t.type}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How correction works */}
      <section className="border-y border-line bg-accent-soft/20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">
              Correct it without missing a beat
            </h2>
            <p className="mt-3 text-muted">
              Capture never blocks on confirmation. Each block carries a subtle{" "}
              <span className="font-medium text-ink">Edit</span> control — tap
              it to fix anything Copilot got wrong.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-question" />
                <p className="text-sm leading-relaxed text-muted">
                  Describe the fix in plain language (e.g.{" "}
                  <em className="text-ink">&ldquo;this was an example, not a task&rdquo;</em>
                  ) — Copilot reclassifies and rewrites.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
                <p className="text-sm leading-relaxed text-muted">
                  Or tap a quick type chip to reclassify instantly.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-keypoint" />
                <p className="text-sm leading-relaxed text-muted">
                  The block updates in place and listening simply continues.
                </p>
              </li>
            </ul>
          </div>

          <div className="rounded-[12px] border border-flagged/30 bg-card p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-flagged">
              Flagged block — low confidence
            </div>
            <div className="mt-3 rounded-[10px] border border-flagged/20 bg-flagged-soft/30 p-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-flagged/20 bg-flagged-soft px-2.5 py-0.5 text-xs font-semibold text-flagged">
                <span className="h-1.5 w-1.5 rounded-full bg-flagged" />
                Flagged
              </span>
              <div className="mt-2.5 text-[15px] font-semibold text-ink">
                Beta has 40 testers; activation up ~12%
              </div>
              <div className="mt-1 text-sm text-muted">
                Early signal, not yet conclusive.
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-flagged">Low confidence</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-flagged px-2.5 py-1 text-xs font-semibold text-white">
                Edit to fix
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo notice */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[14px] border border-line bg-white p-8">
          <div className="flex items-center gap-2 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 11v5m0-8.01.01-.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold text-ink">
              This is an interactive demo (Phase 1)
            </span>
          </div>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
            The demo runs entirely in the browser with{" "}
            <span className="font-medium text-ink">scripted, simulated data</span> —
            no real microphone, no backend, and no live AI calls yet. The
            &ldquo;streaming&rdquo; transcript and notes are played back on a timer to show
            the product flow end to end: let it finish, then edit anything that
            looks wrong. Real speech-to-text and classification come in later
            phases.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/welcome">
              <Button size="lg">Try the demo</Button>
            </Link>
            <Link href="/notes">
              <Button size="lg" variant="secondary">
                View previous notes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        Copilot — Ambient Knowledge Companion · MVP demo
      </footer>
    </div>
  );
}
