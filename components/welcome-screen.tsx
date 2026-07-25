import { View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Logo } from './logo';
import { ThemedText } from './themed-text';
import { CloudDecoration } from './cloud-decoration';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  /** When false, the primary CTA is disabled (e.g. session restore in progress). */
  getStartedEnabled?: boolean;
  getStartedLabel?: string;
}

export function WelcomeScreen({
  onGetStarted,
  getStartedEnabled = true,
  getStartedLabel = 'Get Started',
}: WelcomeScreenProps) {
  const { colors, spacing, borderRadius } = useTheme();
  const insets = useSafeAreaInsets();

  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(10);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(30);

  useEffect(() => {
    // Animate logo in
    contentOpacity.value = withTiming(1, { duration: 500 });
    contentScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });

    // Animate tagline in after logo
    taglineOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    taglineTranslateY.value = withDelay(200, withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }));

    // Animate button in after tagline
    buttonOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    buttonTranslateY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <Animated.View style={contentAnimatedStyle}>
            <Logo size={220} />
          </Animated.View>

          <Animated.View style={[styles.taglineContainer, { marginTop: spacing.md }, taglineAnimatedStyle]}>
            <ThemedText style={[styles.tagline, { color: colors.textSecondary }]}>
              Plan it together.
            </ThemedText>
            <ThemedText style={[styles.tagline, { color: colors.textSecondary }]}>
              Finish it together.
            </ThemedText>
          </Animated.View>
        </View>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.buttonContainer,
          { bottom: Math.max(insets.bottom, 20) + 100 },
          buttonAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={onGetStarted}
          disabled={!getStartedEnabled}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: getStartedEnabled ? colors.primary : colors.border,
              borderRadius: borderRadius.full,
              opacity: pressed && getStartedEnabled ? 0.9 : 1,
              transform: [{ scale: pressed && getStartedEnabled ? 0.98 : 1 }],
            },
          ]}
        >
          <ThemedText
            style={[
              styles.buttonText,
              { color: getStartedEnabled ? colors.primaryText : colors.textMuted },
            ]}
          >
            {getStartedLabel}
          </ThemedText>
        </Pressable>
      </Animated.View>

      <CloudDecoration />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    lineHeight: 28,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
