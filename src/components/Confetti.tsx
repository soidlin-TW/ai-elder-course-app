import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { useReduceMotion } from '@/lib/motion';
import { colors } from '@/lib/theme';

const PALETTE = [colors.primary, colors.accent, colors.gold, '#3A7BD5', '#7B5EC6', '#5CC2B4'];
const native = process.env.EXPO_OS !== 'web';

/** A short burst of falling paper for finishing a lesson. Skipped when Reduce Motion is on. */
export function Confetti({ count = 28 }: { count?: number }) {
  const reduce = useReduceMotion();
  const { width, height } = Dimensions.get('window');
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        drift: (Math.random() - 0.5) * 120,
        delay: Math.random() * 300,
        size: 8 + Math.random() * 8,
        color: PALETTE[i % PALETTE.length],
        round: i % 3 === 0,
      })),
    [count, width],
  );
  const v = useRef(pieces.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduce) return;
    Animated.parallel(
      v.map((a, i) =>
        Animated.timing(a, { toValue: 1, duration: 1800 + Math.random() * 700, delay: pieces[i].delay, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      ),
    ).start();
  }, [reduce]);

  if (reduce) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: -20,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            borderRadius: p.round ? p.size / 2 : 2,
            backgroundColor: p.color,
            opacity: v[i].interpolate({ inputRange: [0, 0.8, 1], outputRange: [1, 1, 0] }),
            transform: [
              { translateY: v[i].interpolate({ inputRange: [0, 1], outputRange: [0, height * 0.75] }) },
              { translateX: v[i].interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
              { rotate: v[i].interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${360 + i * 40}deg`] }) },
            ],
          }}
        />
      ))}
    </View>
  );
}
