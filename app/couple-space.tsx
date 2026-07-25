import { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

type SpaceOption = 'create' | 'join';

export default function CoupleSpaceScreen() {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();
  const [selected, setSelected] = useState<SpaceOption | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (selected === 'create') {
      router.push('/create-avatar?flow=create');
    } else if (selected === 'join') {
      router.push('/create-avatar?flow=join');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { marginTop: spacing.sm }]}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              hitSlop={16}
            >
              <ThemedText style={[styles.backArrow, { color: colors.textSecondary }]}>
                {'‹'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Title */}
          <View style={[styles.titleContainer, { marginTop: spacing.lg }]}>
            <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>
              Create your
            </ThemedText>
            <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>
              <ThemedText style={[styles.title, { color: colors.primary, fontFamily: Fonts.bold }]}>
                couple
              </ThemedText>{' '}
              space
            </ThemedText>
          </View>

          {/* Subtitle */}
          <ThemedText
            style={[
              styles.subtitle,
              { color: colors.textSecondary, marginTop: spacing.md, fontFamily: Fonts.regular },
            ]}
          >
            {`Start your journey together by creating a new space or joining your partner's space.`}
          </ThemedText>

          {/* Options */}
          <View style={[styles.optionsContainer, { marginTop: spacing.xxl }]}>
            {/* Create Space Option */}
            <Pressable
              onPress={() => setSelected('create')}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  borderColor: selected === 'create' ? colors.primary : 'transparent',
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="sparkles" size={28} color={colors.primary} />
              </View>
              <ThemedText style={[styles.optionTitle, { fontFamily: Fonts.semibold }]}>
                Create a space
              </ThemedText>
              <ThemedText
                style={[
                  styles.optionDescription,
                  { color: colors.textSecondary, fontFamily: Fonts.regular },
                ]}
              >
                Start fresh and invite your partner to join
              </ThemedText>
            </Pressable>

            {/* Join Space Option */}
            <Pressable
              onPress={() => setSelected('join')}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.xl,
                  borderWidth: 2,
                  borderColor: selected === 'join' ? colors.primary : 'transparent',
                  opacity: pressed ? 0.9 : 1,
                  marginTop: spacing.md,
                },
              ]}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="heart" size={28} color={colors.accent} />
              </View>
              <ThemedText style={[styles.optionTitle, { fontFamily: Fonts.semibold }]}>
                Join a space
              </ThemedText>
              <ThemedText
                style={[
                  styles.optionDescription,
                  { color: colors.textSecondary, fontFamily: Fonts.regular },
                ]}
              >
                Enter a code from your partner to join
              </ThemedText>
            </Pressable>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Continue Button */}
          <View style={[styles.buttonContainer, { marginBottom: spacing.xl }]}>
            <Pressable
              onPress={handleContinue}
              disabled={!selected}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: selected ? colors.primary : colors.border,
                  borderRadius: borderRadius.full,
                  opacity: pressed && selected ? 0.9 : 1,
                  transform: [{ scale: pressed && selected ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  {
                    color: selected ? colors.primaryText : colors.textMuted,
                    fontFamily: Fonts.semibold,
                  },
                ]}
              >
                Continue
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 28,
  },
  titleContainer: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  optionsContainer: {
    paddingHorizontal: 8,
  },
  optionCard: {
    padding: 20,
    alignItems: 'center',
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  buttonContainer: {
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
  },
});
