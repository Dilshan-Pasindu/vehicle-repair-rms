/**
 * Minimal & Professional Light Theme with Orange
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#F97316', // Orange 500
    primaryMuted: '#FFEDD5', // Orange 100
    text: '#0F172A', // Slate 900
    textMuted: '#64748B', // Slate 500
    background: '#FAFAFA', // Very light gray (almost white)
    surface: '#FFFFFF', // Pure white for cards/elements
    border: '#E2E8F0', // Slate 200
    success: '#10B981', // Emerald 500
    successBackground: '#ECFDF5', // Emerald 50
    error: '#EF4444', // Red 500
    errorBackground: '#FEF2F2', // Red 50
    warning: '#F59E0B', // Amber 500
    warningBackground: '#FFFBEB', // Amber 50
    info: '#3B82F6', // Blue 500
    infoBackground: '#EFF6FF', // Blue 50
  },
  dark: {
    // Dark mode is omitted as per light-theme requirement, 
    // but kept here just in case standard toggles apply.
    primary: '#F97316',
    primaryMuted: '#9A3412',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    success: '#34D399',
    successBackground: '#064E3B',
    error: '#F87171',
    errorBackground: '#7F1D1D',
    warning: '#FBBF24',
    warningBackground: '#78350F',
    info: '#60A5FA',
    infoBackground: '#1E3A8A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 40,
  six: 48,
  seven: 64,
} as const;

export const CustomBorders = {
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
