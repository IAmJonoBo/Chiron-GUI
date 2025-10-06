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
  HeroMetricStack: () => HeroMetricStack,
  TelemetryComparisonPill: () => TelemetryComparisonPill,
  TelemetryRadialGauge: () => TelemetryRadialGauge,
  TelemetrySparkline: () => TelemetrySparkline,
  TimelineEventCard: () => TimelineEventCard,
  TimelineEventList: () => TimelineEventList,
  TimelineEventListItem: () => TimelineEventListItem,
  TimelinePulseOverlay: () => TimelinePulseOverlay,
  cn: () => cn
});
module.exports = __toCommonJS(index_exports);

// src/components/HeroGateCard.tsx
var import_design_tokens = require("@chiron/design-tokens");

// src/utils/cn.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/utils/motion.ts
var import_framer_motion = require("framer-motion");

// src/components/TelemetryRadialGauge.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var tonePalette = {
  pass: { stroke: "#50F5C5", glow: "rgba(80,245,197,0.45)" },
  warn: { stroke: "#F9B84A", glow: "rgba(249,184,74,0.42)" },
  fail: { stroke: "#FF5DA2", glow: "rgba(255,93,162,0.42)" }
};
function TelemetryRadialGauge({
  value,
  baseline,
  delta,
  tone = "pass",
  size = 134,
  thickness = 12,
  label,
  className
}) {
  const normalized = Math.max(0, Math.min(100, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - normalized / 100);
  const palette = tonePalette[tone];
  const trendLabel = (0, import_react.useMemo)(() => {
    if (delta == null) {
      return baseline != null ? `Baseline ${baseline}%` : "";
    }
    const prefix = delta > 0 ? "+" : "";
    return `${prefix}${delta.toFixed(1)} pts vs baseline${baseline != null ? ` ${baseline}%` : ""}`;
  }, [baseline, delta]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: cn(
        "relative flex h-full w-full flex-col items-center justify-center",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "svg",
            {
              viewBox: `0 0 ${size} ${size}`,
              width: size,
              height: size,
              "aria-hidden": "true",
              focusable: "false",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "circle",
                  {
                    cx: size / 2,
                    cy: size / 2,
                    r: radius,
                    stroke: "rgba(255,255,255,0.08)",
                    strokeWidth: thickness,
                    fill: "none",
                    strokeDasharray: circumference,
                    strokeLinecap: "round"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_framer_motion.motion.circle,
                  {
                    cx: size / 2,
                    cy: size / 2,
                    r: radius,
                    stroke: palette.stroke,
                    strokeWidth: thickness,
                    fill: "none",
                    strokeDasharray: circumference,
                    strokeDashoffset: dashOffset,
                    strokeLinecap: "round",
                    style: { filter: `drop-shadow(0 0 28px ${palette.glow})` },
                    initial: { strokeDashoffset: circumference },
                    animate: { strokeDashoffset: dashOffset },
                    transition: { duration: 1, ease: [0.3, 0.7, 0.4, 1] }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs uppercase tracking-[0.35em] text-white/50", children: label ?? "Score" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-4xl font-semibold text-white md:text-5xl", children: [
              normalized.toFixed(0),
              "%"
            ] })
          ] })
        ] }),
        trendLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_framer_motion.motion.span,
          {
            className: "mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60",
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.45, ease: "easeOut" },
            children: trendLabel
          }
        ) : null
      ]
    }
  );
}

