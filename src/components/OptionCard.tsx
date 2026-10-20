import { StyleSheet, Text, View } from 'react-native';

import { T } from './ui';
import { PressableScale } from '@/lib/motion';
import { colors, radius, shadow } from '@/lib/theme';

export type OptionState = 'idle' | 'right' | 'wrong' | 'dim';

const LETTERS = 'ABCDEF';

/** A big lettered answer card shared by quizzes and "pick the better one" rounds. */
export function OptionCard({ index, text, state, onPress, disabled }: { index: number; text: string; state: OptionState; onPress: () => void; disabled?: boolean }) {
  const s = looks[state];
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${LETTERS[index]}，${text}${state === 'right' ? '，正確' : state === 'wrong' ? '，不正確' : ''}`}
      disabled={disabled}
      onPress={onPress}
      style={[styles.option, { backgroundColor: s.bg, borderColor: s.border }, state === 'idle' && shadow(1), state === 'dim' && { opacity: 0.6 }]}
    >
      <View style={[styles.badge, { backgroundColor: s.badge }]}>
        <Text style={[styles.letter, { color: s.letter }]}>{state === 'right' ? '✓' : state === 'wrong' ? '✕' : LETTERS[index]}</Text>
      </View>
      <T style={{ flex: 1 }}>{text}</T>
    </PressableScale>
  );
}

const looks = {
  idle: { bg: colors.card, border: 'transparent', badge: colors.primarySoft, letter: colors.primaryDark },
  dim: { bg: colors.card, border: 'transparent', badge: '#F1ECE4', letter: colors.muted },
  right: { bg: colors.correctSoft, border: colors.correct, badge: colors.correct, letter: '#fff' },
  wrong: { bg: colors.wrongSoft, border: colors.wrong, badge: colors.wrong, letter: '#fff' },
};

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: radius, borderWidth: 2, padding: 14, minHeight: 64 },
  badge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 18, fontWeight: '800' },
});
