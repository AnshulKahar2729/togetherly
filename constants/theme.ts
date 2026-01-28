/**
 * Togetherly Theme Configuration
 * Based on the brand design system (v1)
 *
 * Brand personality: Warm, Gentle, Intimate, Playful (but not childish), Calm
 * Rule: Never pure white, never pure black - keeps everything soft
 */


// Primary Colors
export const palette = {
  // Primary
  peach: '#FF8A7A',
  softOrange: '#FFB36B',
  lavender: '#B79CFF',

  // Backgrounds
  warmWhite: '#FFF6F2',
  softCream: '#FFF1EA',

  // Text
  primaryText: '#3D3A3A',
  secondaryText: '#8A7F7A',

  // Dark mode variants (softer alternatives)
  darkBackground: '#1A1918',
  darkSurface: '#252322',
  darkText: '#F5F0ED',
  darkSecondaryText: '#A89F9A',
} as const;

// Gradient definitions for components that support them
export const gradients = {
  primary: [palette.peach, palette.softOrange] as const,
  accent: [palette.lavender, palette.peach] as const,
  warm: [palette.softCream, palette.warmWhite] as const,
} as const;

export const Colors = {
  light: {
    // Backgrounds
    background: palette.warmWhite,
    surface: palette.softCream,
    card: '#FFFFFF',

    // Text
    text: palette.primaryText,
    textSecondary: palette.secondaryText,
    textMuted: '#B5AAA5',

    // Primary actions
    primary: palette.peach,
    primaryText: '#FFFFFF',

    // Secondary actions
    secondary: palette.softOrange,
    secondaryText: '#FFFFFF',

    // Accent
    accent: palette.lavender,
    accentText: '#FFFFFF',

    // UI Elements
    tint: palette.peach,
    icon: palette.secondaryText,
    iconActive: palette.peach,
    border: '#F0E6E0',
    borderFocused: palette.peach,

    // Tab bar
    tabIconDefault: palette.secondaryText,
    tabIconSelected: palette.peach,
    tabBackground: palette.warmWhite,

    // Status colors (softened)
    success: '#7AC79F',
    warning: '#FFBB70',
    error: '#FF8A7A',
  },
  dark: {
    // Backgrounds
    background: palette.darkBackground,
    surface: palette.darkSurface,
    card: '#2D2A28',

    // Text
    text: palette.darkText,
    textSecondary: palette.darkSecondaryText,
    textMuted: '#6D6460',

    // Primary actions
    primary: palette.peach,
    primaryText: palette.darkBackground,

    // Secondary actions
    secondary: palette.softOrange,
    secondaryText: palette.darkBackground,

    // Accent
    accent: palette.lavender,
    accentText: palette.darkBackground,

    // UI Elements
    tint: palette.peach,
    icon: palette.darkSecondaryText,
    iconActive: palette.peach,
    border: '#3D3835',
    borderFocused: palette.peach,

    // Tab bar
    tabIconDefault: palette.darkSecondaryText,
    tabIconSelected: palette.peach,
    tabBackground: palette.darkBackground,

    // Status colors (softened)
    success: '#7AC79F',
    warning: '#FFBB70',
    error: '#FF8A7A',
  },
} as const;

// Typography - Nunito for warm, friendly feel
export const Fonts = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
} as const;

// Font weights - Titles slightly bold, body regular
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Border radius - soft, rounded corners throughout
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

// Animation timings - slow in, soft out as per design
export const animation = {
  fast: 150,
  normal: 250,
  slow: 400,
  // Easing curves for "soft out, slight overshoot"
  easing: {
    default: 'ease-out',
    overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// Icon style - 2px stroke, rounded as per design
export const iconStyle = {
  strokeWidth: 2,
  size: {
    sm: 16,
    md: 24,
    lg: 32,
  },
} as const;

// Export complete theme object
export const theme = {
  colors: Colors,
  palette,
  gradients,
  fonts: Fonts,
  fontWeights,
  spacing,
  borderRadius,
  animation,
  iconStyle,
} as const;

export type Theme = typeof theme;
export type ColorScheme = 'light' | 'dark';

// Use a mapped type to get string keys while allowing different values
export type ThemeColorKey = keyof typeof Colors.light;
export type ThemeColors = {
  [K in ThemeColorKey]: string;
};
