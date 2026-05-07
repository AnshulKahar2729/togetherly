import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';

export default function MapScreen() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.content, { paddingHorizontal: spacing.lg }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primary + '18' }]}>
            <Ionicons name="map-outline" size={48} color={colors.primary} />
          </View>
          <ThemedText style={[styles.title, { fontFamily: Fonts.semibold }]}>Map</ThemedText>
          <ThemedText
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: Fonts.regular },
            ]}
          >
            Your shared goals and memories will appear here on a map.
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
