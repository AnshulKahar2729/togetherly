import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { saveLocalCoupleSpace } from '@/lib/storage/couple-space';
import { createSpace, getSpace, subscribeToPartnerJoined } from '@/lib/api/spaces';
import { getUser } from '@/lib/api/users';
import { loadUserProfile, saveUserProfile } from '@/lib/storage/user-profile';

export default function InvitePartnerScreen() {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyIconScale = useSharedValue(1);
  const copyIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: copyIconScale.value }],
  }));

  const inviteLink = `togetherly.app/${inviteCode}`;

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    (async () => {
      try {
        const profile = loadUserProfile();
        if (!profile) throw new Error('Missing local user profile');
        let currentSpaceId = profile.spaceId;
        if (currentSpaceId) {
          const existingSpace = await getSpace(currentSpaceId).catch(() => null);
          if (!existingSpace) {
            currentSpaceId = null;
          } else if (!cancelled) {
            setInviteCode(existingSpace.inviteCode);
            saveLocalCoupleSpace({ inviteCode: existingSpace.inviteCode, role: 'owner' });
          }
        }
        if (!currentSpaceId) {
          const newSpace = await createSpace(profile.id);
          currentSpaceId = newSpace.id;
          if (!cancelled) {
            setInviteCode(newSpace.inviteCode);
            saveLocalCoupleSpace({ inviteCode: newSpace.inviteCode, role: 'owner' });
          }
        }
        if (!cancelled && currentSpaceId) {
          saveUserProfile({ ...profile, spaceId: currentSpaceId });
          unsubscribe = subscribeToPartnerJoined(currentSpaceId, async () => {
            const updatedUser = await getUser(profile.id);
            saveUserProfile({ ...profile, spaceId: updatedUser.spaceId });
            router.replace('/(tabs)');
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [router]);

  const handleBack = () => {
    router.back();
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(inviteCode);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    copyIconScale.value = withSequence(
      withSpring(1.22, { damping: 9, stiffness: 420 }),
      withSpring(1, { damping: 14, stiffness: 320 })
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!inviteCode) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(`https://${inviteLink}`);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Link copied to clipboard');
  };

  const handleSendInvite = async () => {
    if (!inviteCode) return;
    try {
      await Haptics.selectionAsync();
      await Share.share({
        message: `Join me on Togetherly! Use code ${inviteCode} or visit https://${inviteLink}`,
        url: `https://${inviteLink}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /** Main app lives in (tabs); invite is optional — users were stuck here with no CTA. */
  const handleContinueToApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (inviteCode) {
      saveLocalCoupleSpace({ inviteCode, role: 'owner' });
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
            <View style={styles.headerTitleContainer}>
              <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                Create your
              </ThemedText>
              <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                <ThemedText style={[styles.headerTitle, { color: colors.primary, fontFamily: Fonts.semibold }]}>
                  couple
                </ThemedText>{' '}
                space
              </ThemedText>
            </View>
          </View>

          <View style={[styles.illustrationContainer, { marginTop: spacing.xl }]}>
            <Image
              source={require('@/designs/avatar-sample.png')}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>

          <View
            style={[
              styles.inviteCard,
              {
                backgroundColor: colors.surface,
                borderRadius: borderRadius.xl,
                marginTop: spacing.lg,
              },
            ]}
          >
            <ThemedText style={[styles.inviteTitle, { fontFamily: Fonts.semibold }]}>
              Invite your person
            </ThemedText>
            <ThemedText
              style={[
                styles.inviteDescription,
                { color: colors.textSecondary, fontFamily: Fonts.regular },
              ]}
            >
              Share this <ThemedText style={{ color: colors.primary, fontFamily: Fonts.medium }}>code</ThemedText> or{' '}
              <ThemedText style={{ color: colors.primary, fontFamily: Fonts.medium }}>link</ThemedText> to invite your partner.
            </ThemedText>

            <View
              style={[
                styles.codeBox,
                {
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.lg,
                  marginTop: spacing.lg,
                },
              ]}
            >
              <View style={styles.codeIconContainer}>
                <Ionicons name="ticket-outline" size={22} color={colors.textSecondary} />
              </View>
              <View style={styles.codeTextWrap}>
                <ThemedText style={[styles.codeText, { fontFamily: Fonts.bold }]}>
                  {inviteCode}
                </ThemedText>
              </View>
              <Pressable
                onPress={handleCopyCode}
                accessibilityLabel={copied ? 'Code copied' : 'Copy invite code'}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.copyButton,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.md,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Animated.View style={[styles.copyIconWrap, copyIconAnimatedStyle]}>
                  <Ionicons
                    name={copied ? 'checkmark-circle' : 'copy-outline'}
                    size={24}
                    color={copied ? colors.primary : colors.textSecondary}
                  />
                </Animated.View>
              </Pressable>
            </View>

            <Pressable onPress={handleCopyLink} accessibilityRole="button" accessibilityLabel="Copy invite link">
              <ThemedText
                style={[
                  styles.linkText,
                  { color: colors.textSecondary, marginTop: spacing.md, fontFamily: Fonts.regular },
                ]}
              >
                {inviteLink}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.spacer} />

          <View style={[styles.buttonColumn, { marginBottom: spacing.xl, gap: spacing.md }]}>
            <Pressable
              onPress={handleContinueToApp}
              disabled={loading || !inviteCode}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: loading || !inviteCode ? colors.border : colors.primary,
                  borderRadius: borderRadius.full,
                  opacity: pressed && !loading && inviteCode ? 0.9 : 1,
                  transform: [{ scale: pressed && !loading && inviteCode ? 0.98 : 1 }],
                },
              ]}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={loading || !inviteCode ? colors.textMuted : colors.primaryText}
              />
              <ThemedText
                style={[
                  styles.buttonText,
                  {
                    color: loading || !inviteCode ? colors.textMuted : colors.primaryText,
                    fontFamily: Fonts.semibold,
                  },
                ]}
              >
                {loading ? 'Creating space...' : 'Continue to app'}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSendInvite}
              style={({ pressed }) => [
                styles.button,
                styles.buttonSecondary,
                {
                  borderRadius: borderRadius.full,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Ionicons name="paper-plane-outline" size={20} color={colors.primary} />
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: colors.primary, fontFamily: Fonts.semibold },
                ]}
              >
                Send invite
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
    alignItems: 'flex-start',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 36,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  illustration: {
    width: 220,
    height: 180,
  },
  inviteCard: {
    padding: 24,
    alignItems: 'center',
  },
  inviteTitle: {
    fontSize: 20,
  },
  inviteDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  codeIconContainer: {
    marginRight: 12,
    flexShrink: 0,
  },
  codeTextWrap: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 3,
  },
  copyButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: 14,
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  buttonColumn: {
    paddingHorizontal: 8,
  },
  button: {
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
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 17,
  },
});