// src/components/TelemetrySparkline.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function buildPath(values, width, height) {
  if (values.length === 0) {
    return { line: "", area: "" };
  }
  if (values.length === 1) {
    const midX = width / 2;
    const midY = height / 2;
    return {
      line: `M${midX} ${midY} L${width} ${midY}`,
      area: `M0 ${height} L${midX} ${midY} L${width} ${midY} L${width} ${height} Z`
    };
  }
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values.map((value, index) => {
    const x = index / (values.length - 1) * width;
    const normalized = (value - min) / range;
    const y = height - normalized * height;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  });
  const line = points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const area = `M0 ${height} ${points.map(([x, y]) => `L${x} ${y}`).join(" ")} L${width} ${height} Z`;
  return { line, area };
}
function TelemetrySparkline({
  values,
  width = 180,
  height = 64,
  strokeColor = "rgba(80, 245, 197, 0.85)",
  fillColor = "rgba(80, 245, 197, 0.18)",
  className,
  opacity = 1
}) {
  const gradientId = (0, import_react2.useId)();
  const { line, area } = (0, import_react2.useMemo)(
    () => buildPath(values, width, height),
    [values, width, height]
  );
  const hasData = values.length > 0 && line.length > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      className: cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-3",
        className
      ),
      style: { opacity },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "svg",
        {
          viewBox: `0 0 ${width} ${height}`,
          className: "h-20 w-full",
          "aria-hidden": "true",
          focusable: "false",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("defs", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "linearGradient",
                {
                  id: `${gradientId}-stroke`,
                  x1: "0",
                  x2: "1",
                  y1: "0",
                  y2: "0",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "0%", stopColor: strokeColor, stopOpacity: 0.4 }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "55%", stopColor: strokeColor, stopOpacity: 1 }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "100%", stopColor: strokeColor, stopOpacity: 0.6 })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("linearGradient", { id: `${gradientId}-fill`, x1: "0", x2: "0", y1: "0", y2: "1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "0%", stopColor: fillColor, stopOpacity: 0.85 }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "100%", stopColor: fillColor, stopOpacity: 0 })
              ] })
            ] }),
            hasData ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                import_framer_motion.motion.path,
                {
                  d: area,
                  fill: `url(#${gradientId}-fill)`,
                  initial: { opacity: 0, transform: "translateY(12px)" },
                  animate: { opacity: 1, transform: "translateY(0px)" },
                  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                import_framer_motion.motion.path,
                {
                  d: line,
                  stroke: `url(#${gradientId}-stroke)`,
                  strokeWidth: 2.4,
                  fill: "none",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  initial: { pathLength: 0, opacity: 0 },
                  animate: { pathLength: 1, opacity: 1 },
                  transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
                }
              )
            ] }) : null
          ]
        }
      )
    }
  );
}

