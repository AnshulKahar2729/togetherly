import { View, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { LoreleiAvatar } from '@/components/lorelei-avatar';
import { PartnerRequiredScreen } from '@/components/partner-required-screen';
import { ThemedText } from '@/components/themed-text';
import { useCoupleSummaryQuery } from '@/hooks/api/couple/use-couple-summary-query';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';
import { DEFAULT_LORELEI_AVATAR_CONFIG } from '@/lib/lorelei-avatar';

const GOALS: { id: string; title: string }[] = [];

export default function HomeScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const { data: summary, isLoading, error } = useCoupleSummaryQuery();

  const handleAddGoal = () => {
    // TODO: Navigate to add goal screen
  };

  if (isLoading && !summary) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !summary) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ThemedText style={{ fontFamily: Fonts.regular, color: colors.textSecondary }}>
          Something went wrong loading your space.
        </ThemedText>
      </View>
    );
  }

  if (!summary.hasPartner || summary.partner == null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <PartnerRequiredScreen loading={false} />
      </View>
    );
  }

  const partnerAvatar =
    summary.partner.avatar ?? { ...DEFAULT_LORELEI_AVATAR_CONFIG, seed: 'partner' };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
            <View style={styles.coupleAvatarContainer}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: colors.surface, borderColor: colors.background },
                ]}
              >
                <LoreleiAvatar config={summary.self.avatar} size={40} />
              </View>
              <View
                style={[
                  styles.avatarCircle,
                  styles.avatarOverlap,
                  { backgroundColor: colors.surface, borderColor: colors.background },
                ]}
              >
                <LoreleiAvatar config={partnerAvatar} size={40} />
              </View>
            </View>

            <ThemedText style={[styles.coupleNames, { fontFamily: Fonts.semibold }]} numberOfLines={2}>
              {summary.self.displayName} & {summary.partner.displayName}
            </ThemedText>

            <View
              style={[
                styles.locationPin,
                { backgroundColor: colors.primary + '15' },
              ]}
            >
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
          </View>

          <ThemedText
            style={[
              styles.sectionTitle,
              { marginTop: spacing.xl, paddingHorizontal: spacing.lg, fontFamily: Fonts.medium },
            ]}
          >
            Things you planned together
          </ThemedText>

          {GOALS.length === 0 ? (
            <View style={[styles.emptyStateContainer, { marginTop: spacing.lg }]}>
              <View
                style={[
                  styles.illustrationCard,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.xl,
                    marginHorizontal: spacing.lg,
                  },
                ]}
              >
                <Image
                  source={require('@/designs/avatar-sample.png')}
                  style={styles.illustration}
                  contentFit="contain"
                />

                <View style={styles.promptContainer}>
                  <ThemedText style={[styles.promptText, { fontFamily: Fonts.semibold }]}>
                    What&apos;s the first thing
                  </ThemedText>
                  <ThemedText style={[styles.promptText, { fontFamily: Fonts.semibold }]}>
                    you want to do together?
                  </ThemedText>
                </View>
              </View>

              <Pressable
                onPress={handleAddGoal}
                style={({ pressed }) => [
                  styles.addGoalButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.full,
                    marginHorizontal: spacing.lg,
                    marginTop: spacing.lg,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Ionicons name="add-circle-outline" size={22} color={colors.primaryText} />
                <ThemedText
                  style={[
                    styles.addGoalText,
                    { color: colors.primaryText, fontFamily: Fonts.semibold },
                  ]}
                >
                  Add Goal
                </ThemedText>
              </Pressable>
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  coupleAvatarContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  coupleNames: {
    flex: 1,
    fontSize: 20,
  },
  locationPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  emptyStateContainer: {
    flex: 1,
  },
  illustrationCard: {
    padding: 24,
    alignItems: 'center',
  },
  illustration: {
    width: 280,
    height: 220,
  },
  promptContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  promptText: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  addGoalButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF8A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  addGoalText: {
    fontSize: 17,
  },
});
