"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  HeroGateCard: () => HeroGateCard,
  TimelineEventCard: () => TimelineEventCard,
  cn: () => cn
});
module.exports = __toCommonJS(index_exports);

// src/components/HeroGateCard.tsx
var import_design_tokens = require("@chiron/design-tokens");
var import_framer_motion = require("framer-motion");

// src/utils/cn.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/HeroGateCard.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var statusMap = {
  pass: import_design_tokens.colors.successMint,
  warn: import_design_tokens.colors.signalAmber,
  fail: import_design_tokens.colors.criticalMagenta
};
function HeroGateCard({
  name,
  score,
  status,
  onClick,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_framer_motion.motion.button,
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm uppercase tracking-[0.3em] text-blue-100/70", children: name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_framer_motion.motion.div,
          {
            className: "relative flex items-end gap-4",
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: "easeOut" },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-6xl font-medium text-blue-50", children: [
                score,
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pb-2 text-blue-100/60", children: "Threshold" })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_framer_motion.motion.div,
          {
            layout: true,
            className: "relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-900/40",
            transition: { duration: 0.45, ease: [0.3, 0.8, 0.4, 1] },
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_framer_motion.motion.span,
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
var import_design_tokens2 = require("@chiron/design-tokens");
var import_framer_motion2 = require("framer-motion");
var import_jsx_runtime2 = require("react/jsx-runtime");
var toneStyles = {
  positive: { text: "text-successMint", glow: import_design_tokens2.colors.successMint },
  caution: { text: "text-signalAmber", glow: import_design_tokens2.colors.signalAmber },
  critical: { text: "text-criticalMagenta", glow: import_design_tokens2.colors.criticalMagenta }
};
function TimelineEventCard({
  time,
  label,
  impact,
  tone = "positive",
  className
}) {
  const toneClass = toneStyles[tone];
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_framer_motion2.motion.li,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-xs uppercase tracking-[0.42em] text-textSecondary/70", children: time }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-base font-medium text-foreground sm:text-lg", children: label })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_framer_motion2.motion.span,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HeroGateCard,
  TimelineEventCard,
  cn
});
