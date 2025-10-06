import type { Config } from "tailwindcss";

import { colors, spacing, typography } from "./index";

export const tailwindPreset: Config = {
	darkMode: ["class", ":is([data-theme='dark'])"],
	theme: {
		extend: {
			colors: {
				background: colors.spaceIndigo,
				surface: colors.tungstenGray,
				accent: colors.kineticCyan,
				kineticCyan: colors.kineticCyan,
				warn: colors.signalAmber,
				signalAmber: colors.signalAmber,
				success: colors.successMint,
				successMint: colors.successMint,
				danger: colors.criticalMagenta,
				criticalMagenta: colors.criticalMagenta,
				muted: colors.textSecondary,
				foreground: colors.textPrimary,
				textPrimary: colors.textPrimary,
				textSecondary: colors.textSecondary,
				spaceIndigo: colors.spaceIndigo,
				tungstenGray: colors.tungstenGray,
				glassOverlay: colors.glassOverlay,
			},
			fontFamily: {
				display: typography.headingDisplay.fontFamily,
				sans: typography.headingSans.fontFamily,
				body: typography.body.fontFamily,
				mono: typography.mono.fontFamily,
			},
			borderRadius: {
				xl: `${spacing.radiusSoft}px`,
				lg: `${spacing.radiusButton}px`,
			},
			boxShadow: {
				glass:
					"inset 0 1px 0 rgba(255,255,255,0.08), 0 28px 60px rgba(3,8,15,0.45)",
			},
			backdropBlur: {
				glass: `${spacing.glassBlur}px`,
			},
		},
	},
};

export default tailwindPreset;
