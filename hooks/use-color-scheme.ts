/**
 * Color scheme hook - currently locked to light mode
 * Dark mode support is configured but not exposed to users yet
 */

// import { useColorScheme as useSystemColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  // For now, always return light mode
  // When ready to support dark mode, uncomment below:
  // return useSystemColorScheme() ?? 'light';
  return 'light';
}
