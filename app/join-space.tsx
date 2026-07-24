import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useJoinSpaceMutation } from '@/hooks/api/couple/use-join-space-mutation';

const CODE_LENGTH = 6;

export default function JoinSpaceScreen() {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { mutateAsync: joinSpace, isPending } = useJoinSpaceMutation();

  const handleBack = () => {
    router.back();
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];

    if (text.length > 1) {
      const pastedCode = text.toUpperCase().slice(0, CODE_LENGTH).split('');
      for (let i = 0; i < CODE_LENGTH; i++) {
        newCode[i] = pastedCode[i] || '';
      }
      setCode(newCode);
      inputRefs.current[CODE_LENGTH - 1]?.focus();
      return;
    }

    newCode[index] = text.toUpperCase();
    setCode(newCode);
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleJoinSpace = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== CODE_LENGTH || isPending) return;
    try {
      await joinSpace(fullCode);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const message = error instanceof Error ? error.message : 'Unable to join space';
      Alert.alert('Could not join space', message);
    }
  };

  const isCodeComplete = code.every((char) => char !== '');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              <View style={styles.headerTitleContainer}>
                <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                  Join your
                </ThemedText>
                <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                  <ThemedText
                    style={[styles.headerTitle, { color: colors.accent, fontFamily: Fonts.semibold }]}
                  >
                    {`partner's`}
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
                styles.joinCard,
                {
                  backgroundColor: colors.surface,
                  borderRadius: borderRadius.xl,
                  marginTop: spacing.lg,
                },
              ]}
            >
              <ThemedText style={[styles.joinTitle, { fontFamily: Fonts.semibold }]}>
                Enter invite code
              </ThemedText>
              <ThemedText
                style={[
                  styles.joinDescription,
                  { color: colors.textSecondary, fontFamily: Fonts.regular },
                ]}
              >
                Ask your partner for the 6-character code they received.
              </ThemedText>

              <View style={[styles.codeInputContainer, { marginTop: spacing.lg }]}>
                {code.map((char, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    style={[
                      styles.codeInput,
                      {
                        backgroundColor: colors.background,
                        borderRadius: borderRadius.md,
                        color: colors.text,
                        fontFamily: Fonts.bold,
                        borderWidth: 2,
                        borderColor: char ? colors.primary : colors.border,
                      },
                    ]}
                    value={char}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    maxLength={index === 0 ? CODE_LENGTH : 1}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    keyboardType="default"
                    textAlign="center"
                    editable={!isPending}
                  />
                ))}
              </View>

              <ThemedText
                style={[
                  styles.helperText,
                  { color: colors.textMuted, marginTop: spacing.md, fontFamily: Fonts.regular },
                ]}
              >
                Code is case-insensitive
              </ThemedText>
            </View>

            <View style={styles.spacer} />

            <View style={[styles.buttonContainer, { marginBottom: spacing.xl }]}>
              <Pressable
                onPress={handleJoinSpace}
                disabled={!isCodeComplete || isPending}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: isCodeComplete && !isPending ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                    opacity: pressed && isCodeComplete && !isPending ? 0.9 : 1,
                    transform: [{ scale: pressed && isCodeComplete && !isPending ? 0.98 : 1 }],
                  },
                ]}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={isCodeComplete && !isPending ? colors.primaryText : colors.textMuted}
                />
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color: isCodeComplete && !isPending ? colors.primaryText : colors.textMuted,
                      fontFamily: Fonts.semibold,
                    },
                  ]}
                >
                  {isPending ? 'Joining...' : 'Join Space'}
                </ThemedText>
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
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'flex-start' },
  backButton: { paddingVertical: 4, paddingRight: 12 },
  backArrow: { fontSize: 28, lineHeight: 36 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 24, lineHeight: 32 },
  illustrationContainer: { alignItems: 'center' },
  illustration: { width: 220, height: 180 },
  joinCard: { padding: 24, alignItems: 'center' },
  joinTitle: { fontSize: 20 },
  joinDescription: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  codeInputContainer: { flexDirection: 'row', gap: 8 },
  codeInput: { width: 44, height: 52, fontSize: 20 },
  helperText: { fontSize: 12 },
  spacer: { flex: 1, minHeight: 32 },
  buttonContainer: { paddingHorizontal: 8 },
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
  buttonText: { fontSize: 17 },
});
