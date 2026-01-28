import { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';

const SKIN_TONES = [
  { id: 'light', color: '#FFE4D6' },
  { id: 'fair', color: '#F5D0B5' },
  { id: 'medium', color: '#D4A574' },
  { id: 'tan', color: '#A67C52' },
  { id: 'brown', color: '#8B5A3C' },
  { id: 'dark', color: '#5C3D2E' },
] as const;

type SkinToneId = (typeof SKIN_TONES)[number]['id'];

export default function CreateAvatarScreen() {
  const router = useRouter();
  const { colors, spacing, borderRadius } = useTheme();

  const [name, setName] = useState('');
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinToneId>('fair');

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (name.trim()) {
      // Navigate to couple space setup
      router.push('/couple-space');
    }
  };

  const isValid = name.trim().length > 0;

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
              <ThemedText style={[styles.headerTitle, { fontFamily: Fonts.medium }]}>
                Create a{' '}
                <ThemedText style={[styles.headerTitle, { color: colors.primary, fontFamily: Fonts.semibold }]}>
                  cute avatar
                </ThemedText>
              </ThemedText>
            </View>

            {/* Avatar Preview */}
            <View style={[styles.avatarContainer, { marginTop: spacing.xl }]}>
              <View
                style={[
                  styles.avatarFrame,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: borderRadius.xl,
                  },
                ]}
              >
                <Image
                  source={require('@/designs/avatar-sample.png')}
                  style={styles.avatarImage}
                  contentFit="contain"
                />
              </View>
            </View>

            {/* Title */}
            <ThemedText
              style={[
                styles.title,
                { marginTop: spacing.xl, fontFamily: Fonts.semibold },
              ]}
            >
              Create a cute avatar
            </ThemedText>

            {/* Skin Tone Selector */}
            <View style={[styles.skinToneContainer, { marginTop: spacing.lg }]}>
              {SKIN_TONES.map((tone) => (
                <Pressable
                  key={tone.id}
                  onPress={() => setSelectedSkinTone(tone.id)}
                  style={({ pressed }) => [
                    styles.skinToneButton,
                    {
                      backgroundColor: tone.color,
                      borderWidth: selectedSkinTone === tone.id ? 3 : 0,
                      borderColor: colors.primary,
                      transform: [{ scale: pressed ? 0.9 : 1 }],
                    },
                  ]}
                />
              ))}
            </View>

            {/* Name Input */}
            <View style={[styles.inputContainer, { marginTop: spacing.xl }]}>
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

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Continue Button */}
            <View style={[styles.buttonContainer, { marginBottom: spacing.xl }]}>
              <Pressable
                onPress={handleContinue}
                disabled={!isValid}
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: isValid ? colors.primary : colors.border,
                    borderRadius: borderRadius.full,
                    opacity: pressed && isValid ? 0.9 : 1,
                    transform: [{ scale: pressed && isValid ? 0.98 : 1 }],
                  },
                ]}
              >
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
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
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
    marginRight: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 28,
  },
  headerTitle: {
    fontSize: 17,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarFrame: {
    width: 220,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 200,
    height: 160,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  skinToneContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  skinToneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    paddingHorizontal: 8,
  },
  input: {
    height: 56,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
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
