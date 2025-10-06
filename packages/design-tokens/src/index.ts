export const colors = {
	spaceIndigo: "#0D1B2A",
	tungstenGray: "#111417",
	glassOverlay: "rgba(13, 27, 42, 0.72)",
	kineticCyan: "#38F6E6",
	emberOrange: "#FF6B35",
	signalAmber: "#FFB648",
	successMint: "#5CF7C8",
	criticalMagenta: "#F74F9E",
	textPrimary: "#E6F1FF",
	textSecondary: "#90A4C3",
} as const;

export const spacing = {
	grid: 8,
	radiusSoft: 18,
	radiusButton: 12,
	glassBlur: 24,
} as const;

export const motion = {
	heroTransition: "400ms cubic-bezier(0.3, 0.8, 0.4, 1)",
	micro: "120ms ease-out",
	drawer: "280ms cubic-bezier(0.2, 0.9, 0.4, 1)",
} as const;

export const typography = {
	headingDisplay: {
		fontFamily: "'Editorial New Variable', serif",
		fontVariationSettings: "'wght' 600, 'opsz' 32",
		letterSpacing: "-0.01em",
	},
	headingSans: {
		fontFamily: "'Inter', sans-serif",
		fontWeight: 600,
		lineHeight: 1.3,
	},
	body: {
		fontFamily: "'Inter', sans-serif",
		fontWeight: 400,
		lineHeight: 1.6,
	},
	mono: {
		fontFamily: "'IBM Plex Mono', monospace",
		fontWeight: 500,
		lineHeight: 1.4,
	},
} as const;

export type DesignTokens = {
	colors: typeof colors;
	spacing: typeof spacing;
	motion: typeof motion;
	typography: typeof typography;
};

export const tokens: DesignTokens = {
	colors,
	spacing,
	motion,
	typography,
};

export default tokens;
