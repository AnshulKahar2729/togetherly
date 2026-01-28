import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';

// Dummy data - will be replaced with actual state management
const COUPLE_DATA = {
  isConnected: true, // Set to true when two people are in the space
  user1: { name: 'Anshul', avatar: null },
  user2: { name: 'Riya', avatar: null },
};

const GOALS: Array<{ id: string; title: string }> = []; // Empty for now

export default function HomeScreen() {
  const { colors, spacing, borderRadius } = useTheme();

  const handleAddGoal = () => {
    // TODO: Navigate to add goal screen
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
            {/* Couple Avatar */}
            <View style={styles.coupleAvatarContainer}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: colors.surface, borderColor: colors.background },
                ]}
              >
                <ThemedText style={styles.avatarEmoji}>👩</ThemedText>
              </View>
              <View
                style={[
                  styles.avatarCircle,
                  styles.avatarOverlap,
                  { backgroundColor: colors.surface, borderColor: colors.background },
                ]}
              >
                <ThemedText style={styles.avatarEmoji}>👨</ThemedText>
              </View>
            </View>

            {/* Couple Names */}
            <ThemedText style={[styles.coupleNames, { fontFamily: Fonts.semibold }]}>
              {COUPLE_DATA.user1.name} & {COUPLE_DATA.user2.name}
            </ThemedText>

            {/* Location Pin */}
            <View
              style={[
                styles.locationPin,
                { backgroundColor: colors.primary + '15' },
              ]}
            >
              <ThemedText style={[styles.locationIcon, { color: colors.primary }]}>
                📍
              </ThemedText>
            </View>
          </View>

          {/* Section Title */}
          <ThemedText
            style={[
              styles.sectionTitle,
              { marginTop: spacing.xl, paddingHorizontal: spacing.lg, fontFamily: Fonts.medium },
            ]}
          >
            Things you planned together
          </ThemedText>

          {/* Goals List or Empty State */}
          {GOALS.length === 0 ? (
            <View style={[styles.emptyStateContainer, { marginTop: spacing.lg }]}>
              {/* Illustration Card */}
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

                {/* Prompt Text */}
                <View style={styles.promptContainer}>
                  <ThemedText
                    style={[
                      styles.promptText,
                      { fontFamily: Fonts.semibold },
                    ]}
                  >
                    What's the first thing
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.promptText,
                      { fontFamily: Fonts.semibold },
                    ]}
                  >
                    you want to do together?
                  </ThemedText>
                </View>
              </View>

              {/* Add Goal Button */}
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
                <ThemedText style={[styles.addGoalIcon, { color: colors.primaryText }]}>
                  +
                </ThemedText>
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
            // TODO: Render goals list
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
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarEmoji: {
    fontSize: 20,
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
  locationIcon: {
    fontSize: 16,
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
  addGoalIcon: {
    fontSize: 20,
    fontWeight: '500',
  },
  addGoalText: {
    fontSize: 17,
  },
});
