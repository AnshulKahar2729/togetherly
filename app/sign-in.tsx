import { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { requestOtp, verifyOtp } from '@/lib/api/auth';
import { saveAuthTokens } from '@/lib/storage/auth-session';
import { saveUserProfile, userProfileFromResponse } from '@/lib/storage/user-profile';

type Step = 'email' | 'code';

export default function SignInScreen() {
  const router = useRouter();
  const { colors, borderRadius, spacing } = useTheme();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const handleBack = useCallback(() => {
    if (step === 'code') {
      setStep('email');
      setCode('');
      return;
    }
    router.back();
  }, [router, step]);

  const handleSendCode = useCallback(async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      await requestOtp(trimmed);
      setEmail(trimmed);
      setStep('code');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not send code';
      Alert.alert('Something went wrong', message);
    } finally {
      setBusy(false);
    }
  }, [email, busy]);

  const handleVerify = useCallback(async () => {
    const digits = code.replace(/\D/g, '').slice(0, 6);
    if (digits.length !== 6 || busy) return;
    setBusy(true);
    try {
      const result = await verifyOtp(email, digits);
      await saveAuthTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      saveUserProfile(userProfileFromResponse(result.user));
      router.replace('/couple-space' as Href);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid code';
      Alert.alert('Could not sign in', message);
    } finally {
      setBusy(false);
    }
  }, [email, code, busy, router]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, { marginTop: spacing.sm }]}>
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
                hitSlop={16}
              >
                <ThemedText style={[styles.backArrow, { color: colors.textSecondary }]}>
                  {'‹'}
                </ThemedText>
              </Pressable>
            </View>

            <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>
              {step === 'email' ? 'Sign in with email' : 'Enter the code'}
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { color: colors.textSecondary, fontFamily: Fonts.regular, marginTop: spacing.sm },
              ]}
            >
              {step === 'email'
                ? 'We will email you a one-time code. No password to remember.'
                : `We sent a 6-digit code to ${email}`}
            </ThemedText>

            {step === 'email' ? (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.lg,
                    color: colors.text,
                    borderColor: colors.border,
                    fontFamily: Fonts.regular,
                    marginTop: spacing.lg,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                editable={!busy}
              />
            ) : (
              <TextInput
                style={[
                  styles.input,
                  styles.codeInput,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.lg,
                    color: colors.text,
                    borderColor: colors.border,
                    fontFamily: Fonts.bold,
                    marginTop: spacing.lg,
                  },
                ]}
                placeholder="000000"
                placeholderTextColor={colors.textMuted}
                value={code}
                onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={6}
                editable={!busy}
              />
            )}

            {step === 'code' && __DEV__ ? (
              <ThemedText
                style={[
                  styles.devHint,
                  { color: colors.textMuted, fontFamily: Fonts.regular, marginTop: spacing.md },
                ]}
              >
                Development: the OTP is printed in your backend terminal.
              </ThemedText>
            ) : null}

            <Pressable
              onPress={step === 'email' ? handleSendCode : handleVerify}
              disabled={
                busy || (step === 'email' ? !emailValid : code.replace(/\D/g, '').length !== 6)
              }
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor:
                    busy || (step === 'email' ? !emailValid : code.replace(/\D/g, '').length !== 6)
                      ? colors.border
                      : colors.primary,
                  borderRadius: borderRadius.full,
                  marginTop: spacing.xl,
                  opacity: pressed && !busy ? 0.9 : 1,
                },
              ]}
            >
              {busy ? (
                <ActivityIndicator color={colors.primaryText} />
              ) : (
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color:
                        step === 'email'
                          ? emailValid
                            ? colors.primaryText
                            : colors.textMuted
                          : code.replace(/\D/g, '').length === 6
                            ? colors.primaryText
                            : colors.textMuted,
                      fontFamily: Fonts.semibold,
                    },
                  ]}
                >
                  {step === 'email' ? 'Send code' : 'Continue'}
                </ThemedText>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center' },
  backButton: { paddingVertical: 4, paddingHorizontal: 8 },
  backArrow: { fontSize: 28, lineHeight: 28 },
  title: { fontSize: 26, lineHeight: 34, marginTop: 8 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  input: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  codeInput: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonText: { fontSize: 17 },
  devHint: { fontSize: 13, lineHeight: 18 },
});
