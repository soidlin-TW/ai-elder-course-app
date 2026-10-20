import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Guide } from '../Guide';
import { BigButton, T } from '../ui';
import type { TapRevealInteraction } from '@/content';
import { feedback } from '@/lib/feedback';
import { PressableScale } from '@/lib/motion';
import { colors, radius, shadow } from '@/lib/theme';

export function TapReveal({ data, onDone }: { data: TapRevealInteraction; onDone: () => void }) {
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState(false);

  const allRight = data.items.every((item, i) => !!picked[i] === item.correct);
  const count = Object.values(picked).filter(Boolean).length;

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <View style={styles.grid}>
        {data.items.map((item, i) => {
          const on = !!picked[i];
          const state = revealed ? (item.correct ? 'correct' : 'wrong') : on ? 'on' : 'off';
          return (
            <PressableScale
              key={item.label}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={item.label}
              disabled={revealed}
              onPress={() => setPicked((p) => ({ ...p, [i]: !p[i] }))}
              outerStyle={styles.cell}
              style={[styles.tile, tileStyles[state], state === 'off' && shadow(1)]}
            >
              {on && !revealed && (
                <View style={styles.check}>
                  <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text>
                </View>
              )}
              <Text style={{ fontSize: 40 }}>{item.emoji}</Text>
              <T bold style={{ textAlign: 'center' }}>
                {item.label}
              </T>
              {revealed && (
                <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
                  {(on === item.correct ? '✔ ' : '✘ ') + item.reveal}
                </T>
              )}
            </PressableScale>
          );
        })}
      </View>
      {revealed ? (
        <>
          <Guide mood={allRight ? 'cheer' : 'happy'} says={allRight ? data.outro : `有幾個不一樣，看看卡片上的說明。${data.outro}`} />
          <BigButton label="下一步" onPress={onDone} />
        </>
      ) : (
        <BigButton
          label={count === 0 ? '先點選上面的卡片' : `選好了（${count} 個），看答案`}
          disabled={count === 0}
          onPress={() => {
            feedback(allRight ? 'correct' : 'retry');
            setRevealed(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  cell: { width: '48%' },
  tile: {
    flexGrow: 1,
    minHeight: 132,
    borderRadius: radius,
    borderWidth: 2.5,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  check: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});

const tileStyles = StyleSheet.create({
  off: { backgroundColor: colors.card, borderColor: 'transparent' },
  on: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  correct: { backgroundColor: colors.correctSoft, borderColor: colors.correct },
  wrong: { backgroundColor: colors.card, borderColor: colors.border },
});
