import React from 'react';
import { View } from 'react-native';

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light';
}

const Logo = require('../../../assets/logo.svg');

export function AppLogo({ size = 48, showText = false, variant = 'dark' }: AppLogoProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Logo width={size} height={size} />
    </View>
  );
}

export function AppLogoIcon({ size = 48 }: { size?: number }) {
  return <AppLogo size={size} showText={false} />;
}
