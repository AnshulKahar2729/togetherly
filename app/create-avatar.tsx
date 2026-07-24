import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LoreleiAvatarEditor } from '@/components/lorelei-avatar-editor';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import {
  createRandomSeed,
  DEFAULT_LORELEI_AVATAR_CONFIG,
  type LoreleiAvatarConfig,
} from '@/lib/lorelei-avatar';
import { loadUserProfile } from '@/lib/storage/user-profile';
import { useUpdateProfileMutation } from '@/hooks/api/user/use-update-profile-mutation';

export default function CreateAvatarScreen() {
  const router = useRouter();
  const { flow: flowParam } = useLocalSearchParams<{ flow?: string | string[] }>();
  const flow = (Array.isArray(flowParam) ? flowParam[0] : flowParam) ?? 'create';

  const { colors, borderRadius } = useTheme();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<LoreleiAvatarConfig>(DEFAULT_LORELEI_AVATAR_CONFIG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const profile = loadUserProfile();
    if (profile) {
      setName(profile.name);
      setAvatar((current) => ({ ...current, seed: profile.avatarSeed, gender: profile.gender }));
    } else {
      setAvatar((a) => ({ ...a, seed: createRandomSeed() }));
    }
    setHydrated(true);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || isPending) return;
    await updateProfile({ name: trimmed, avatar });
    if (flow === 'join') {
      router.push('/join-space');
    } else {
      router.push('/invite-partner');
    }
  }, [name, avatar, flow, isPending, updateProfile, router]);

  const isValid = name.trim().length > 0;

  if (!hydrated) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Pressable
                onPress={handleBack}
                style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.6 : 1 }]}
                hitSlop={16}
              >
                <ThemedText style={[styles.backArrow, { color: colors.textSecondary }]}>
                  {'‹'}
                </ThemedText>
              </Pressable>
              <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                Create a{' '}
                <ThemedText
                  style={[styles.headerTitle, { color: colors.primary, fontFamily: Fonts.semibold }]}
                >
                  cute avatar
                </ThemedText>
              </ThemedText>
            </View>

            <LoreleiAvatarEditor
              compact
              value={avatar}
              onChange={setAvatar}
              showCouplePreview={flow === 'join'}
            />

            <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>
              Your name
            </ThemedText>

            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.lg,
                    color: colors.text,
                    borderColor: colors.border,
                    fontFamily: Fonts.regular,
                  },
                ]}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleContinue}
                disabled={!isValid || isPending}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: isValid && !isPending ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                    opacity: pressed && isValid && !isPending ? 0.9 : 1,
                    transform: [{ scale: pressed && isValid && !isPending ? 0.98 : 1 }],
                  },
                ]}
              >
                {isPending ? (
                  <ActivityIndicator color={colors.primaryText} />
                ) : (
                  <ThemedText
                    style={[
                      styles.buttonText,
                      {
                        color: isValid ? colors.primaryText : colors.textMuted,
                        fontFamily: Fonts.semibold,
                      },
                    ]}
                  >
                    Continue
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  backButton: { marginRight: 4, paddingVertical: 4, paddingHorizontal: 8 },
  backArrow: { fontSize: 28, lineHeight: 28 },
  headerTitle: { fontSize: 16 },
  title: { fontSize: 16, textAlign: 'center', marginTop: 8, marginBottom: 8 },
  inputContainer: { paddingHorizontal: 4 },
  input: { height: 50, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
  buttonContainer: { paddingHorizontal: 8, marginTop: 22, marginBottom: 8 },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#FF8A7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: { fontSize: 17 },
});