// src/components/HeroGateCard.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var statusPalette = {
  pass: {
    color: import_design_tokens.colors.successMint,
    label: "Stable",
    glow: "rgba(80,245,197,0.48)"
  },
  warn: {
    color: import_design_tokens.colors.signalAmber,
    label: "Caution",
    glow: "rgba(249,184,74,0.48)"
  },
  fail: {
    color: import_design_tokens.colors.criticalMagenta,
    label: "Critical",
    glow: "rgba(255,93,162,0.48)"
  }
};
function HeroGateCard({
  name,
  score,
  status,
  baseline,
  delta,
  trend,
  throughput,
  load,
  onClick,
  className
}) {
  const palette = statusPalette[status];
  const deltaLabel = delta != null ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)} pts` : void 0;
  const loadLabel = load != null ? `${Math.round(Math.min(100, Math.max(0, load * 100)))}% load` : "Adaptive Load";
  const throughputLabel = throughput != null ? `${throughput.toFixed(1)} u/s throughput` : "Syncing telemetry";
  const sparklineValues = trend?.length ? trend : [score, baseline ?? score];
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    import_framer_motion.motion.button,
    {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      onClick,
      className: cn(
        "group relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.04] p-6 text-left backdrop-blur-3xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_32px_70px_rgba(8,12,22,0.52)]",
        className
      ),
      style: {
        background: "radial-gradient(120% 160% at 10% 0%, rgba(135,206,235,0.08) 0%, transparent 60%), linear-gradient(135deg, rgba(15,24,39,0.78), rgba(11,14,23,0.94))",
        boxShadow: `0 22px 60px rgba(3, 8, 15, 0.52), inset 0 0 0 1px rgba(255,255,255,0.04)`
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-xs uppercase tracking-[0.35em] text-blue-100/70", children: name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            import_framer_motion.motion.span,
            {
              className: "rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.32em]",
              style: { borderColor: `${palette.color}40`, color: palette.color },
              initial: { opacity: 0, y: -6 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.32, ease: "easeOut" },
              children: palette.label
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex shrink-0 items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            TelemetryRadialGauge,
            {
              value: score,
              baseline,
              delta: delta ?? void 0,
              tone: status,
              label: "Gate",
              size: 132
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-col gap-2 text-blue-100/80", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "text-4xl font-semibold text-blue-50 md:text-5xl", children: [
              score.toFixed(0),
              "%"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-blue-100/60", children: [
              baseline != null ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { children: [
                "Baseline ",
                baseline,
                "%"
              ] }) : null,
              deltaLabel ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "span",
                {
                  className: cn(
                    delta && delta < 0 ? "text-rose-200/70" : "text-successMint/80"
                  ),
                  children: deltaLabel
                }
              ) : null
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          TelemetrySparkline,
          {
            values: sparklineValues.map((value) => Math.round(value)),
            strokeColor: palette.color,
            fillColor: `${palette.glow}`,
            className: "mt-1",
            opacity: 0.95
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-blue-100/55", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: throughputLabel }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: loadLabel })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            style: {
              background: `radial-gradient(140% 180% at 80% 0%, ${palette.color}22 0%, transparent 70%)`
            }
          }
        )
      ]
    }
  );
}

// src/components/HeroMetricStack.tsx
var import_design_tokens2 = require("@chiron/design-tokens");
var import_jsx_runtime4 = require("react/jsx-runtime");
var toneToken = {
  default: { color: "rgba(173,188,255,0.78)", glow: "rgba(173,188,255,0.18)" },
  positive: { color: import_design_tokens2.colors.successMint, glow: "rgba(80,245,197,0.25)" },
  caution: { color: import_design_tokens2.colors.signalAmber, glow: "rgba(249,184,74,0.22)" },
  critical: { color: import_design_tokens2.colors.criticalMagenta, glow: "rgba(255,93,162,0.22)" }
};
function HeroMetricStack({
  metrics,
  orientation = "vertical",
  inlineSecondary = false,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: cn(
        "relative isolate flex flex-wrap gap-5",
        orientation === "vertical" ? "flex-col" : "items-stretch",
        className
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pointer-events-none absolute inset-0 rounded-[20px] border border-white/[0.04] bg-white/[0.02]" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { className: "relative grid w-full gap-4", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_framer_motion.AnimatePresence, { initial: false, children: metrics.map((metric) => {
          const key = metric.id ?? metric.label;
          const tone = toneToken[metric.tone ?? "default"];
          const numericTrend = metric.trend ?? void 0;
          const trendLabel = numericTrend != null ? `${numericTrend > 0 ? "+" : ""}${numericTrend.toFixed(1)}%` : null;
          const isPositiveTrend = numericTrend != null && numericTrend > 0;
          return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            import_framer_motion.motion.li,
            {
              layout: true,
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -12 },
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              className: "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "div",
                  {
                    className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    style: {
                      background: `radial-gradient(120% 140% at 20% -10%, ${tone.glow} 0%, transparent 60%)`
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "relative flex flex-col gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-[10px] uppercase tracking-[0.32em] text-white/55", children: metric.label }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                    "div",
                    {
                      className: cn(
                        "flex flex-wrap items-baseline gap-3 text-white",
                        inlineSecondary ? "items-center" : ""
                      ),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                          import_framer_motion.motion.span,
                          {
                            layout: true,
                            className: "text-2xl font-semibold md:text-3xl",
                            style: { color: tone.color },
                            children: metric.primary
                          }
                        ),
                        metric.secondary ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "text-xs uppercase tracking-[0.28em] text-white/50", children: metric.secondary }) : null,
                        trendLabel ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                          import_framer_motion.motion.span,
                          {
                            initial: { opacity: 0, y: 6 },
                            animate: { opacity: 1, y: 0 },
                            transition: { duration: 0.24, delay: 0.08 },
                            className: cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.28em]",
                              isPositiveTrend ? "border-successMint/35 text-successMint" : "border-criticalMagenta/35 text-criticalMagenta"
                            ),
                            children: trendLabel
                          }
                        ) : null
                      ]
                    }
                  )
                ] })
              ]
            },
            key
          );
        }) }) })
      ]
    }
  );
}

// src/components/TelemetryComparisonPill.tsx
var import_design_tokens3 = require("@chiron/design-tokens");
var import_jsx_runtime5 = require("react/jsx-runtime");
var tonePalette2 = {
  neutral: {
    color: "rgba(209,220,255,0.82)",
    border: "rgba(209,220,255,0.28)",
    shadow: "0 0 28px rgba(80,100,255,0.28)"
  },
  positive: {
    color: import_design_tokens3.colors.successMint,
    border: "rgba(80,245,197,0.35)",
    shadow: "0 0 32px rgba(80,245,197,0.36)"
  },
  negative: {
    color: import_design_tokens3.colors.criticalMagenta,
    border: "rgba(255,93,162,0.35)",
    shadow: "0 0 32px rgba(255,93,162,0.36)"
  }
};
function TelemetryComparisonPill({
  label,
  value,
  comparisonLabel,
  comparisonValue,
  delta,
  tone = "neutral",
  className
}) {
  const palette = tonePalette2[tone];
  const deltaLabel = delta != null ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%` : null;
  const deltaTone = delta == null ? tone : delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";
  const deltaPalette = tonePalette2[deltaTone];
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    import_framer_motion.motion.div,
    {
      layout: true,
      className: cn(
        "inline-flex items-center gap-4 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/75 backdrop-blur-xl",
        className
      ),
      style: { borderColor: palette.border, boxShadow: palette.shadow },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col gap-1 text-left", children: [
          label ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-[10px] text-white/55", children: label }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-sm font-semibold text-white", children: value })
        ] }),
        comparisonValue ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col gap-1 text-left text-white/60", children: [
          comparisonLabel ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-[10px]", children: comparisonLabel }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-sm font-semibold text-white/80", children: comparisonValue })
        ] }) : null,
        deltaLabel ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_framer_motion.motion.span,
          {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.28, ease: "easeOut" },
            className: "rounded-full border px-3 py-1 text-[10px] font-semibold",
            style: {
              borderColor: deltaPalette.border,
              color: deltaPalette.color,
              boxShadow: deltaPalette.shadow
            },
            children: deltaLabel
          }
        ) : null
      ]
    }
  );
}

