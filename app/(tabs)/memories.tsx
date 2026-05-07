import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';

export default function MemoriesScreen() {
  const { colors, spacing } = useTheme();
  // const { summary, loading } = useCoupleSummary();

  // if (loading && !summary) {
  //   return <PartnerRequiredScreen loading />;
  // }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.content, { paddingHorizontal: spacing.lg }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.accent + '22' }]}>
            <Ionicons name="images-outline" size={48} color={colors.accent} />
          </View>
          <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>Memories</ThemedText>
          <ThemedText
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: Fonts.regular },
            ]}
          >
            Moments you save together will show up here.
          </ThemedText>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },
});
