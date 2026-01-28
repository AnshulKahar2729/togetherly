import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

// Generate a random invite code
const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function InvitePartnerScreen() {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();
  const [inviteCode] = useState(generateInviteCode);
  const [copied, setCopied] = useState(false);

  const inviteLink = `togetherly.app/${inviteCode}`;

  const handleBack = () => {
    router.back();
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(inviteCode);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://${inviteLink}`);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied!', 'Link copied to clipboard');
  };

  const handleSendInvite = async () => {
    try {
      await Share.share({
        message: `Join me on Togetherly! Use code ${inviteCode} or visit https://${inviteLink}`,
        url: `https://${inviteLink}`,
      });
    } catch (error) {
      console.error(error);
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

          {/* Couple Illustration */}
          <View style={[styles.illustrationContainer, { marginTop: spacing.xl }]}>
            <Image
              source={require('@/designs/avatar-sample.png')}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>

          {/* Invite Card */}
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

            {/* Code Box */}
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
                <ThemedText style={[styles.codeIcon, { color: colors.textSecondary }]}>
                  ✏️
                </ThemedText>
              </View>
              <ThemedText style={[styles.codeText, { fontFamily: Fonts.bold }]}>
                {inviteCode}
              </ThemedText>
              <Pressable
                onPress={handleCopyCode}
                style={({ pressed }) => [
                  styles.copyButton,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.md,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <ThemedText style={[styles.copyIcon, { color: colors.textSecondary }]}>
                  {copied ? '✓' : '📋'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Link */}
            <Pressable onPress={handleCopyLink}>
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

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Send Invite Button */}
          <View style={[styles.buttonContainer, { marginBottom: spacing.xl }]}>
            <Pressable
              onPress={handleSendInvite}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.full,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText style={[styles.buttonIcon]}>💌</ThemedText>
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: colors.primaryText, fontFamily: Fonts.semibold },
                ]}
              >
                Send Invite
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
  },
  codeIcon: {
    fontSize: 18,
  },
  codeText: {
    fontSize: 24,
    letterSpacing: 4,
    flex: 1,
  },
  copyButton: {
    padding: 10,
  },
  copyIcon: {
    fontSize: 18,
  },
  linkText: {
    fontSize: 14,
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  buttonContainer: {
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
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 17,
  },
});
