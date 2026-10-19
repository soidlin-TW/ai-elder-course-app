import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useStore } from '@/lib/store';
import { colors, fontSize, minTouch, radius } from '@/lib/theme';

type TextProps = {
  children: ReactNode;
  size?: keyof typeof fontSize;
  bold?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** Text that follows the reader's font-size setting on top of the system setting. */
export function T({ children, size = 'body', bold, color = colors.text, style }: TextProps) {
  const { fontScale } = useStore();
  const px = fontSize[size] * fontScale;
  return (
    <Text style={[{ fontSize: px, lineHeight: px * 1.55, color, fontWeight: bold ? '700' : '400' }, style]}>{children}</Text>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function BigButton({ label, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  const filled = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        filled ? styles.primary : variant === 'secondary' ? styles.secondary : styles.ghost,
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      <T bold color={filled ? '#fff' : colors.primaryDark} style={{ textAlign: 'center' }}>
        {label}
      </T>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouch,
    borderRadius: radius,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft },
  ghost: { backgroundColor: 'transparent' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
