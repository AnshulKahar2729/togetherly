import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { LoreleiAvatarEditor } from '@/components/lorelei-avatar-editor';
import { DEFAULT_LORELEI_AVATAR_CONFIG, type LoreleiAvatarConfig } from '@/lib/lorelei-avatar';
import { loadUserProfile, saveUserProfile } from '@/lib/storage/user-profile';

const BG = '#FFF6F2';
const CORAL = '#FF8A7A';

export default function AvatarPlaygroundScreen() {
  const router = useRouter();
  const [config, setConfig] = useState<LoreleiAvatarConfig>(DEFAULT_LORELEI_AVATAR_CONFIG);

  const handleSave = useCallback(async () => {
    try {
      const profile = loadUserProfile();
      if (profile) saveUserProfile({ ...profile, avatarSeed: config.seed, gender: config.gender });
      Alert.alert('Avatar saved', 'Your avatar is stored on this device for the app.', [
        { text: 'OK' },
      ]);
    } catch {
      Alert.alert('Could not save', 'Please try again.');
    }
  }, [config]);

  return (
    <View style={[styles.root, { backgroundColor: BG }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Avatar playground</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LoreleiAvatarEditor value={config} onChange={setConfig} />

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveBtn,
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Text style={styles.saveBtnText}>Save Avatar</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: 16, color: '#8B7355' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#3D2E2A',
  },
  headerSpacer: { width: 64 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  saveBtn: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: CORAL,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
