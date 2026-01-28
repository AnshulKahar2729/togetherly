/**
 * useThemeColor - Get a single color from the theme
 *
 * For full theme access, use useTheme from '@/hooks/use-theme' instead.
 */

import { Colors, type ThemeColorKey } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Get a theme color with optional overrides for light/dark mode
 *
 * @param props - Optional overrides for light and dark mode
 * @param colorName - The semantic color name from the theme
 * @returns The resolved color string
 *
 * @example
 * ```tsx
 * // Use theme default
 * const bgColor = useThemeColor({}, 'background');
 *
 * // With overrides
 * const customBg = useThemeColor(
 *   { light: '#FFF', dark: '#000' },
 *   'background'
 * );
 * ```
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorKey
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
