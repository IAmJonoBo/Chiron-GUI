"use client";

import { HeroGateCard, TimelineEventCard } from "@chiron/ui";
import { motion } from "framer-motion";

const gateHealth = [
  { name: "Fusion Segment", score: 92, status: "pass" as const },
  { name: "Kinematics Mesh", score: 68, status: "warn" as const },
  { name: "Containment Umbra", score: 81, status: "pass" as const },
  { name: "Reactor Baffles", score: 47, status: "fail" as const },
];

const timeline = [
  {
    time: "08:24",
    label: "Delta Gate sync",
    impact: "Stable",
    tone: "positive" as const,
  },
  {
    time: "08:16",
    label: "Turbine telemetry",
    impact: "Spectrum drift",
    tone: "caution" as const,
  },
  {
    time: "08:04",
    label: "Sentinel recalibration",
    impact: "Manual assist",
    tone: "critical" as const,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-16 px-6 py-16 lg:px-12 xl:px-20">
      <section className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr]">
        <motion.div
          className="relative flex flex-col gap-8 overflow-hidden rounded-[42px] border border-white/10 bg-gradient-to-br from-blue-900/30 via-blue-900/10 to-black/60 p-10 text-blue-50 shadow-[0_40px_120px_rgba(3,8,15,0.55)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.3, 0.8, 0.4, 1] }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.45em] text-blue-200/70">
                Chiron Command
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.1] text-blue-50 md:text-5xl">
                Industrial autonomy orchestration in one cinematic pane of glass
              </h1>
            </div>
            <motion.div
              className="hidden min-w-[180px] flex-col items-end rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-right shadow-inner lg:flex"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            >
              <span className="text-xs uppercase tracking-[0.4em] text-blue-200/70">
                Autonomy Index
              </span>
              <span className="mt-3 text-5xl font-medium text-successMint">
                87%
              </span>
              <span className="text-sm text-blue-100/70">
                +4.2% vs. last cycle
              </span>
            </motion.div>
          </div>

          <p className="max-w-3xl text-lg text-blue-100/80 md:text-xl">
            Command every sentry, drone, and containment field with adaptive
            intelligence. Fast cross-site synchronization keeps field engineers
            locked with HQ insights while the system preemptively re-balances
            risk.
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {gateHealth.map((gate) => (
              <HeroGateCard key={gate.name} {...gate} />
            ))}
          </div>
        </motion.div>

        <motion.aside
          className="flex flex-col gap-6 rounded-[38px] border border-white/10 bg-gradient-to-br from-slate-900/50 to-black/70 p-8 text-blue-100 shadow-[0_30px_90px_rgba(3,8,15,0.5)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.3, 0.8, 0.4, 1] }}
        >
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-[0.18em] text-blue-200/80">
                Live events
              </h2>
              <p className="text-sm text-blue-100/60">
                Realtime industrial telemetry
              </p>
            </div>
            <span className="rounded-full border border-successMint/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-successMint">
              Sync
            </span>
          </header>

          <ul className="space-y-4">
            {timeline.map((item) => (
              <TimelineEventCard key={item.time} {...item} />
            ))}
          </ul>

          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.4em] text-blue-200/70">
            Next sync window in 00:04:26
          </div>
        </motion.aside>
      </section>

      <section className="grid gap-6 rounded-[38px] border border-white/10 bg-gradient-to-br from-blue-900/30 via-blue-900/10 to-black/70 p-8 shadow-[0_40px_120px_rgba(3,8,15,0.55)] lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm uppercase tracking-[0.45em] text-blue-200/70">
            Risk envelope forecast
          </h3>
          <p className="text-lg text-blue-100/80">
            Neural predictors flag a rising oscillation across the reactor
            baffles. Suggest staging countermeasures and additional drones
            before the next solar delta surge.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100/70">
          <span className="text-xs uppercase tracking-[0.4em] text-blue-200/70">
            AI advisory
          </span>
          <p>
            Deploy two spectral dampeners to Grid 4C and escalate to Sentinel
            tier if drift exceeds 12% over baseline.
          </p>
        </div>
      </section>
    </main>
  );
}
