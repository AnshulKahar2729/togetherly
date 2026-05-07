import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { focusManager, onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/**
 * Wires up TanStack Query's focusManager and onlineManager for React Native.
 * Must be called once at the root layout.
 *
 * - focusManager: refetches stale queries when the app comes back to the foreground.
 * - onlineManager: pauses/resumes queries based on network connectivity.
 */
export function useTanstackSetup() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let initialised = false;

    const eventSubscription = Network.addNetworkStateListener((state) => {
      initialised = true;
      onlineManager.setOnline(!!state.isConnected);
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!initialised) {
          onlineManager.setOnline(!!state.isConnected);
        }
      })
      .catch(() => {});

    return () => eventSubscription.remove();
  }, []);
}