// src/components/TimelineEventCard.tsx
var import_design_tokens4 = require("@chiron/design-tokens");

// src/components/TimelinePulseOverlay.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var presetMap = {
  aurora: "radial-gradient(120% 160% at 10% 0%, rgba(80,245,197,0.4) 0%, transparent 65%), radial-gradient(130% 200% at 90% 10%, rgba(86,150,252,0.28) 0%, transparent 75%)",
  grid: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 28%), radial-gradient(140% 200% at 80% 20%, rgba(249,184,74,0.28) 0%, transparent 70%)",
  flare: "radial-gradient(110% 200% at 50% 0%, rgba(255,93,162,0.38) 0%, transparent 75%), radial-gradient(120% 180% at 10% 90%, rgba(86,150,252,0.22) 0%, transparent 80%)",
  wave: "linear-gradient(120deg, rgba(120,224,255,0.28) 0%, transparent 55%), radial-gradient(140% 160% at 50% 100%, rgba(69,161,255,0.18) 0%, transparent 70%)",
  pulse: "radial-gradient(140% 220% at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 70%)"
};
var toneOpacity = {
  positive: 0.25,
  caution: 0.35,
  critical: 0.4
};
function TimelinePulseOverlay({
  preset = "aurora",
  tone = "positive",
  className
}) {
  const background = presetMap[preset] ?? presetMap.aurora;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_framer_motion.motion.div,
    {
      className: cn(
        "pointer-events-none absolute inset-0 opacity-0",
        className
      ),
      style: { background, mixBlendMode: "screen", opacity: toneOpacity[tone] },
      initial: { scale: 0.96, opacity: 0 },
      animate: { scale: 1, opacity: toneOpacity[tone] },
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] }
    }
  );
}

