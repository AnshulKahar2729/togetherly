import { Tabs as ExpoRouterTabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { AppleIcon } from 'react-native-bottom-tabs';
import type { SFSymbol } from 'sf-symbols-typescript';

import { HapticTab } from '@/components/haptic-tab';
import { NativeTabs } from '@/components/native-bottom-tabs';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function TabBarIcon({
  focused,
  color,
  name,
  nameOutline,
}: {
  focused: boolean;
  color: string;
  name: keyof typeof Ionicons.glyphMap;
  nameOutline: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.iconSlot}>
      <Ionicons name={focused ? name : nameOutline} size={24} color={color} />
    </View>
  );
}

/** JS tabs for web (native bottom tabs are not supported there). */
function WebTabsLayout() {
  const { colors, borderRadius } = useTheme();

  return (
    <ExpoRouterTabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderTopLeftRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
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
      }}
    >
      <ExpoRouterTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} name="home" nameOutline="home-outline" />
          ),
        }}
      />
      <ExpoRouterTabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon focused={focused} color={color} name="map" nameOutline="map-outline" />
          ),
        }}
      />
      <ExpoRouterTabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name="images"
              nameOutline="images-outline"
            />
          ),
        }}
      />
      <ExpoRouterTabs.Screen name="explore" options={{ href: null }} />
    </ExpoRouterTabs>
  );
}

/** Callstack `react-native-bottom-tabs` on iOS and Android (dev build). */
function iosTabIcon(filled: SFSymbol, outline: SFSymbol) {
  return ({ focused }: { focused: boolean }): AppleIcon => ({
    sfSymbol: focused ? filled : outline,
  });
}

function NativeTabsLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      tabBarActiveTintColor={colors.tabIconSelected}
      tabBarInactiveTintColor={colors.tabIconDefault}
      tabBarStyle={{
        backgroundColor: colors.surface,
      }}
      hapticFeedbackEnabled
      tabLabelStyle={{
        fontFamily: Fonts.medium,
        fontSize: 11,
      }}
    >
      <NativeTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon:
            Platform.OS === 'ios'
              ? iosTabIcon('house.fill', 'house')
              : () => require('@/assets/tab-icons/home.png'),
        }}
      />
      <NativeTabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon:
            Platform.OS === 'ios'
              ? iosTabIcon('map.fill', 'map')
              : () => require('@/assets/tab-icons/map.png'),
        }}
      />
      <NativeTabs.Screen
        name="memories"
        options={{
          title: 'Memories',
          tabBarIcon:
            Platform.OS === 'ios'
              ? iosTabIcon('photo.fill', 'photo')
              : () => require('@/assets/tab-icons/images.png'),
        }}
      />
      <NativeTabs.Screen
        name="explore"
        options={{
          tabBarItemHidden: true,
        }}
      />
    </NativeTabs>
  );
}

export default function TabLayout() {
  return Platform.OS === 'web' ? <WebTabsLayout /> : <NativeTabsLayout />;
}

const styles = StyleSheet.create({
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
