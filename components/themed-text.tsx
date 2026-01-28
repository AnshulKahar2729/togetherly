import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'muted';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { colors, isDark, fonts } = useTheme();

  // Use override color if provided, otherwise use theme color
  const textColor = isDark ? darkColor : lightColor;
  const color = textColor ?? (type === 'muted' ? colors.textMuted : colors.text);
  const linkColor = colors.primary;

  // Select appropriate font weight
  const getFontFamily = () => {
    switch (type) {
      case 'title':
      case 'subtitle':
      case 'defaultSemiBold':
        return fonts.semibold;
      case 'link':
      case 'default':
      case 'muted':
      default:
        return fonts.regular;
    }
  };

  return (
    <Text
      style={[
        { color, fontFamily: getFontFamily() },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? [styles.link, { color: linkColor }] : undefined,
        type === 'muted' ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
  },
});
