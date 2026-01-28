import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 200 }: LogoProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Image
        source={require('@/designs/logo.png')}
        style={[styles.image, { width: size, height: size }]}
        contentFit="contain"
        transition={300}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    // Image will blend with the background
  },
});
