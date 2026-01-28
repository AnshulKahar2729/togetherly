
/**
 * useTheme - Comprehensive theme hook for Togetherly
 *
 * Provides access to all theme values including colors, spacing,
 * typography, and more based on the current color scheme.
 */

import { useMemo } from 'react';
import {
  Colors,
  Fonts,
  palette,
  gradients,
  fontWeights,
  spacing,
  borderRadius,
  animation,
  iconStyle,
  type ThemeColors,
  type ThemeColorKey,
  type ColorScheme,
} from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface UseThemeReturn {
  // Current color scheme
  colorScheme: ColorScheme;
  isDark: boolean;

  // Colors for current scheme
  colors: ThemeColors;

  // Raw palette (scheme-independent)
  palette: typeof palette;

  // Gradients
  gradients: typeof gradients;

  // Typography
  fonts: typeof Fonts;
  fontWeights: typeof fontWeights;

  // Layout
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;

  // Animation
  animation: typeof animation;

  // Icons
  iconStyle: typeof iconStyle;
}

/**
 * Main theme hook - use this throughout the app
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, spacing, borderRadius } = useTheme();
 *
 *   return (
 *     <View style={{
 *       backgroundColor: colors.background,
 *       padding: spacing.md,
 *       borderRadius: borderRadius.md,
 *     }}>
 *       <Text style={{ color: colors.text }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const systemColorScheme = useColorScheme();
  const colorScheme: ColorScheme = systemColorScheme ?? 'light';

  return useMemo(
    () => ({
      colorScheme,
      isDark: colorScheme === 'dark',
      colors: Colors[colorScheme],
      palette,
      gradients,
      fonts: Fonts,
      fontWeights,
      spacing,
      borderRadius,
      animation,
      iconStyle,
    }),
    [colorScheme]
  );
}

/**
 * Get a specific color from the theme
 *
 * @example
 * ```tsx
 * const backgroundColor = useThemeColor('background');
 * const textColor = useThemeColor('text');
 * ```
 */
export function useThemeColor(colorName: ThemeColorKey): string {
  const { colors } = useTheme();
  return colors[colorName];
}

/**
 * Get multiple colors at once
 *
 * @example
 * ```tsx
 * const { background, text, primary } = useThemeColors('background', 'text', 'primary');
 * ```
 */
export function useThemeColors<T extends ThemeColorKey[]>(
  ...colorNames: T
): { [K in T[number]]: string } {
  const { colors } = useTheme();

  return useMemo(() => {
    const result = {} as { [K in T[number]]: string };
    for (const name of colorNames) {
      result[name as T[number]] = colors[name];
    }
    return result;
  }, [colors, colorNames.join(',')]);
}

export default useTheme;
