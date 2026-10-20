import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

const native = process.env.EXPO_OS !== 'web';

/** Follows the iOS "Reduce Motion" setting so animations never bother sensitive readers. */
export function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

type ScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Layout for the outer touch target, e.g. `{ flex: 1 }` inside a row. */
  outerStyle?: StyleProp<ViewStyle>;
  haptic?: boolean;
  children: ReactNode;
};

/** A pressable that gently shrinks under the finger, so every tap feels acknowledged. */
export function PressableScale({ style, outerStyle, haptic = true, onPressIn, onPressOut, onPress, children, ...rest }: ScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: native, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable
      {...rest}
      style={outerStyle}
      onPressIn={(e) => {
        to(0.97);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Fades and lifts its children in when mounted. Change `key` to replay. */
export function FadeIn({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 380, delay, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
  }, []);
  const translateY = reduce ? 0 : v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  return <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** A slow up-and-down float, used for the guide on hero screens. */
export function Float({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduce]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
}

/** Shakes horizontally whenever `trigger` changes, for a wrong answer. */
export function useShake(trigger: unknown) {
  const v = useRef(new Animated.Value(0)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    v.setValue(0);
    Animated.sequence(
      [8, -8, 6, -6, 0].map((x) => Animated.timing(v, { toValue: x, duration: 60, useNativeDriver: native })),
    ).start();
  }, [trigger]);
  return { transform: [{ translateX: v }] };
}
