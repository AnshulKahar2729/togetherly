import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';

type PartnerRequiredScreenProps = {
  /** When true, parent is still fetching — show spinner only. */
  loading?: boolean;
};

export function PartnerRequiredScreen({ loading }: PartnerRequiredScreenProps) {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: borderRadius.xl }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '18' }]}>
          <Ionicons name="people-outline" size={40} color={colors.primary} />
        </View>
        <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>
          Waiting for your partner
        </ThemedText>
        <ThemedText
          style={[
            styles.body,
            { color: colors.textSecondary, fontFamily: Fonts.regular, marginTop: spacing.sm },
          ]}
        >
          Togetherly is for two. Share your invite code so they can join — then you can plan goals,
          map, and memories together.
        </ThemedText>
        <Pressable
          onPress={() => router.push('/invite-partner')}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
              marginTop: spacing.xl,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="mail-outline" size={20} color={colors.primaryText} />
          <ThemedText style={[styles.buttonLabel, { color: colors.primaryText, fontFamily: Fonts.semibold }]}>
            Invite partner
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
  },
  buttonLabel: {
    fontSize: 17,
  },
});
