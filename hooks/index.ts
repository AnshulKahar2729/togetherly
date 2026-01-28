/**
 * Hooks barrel export
 */

export { useTheme, useThemeColor, useThemeColors } from './use-theme';
export { useColorScheme } from './use-color-scheme';

// Re-export the legacy hook for backward compatibility
export { useThemeColor as useLegacyThemeColor } from './use-theme-color';
