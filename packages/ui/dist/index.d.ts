import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

type GateState = "pass" | "warn" | "fail";
interface HeroGateCardProps {
    name: string;
    score: number;
    status: GateState;
    baseline?: number | null;
    delta?: number | null;
    trend?: number[];
    throughput?: number | null;
    load?: number | null;
    onClick?: () => void;
    className?: string;
}
declare function HeroGateCard({ name, score, status, baseline, delta, trend, throughput, load, onClick, className, }: HeroGateCardProps): react_jsx_runtime.JSX.Element;

type MetricTone = "default" | "positive" | "caution" | "critical";
interface HeroMetricDatum {
    id?: string;
    label: string;
    primary: string;
    secondary?: string | null;
    trend?: number | null;
    tone?: MetricTone;
}
interface HeroMetricStackProps {
    metrics: HeroMetricDatum[];
    orientation?: "vertical" | "horizontal";
    inlineSecondary?: boolean;
    className?: string;
}
declare function HeroMetricStack({ metrics, orientation, inlineSecondary, className, }: HeroMetricStackProps): react_jsx_runtime.JSX.Element;

type ComparisonTone = "neutral" | "positive" | "negative";
interface TelemetryComparisonPillProps {
    label?: string;
    value: string;
    comparisonLabel?: string;
    comparisonValue?: string;
    delta?: number | null;
    tone?: ComparisonTone;
    className?: string;
}
declare function TelemetryComparisonPill({ label, value, comparisonLabel, comparisonValue, delta, tone, className, }: TelemetryComparisonPillProps): react_jsx_runtime.JSX.Element;

type GaugeTone = "pass" | "warn" | "fail";
interface TelemetryRadialGaugeProps {
    value: number;
    baseline?: number | null;
    delta?: number | null;
    tone?: GaugeTone;
    size?: number;
    thickness?: number;
    label?: string;
    className?: string;
}
declare function TelemetryRadialGauge({ value, baseline, delta, tone, size, thickness, label, className, }: TelemetryRadialGaugeProps): react_jsx_runtime.JSX.Element;

interface TelemetrySparklineProps {
    values: number[];
    width?: number;
    height?: number;
    strokeColor?: string;
    fillColor?: string;
    className?: string;
    opacity?: number;
}
declare function TelemetrySparkline({ values, width, height, strokeColor, fillColor, className, opacity, }: TelemetrySparklineProps): react_jsx_runtime.JSX.Element;

type TimelineTone = "positive" | "caution" | "critical";
interface TimelineEventAttributes {
    impactLabel?: ReactNode;
    description?: ReactNode;
    [key: string]: unknown;
}
interface TimelineEventCardProps {
    label: string;
    impact: string;
    time: string;
    secondaryTime?: string;
    attributes?: TimelineEventAttributes;
    overlay?: string | null;
    tone?: TimelineTone;
    className?: string;
}
declare function TimelineEventCard({ label, impact, time, secondaryTime, attributes, overlay, tone, className, }: TimelineEventCardProps): react_jsx_runtime.JSX.Element;

type OverlayPreset = "aurora" | "grid" | "flare" | "wave" | "pulse";
interface TimelinePulseOverlayProps {
    preset?: OverlayPreset;
    tone?: "positive" | "caution" | "critical";
    className?: string;
}
declare function TimelinePulseOverlay({ preset, tone, className, }: TimelinePulseOverlayProps): react_jsx_runtime.JSX.Element;

interface TimelineEventListProps {
    items: TimelineEventCardProps[];
    className?: string;
    cardClassName?: string;
}
declare function TimelineEventList({ items, className, cardClassName, }: TimelineEventListProps): react_jsx_runtime.JSX.Element;

interface TimelineEventListItemProps extends TimelineEventCardProps {
    accent?: "left" | "right";
    lineClassName?: string;
}
declare function TimelineEventListItem({ accent, lineClassName, className, ...cardProps }: TimelineEventListItemProps): react_jsx_runtime.JSX.Element;

declare function cn(...classes: Array<string | undefined | false | null>): string;

export { type ComparisonTone, type GateState, type GaugeTone, HeroGateCard, type HeroGateCardProps, type HeroMetricDatum, HeroMetricStack, type HeroMetricStackProps, type MetricTone, type OverlayPreset, TelemetryComparisonPill, type TelemetryComparisonPillProps, TelemetryRadialGauge, type TelemetryRadialGaugeProps, TelemetrySparkline, type TelemetrySparklineProps, type TimelineEventAttributes, TimelineEventCard, type TimelineEventCardProps, TimelineEventList, TimelineEventListItem, type TimelineEventListItemProps, type TimelineEventListProps, TimelinePulseOverlay, type TimelinePulseOverlayProps, type TimelineTone, cn };
