// src/components/HeroGateCard.tsx
import { colors } from "@chiron/design-tokens";
import { motion } from "framer-motion";

// src/utils/cn.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/HeroGateCard.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var statusMap = {
  pass: colors.successMint,
  warn: colors.signalAmber,
  fail: colors.criticalMagenta
};
function HeroGateCard({
  name,
  score,
  status,
  onClick,
  className
}) {
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.18, ease: "easeOut" },
      onClick,
      className: cn(
        "group relative flex h-48 w-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-3xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_28px_60px_rgba(3,8,15,0.6)]",
        className
      ),
      style: {
        background: "linear-gradient(135deg, rgba(13,27,42,0.6), rgba(17,20,23,0.85))",
        boxShadow: "0 20px 50px rgba(3, 8, 15, 0.5)"
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm uppercase tracking-[0.3em] text-blue-100/70", children: name }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "relative flex items-end gap-4",
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
            children: [
              /* @__PURE__ */ jsxs("span", { className: "text-6xl font-medium text-blue-50", children: [
                score,
                "%"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "pb-2 text-blue-100/60", children: "Threshold" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            layout: true,
            className: "relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-900/40",
            transition: { duration: 0.45, ease: [0.3, 0.8, 0.4, 1] },
            children: /* @__PURE__ */ jsx(
              motion.span,
              {
                className: "absolute inset-y-0 left-0 rounded-full",
                animate: { width: `${score}%` },
                transition: { duration: 0.6, ease: "easeOut" },
                style: { backgroundColor: statusMap[status] }
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/TimelineEventCard.tsx
import { colors as colors2 } from "@chiron/design-tokens";
import { motion as motion2 } from "framer-motion";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var toneStyles = {
  positive: { text: "text-successMint", glow: colors2.successMint },
  caution: { text: "text-signalAmber", glow: colors2.signalAmber },
  critical: { text: "text-criticalMagenta", glow: colors2.criticalMagenta }
};
function TimelineEventCard({
  time,
  label,
  impact,
  tone = "positive",
  className
}) {
  const toneClass = toneStyles[tone];
  return /* @__PURE__ */ jsxs2(
    motion2.li,
    {
      layout: true,
      whileHover: { translateY: -4 },
      transition: { duration: 0.28, ease: [0.3, 0.8, 0.4, 1] },
      className: cn(
        "group relative flex items-center justify-between gap-5 overflow-hidden rounded-3xl border border-white/8 bg-white/6 px-6 py-5 backdrop-blur-2xl",
        "shadow-[0_18px_48px_rgba(3,8,15,0.38)]",
        className
      ),
      style: { boxShadow: `0 18px 48px ${toneClass.glow}26` },
      children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx2("span", { className: "text-xs uppercase tracking-[0.42em] text-textSecondary/70", children: time }),
          /* @__PURE__ */ jsx2("span", { className: "text-base font-medium text-foreground sm:text-lg", children: label })
        ] }),
        /* @__PURE__ */ jsx2(
          motion2.span,
          {
            className: cn(
              "rounded-full border border-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.32em]",
              toneClass.text
            ),
            initial: { opacity: 0, scale: 0.94 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.32, ease: "easeOut" },
            children: impact
          }
        ),
        /* @__PURE__ */ jsx2(
          "div",
          {
            "aria-hidden": true,
            className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            style: { background: `radial-gradient(80% 160% at 90% 10%, ${toneClass.glow}22 0%, transparent 70%)` }
          }
        )
      ]
    }
  );
}
export {
  HeroGateCard,
  TimelineEventCard,
  cn
};
