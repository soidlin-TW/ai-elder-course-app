import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors, fontSize, minTouch, radius, shadow } from '@/lib/theme';

type TextProps = {
  children: ReactNode;
  size?: keyof typeof fontSize;
  bold?: boolean;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

/** Text that follows the reader's font-size setting on top of the system setting. */
export function T({ children, size = 'body', bold, color = colors.text, style, numberOfLines }: TextProps) {
  const { fontScale } = useStore();
  const px = fontSize[size] * fontScale;
  const heading = size === 'title' || size === 'hero';
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontSize: px, lineHeight: px * (heading ? 1.3 : 1.6), color, fontWeight: bold ? '700' : '400', letterSpacing: heading ? 0.3 : 0.2 }, style]}
    >
      {children}
    </Text>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'light';
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  outerStyle?: StyleProp<ViewStyle>;
};

const buttonColors = {
  primary: { bg: colors.primary, fg: '#fff' },
  accent: { bg: colors.accent, fg: '#fff' },
  secondary: { bg: colors.primarySoft, fg: colors.primaryDark },
  light: { bg: '#fff', fg: colors.primaryDark },
  ghost: { bg: 'transparent', fg: colors.primaryDark },
};

export function BigButton({ label, onPress, variant = 'primary', icon, disabled, style, outerStyle }: ButtonProps) {
  const c = buttonColors[variant];
  const raised = variant === 'primary' || variant === 'accent' || variant === 'light';
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      outerStyle={outerStyle}
      style={[styles.button, { backgroundColor: c.bg }, raised && !disabled && shadow(2), disabled && { opacity: 0.4 }, style]}
    >
      <View style={styles.buttonInner}>
        {icon && <Text style={{ fontSize: 22 }}>{icon}</Text>}
        <T bold color={c.fg} style={{ textAlign: 'center', flexShrink: 1 }}>
          {label}
        </T>
      </View>
    </PressableScale>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Small rounded label, e.g. 「免費試看」. */
export function Pill({ label, color = colors.primaryDark, bg = colors.primarySoft }: { label: string; color?: string; bg?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <T size="small" bold color={color}>
        {label}
      </T>
    </View>
  );
}

/** A thin progress bar. */
export function Bar({ progress, color = colors.primary, track = colors.primarySoft, height = 10 }: { progress: number; color?: string; track?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${Math.max(0, Math.min(1, progress)) * 100}%`, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

/** Keeps the main action within thumb reach at the bottom of long screens. */
export function StickyFooter({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouch + 4,
    borderRadius: radius,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 20,
    ...shadow(1),
  },
  pill: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 2 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
    backgroundColor: 'rgba(255,248,238,0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
