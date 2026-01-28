import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/hooks/use-theme';
import { Fonts } from '@/constants/theme';

export default function TabLayout() {
  const { colors, borderRadius } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          // Shadow
          shadowColor: '#3D3A3A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 11,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconSymbol
                size={24}
                name="house.fill"
                color={color}
                style={focused ? styles.iconActive : undefined}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.mapIconContainer,
                {
                  backgroundColor: focused ? colors.primary : colors.background,
                  borderRadius: borderRadius.full,
                  // Elevated shadow for center icon
                  shadowColor: focused ? colors.primary : '#3D3A3A',
                  shadowOffset: { width: 0, height: focused ? 4 : 2 },
                  shadowOpacity: focused ? 0.3 : 0.1,
                  shadowRadius: focused ? 8 : 4,
                  elevation: focused ? 6 : 2,
                },
              ]}
            >
              <IconSymbol
                size={20}
                name="heart.fill"
                color={focused ? colors.primaryText : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <IconSymbol
                size={24}
                name="photo.fill"
                color={color}
                style={focused ? styles.iconActive : undefined}
              />
            </View>
          ),
        }}
      />
      {/* Hide explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    transform: [{ scale: 1.05 }],
  },
  mapIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
});
