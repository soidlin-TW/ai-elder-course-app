import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Guide } from '../Guide';
import { BigButton, T } from '../ui';
import type { TapRevealInteraction } from '@/content';
import { colors, radius } from '@/lib/theme';

export function TapReveal({ data, onDone }: { data: TapRevealInteraction; onDone: () => void }) {
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState(false);

  const allRight = data.items.every((item, i) => !!picked[i] === item.correct);

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <View style={styles.grid}>
        {data.items.map((item, i) => {
          const on = !!picked[i];
          const state = revealed ? (item.correct ? 'correct' : 'wrong') : on ? 'on' : 'off';
          return (
            <Pressable
              key={item.label}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              disabled={revealed}
              onPress={() => setPicked((p) => ({ ...p, [i]: !p[i] }))}
              style={[styles.tile, tileStyles[state]]}
            >
              <Text style={{ fontSize: 36 }}>{item.emoji}</Text>
              <T bold style={{ textAlign: 'center' }}>
                {item.label}
              </T>
              {revealed && (
                <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
                  {(on === item.correct ? '✔ ' : '✘ ') + item.reveal}
                </T>
              )}
            </Pressable>
          );
        })}
      </View>
      {revealed ? (
        <>
          <Guide says={allRight ? data.outro : `有幾個不一樣，看看翻面的說明。${data.outro}`} />
          <BigButton label="下一步" onPress={onDone} />
        </>
      ) : (
        <BigButton label="看答案" onPress={() => setRevealed(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    minHeight: 120,
    borderRadius: radius,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});

const tileStyles = StyleSheet.create({
  off: { backgroundColor: colors.card, borderColor: colors.border },
  on: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  correct: { backgroundColor: colors.correctSoft, borderColor: colors.correct },
  wrong: { backgroundColor: colors.card, borderColor: colors.border },
});