// src/components/TimelineEventCard.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var toneStyles = {
  positive: {
    text: "text-successMint",
    glow: import_design_tokens4.colors.successMint,
    border: "border-successMint/20"
  },
  caution: {
    text: "text-signalAmber",
    glow: import_design_tokens4.colors.signalAmber,
    border: "border-signalAmber/25"
  },
  critical: {
    text: "text-criticalMagenta",
    glow: import_design_tokens4.colors.criticalMagenta,
    border: "border-criticalMagenta/25"
  }
};
var overlayPresets = {
  aurora: "aurora",
  grid: "grid",
  flare: "flare",
  nebula: "wave",
  default: "pulse"
};
function TimelineEventCard({
  label,
  impact,
  time,
  secondaryTime,
  attributes,
  overlay,
  tone = "positive",
  className
}) {
  const toneClass = toneStyles[tone];
  const overlayPreset = overlay ? overlayPresets[overlay] ?? overlayPresets.default : overlayPresets.default;
  const impactLabel = attributes?.impactLabel ?? impact;
  const description = attributes?.description;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
    import_framer_motion.motion.li,
    {
      layout: true,
      whileHover: { translateY: -6 },
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      className: cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-white/10 bg-white/6 px-6 py-5 backdrop-blur-2xl",
        "shadow-[0_22px_56px_rgba(4,10,22,0.46)]",
        className
      ),
      style: { boxShadow: `0 22px 56px ${toneClass.glow}28` },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex flex-col gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { className: "text-[11px] uppercase tracking-[0.4em] text-white/55", children: [
              time,
              secondaryTime ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "ml-2 text-white/35", children: secondaryTime }) : null
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-base font-semibold text-white sm:text-lg", children: label })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            import_framer_motion.motion.span,
            {
              className: cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em]",
                toneClass.text,
                toneClass.border
              ),
              initial: { opacity: 0, scale: 0.94 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.32, ease: "easeOut" },
              children: impactLabel
            }
          )
        ] }),
        description ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm text-white/70", children: description }) : null,
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(TimelinePulseOverlay, { preset: overlayPreset, tone })
      ]
    }
  );
}

// src/components/timeline-event-list.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function TimelineEventList({
  items,
  className,
  cardClassName
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "ul",
    {
      className: cn(
        "relative grid gap-4 rounded-[28px] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-2xl",
        "before:absolute before:left-5 before:top-6 before:bottom-6 before:w-px before:bg-gradient-to-b before:from-white/10 before:via-white/25 before:to-white/10",
        className
      ),
      children: items.map((item, index) => {
        const fallbackKey = `${item.label}-${index}`;
        const key = item.time ? `${item.time}-${item.label}` : fallbackKey;
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("li", { className: "relative pl-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "absolute left-[13px] top-8 h-2 w-2 -translate-x-1/2 rounded-full bg-gradient-to-br from-white/70 to-white/10 shadow-[0_0_18px_rgba(255,255,255,0.38)]" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(TimelineEventCard, { ...item, className: cardClassName })
        ] }, key);
      })
    }
  );
}

// src/components/timeline-event-list-item.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function TimelineEventListItem({
  accent = "left",
  lineClassName,
  className,
  ...cardProps
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "li",
    {
      className: cn(
        "relative pl-8",
        accent === "right" ? "pl-0 pr-8 text-right" : ""
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "pointer-events-none absolute top-8 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/70 to-white/10",
              accent === "left" ? "left-[13px]" : "right-[13px]"
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "span",
          {
            "aria-hidden": true,
            className: cn(
              "pointer-events-none absolute top-8 h-px w-8 -translate-y-1/2 bg-gradient-to-r from-white/10 via-white/30 to-white/10",
              accent === "left" ? "left-0" : "right-0 rotate-180",
              lineClassName
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TimelineEventCard, { ...cardProps, className })
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HeroGateCard,
  HeroMetricStack,
  TelemetryComparisonPill,
  TelemetryRadialGauge,
  TelemetrySparkline,
  TimelineEventCard,
  TimelineEventList,
  TimelineEventListItem,
  TimelinePulseOverlay,
  cn
});
