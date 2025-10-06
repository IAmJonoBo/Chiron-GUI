import * as react_jsx_runtime from 'react/jsx-runtime';

type GateState = "pass" | "warn" | "fail";
interface HeroGateCardProps {
    name: string;
    score: number;
    status: GateState;
    onClick?: () => void;
    className?: string;
}
declare function HeroGateCard({ name, score, status, onClick, className, }: HeroGateCardProps): react_jsx_runtime.JSX.Element;

type TimelineTone = "positive" | "caution" | "critical";
interface TimelineEventCardProps {
    time: string;
    label: string;
    impact: string;
    tone?: TimelineTone;
    className?: string;
}
declare function TimelineEventCard({ time, label, impact, tone, className }: TimelineEventCardProps): react_jsx_runtime.JSX.Element;

declare function cn(...classes: Array<string | undefined | false | null>): string;

export { HeroGateCard, type HeroGateCardProps, TimelineEventCard, type TimelineEventCardProps, cn };
