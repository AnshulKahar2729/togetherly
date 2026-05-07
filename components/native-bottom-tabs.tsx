import { withLayoutContext } from 'expo-router';
import {
  createNativeBottomTabNavigator,
  type NativeBottomTabNavigationEventMap,
  type NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

/**
 * Callstack native tab bar (UITabBar / Material). Use with Expo Router via `withLayoutContext`.
 * Requires a dev build + `react-native-bottom-tabs` in app.json plugins — not supported in Expo Go.
 */
export const NativeTabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);
