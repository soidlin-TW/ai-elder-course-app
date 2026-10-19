import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Guide } from '../Guide';
import { BigButton, T } from '../ui';
import type { PickBetterInteraction } from '@/content';
import { colors, radius } from '@/lib/theme';

export function PickBetter({ data, onDone }: { data: PickBetterInteraction; onDone: () => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const finished = round >= data.rounds.length;

  if (finished) {
    return (
      <View style={{ gap: 16 }}>
        <Guide says={data.outro} />
        <BigButton label="下一步" onPress={onDone} />
      </View>
    );
  }

  const r = data.rounds[round];
  const choose = (i: number) => {
    if (picked != null) return;
    const good = r.options[i].good;
    Haptics.notificationAsync(good ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setPicked(i);
  };

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <T size="small" color={colors.muted}>
        第 {round + 1} / {data.rounds.length} 題
      </T>
      <T size="large" bold>
        {r.situation}
      </T>
      {r.options.map((o, i) => {
        const show = picked != null;
        const style = show ? (o.good ? styles.good : i === picked ? styles.bad : styles.idle) : styles.idle;
        return (
          <Pressable key={o.text} accessibilityRole="button" onPress={() => choose(i)} style={[styles.option, style]}>
            <T>{(show ? (o.good ? '✔ ' : i === picked ? '✘ ' : '') : '') + o.text}</T>
          </Pressable>
        );
      })}
      {picked != null && (
        <>
          <T bold color={r.options[picked].good ? colors.correct : colors.wrong}>
            {r.options[picked].good ? '選得好！' : '再想想看，比較好的是綠色那個。'}
          </T>
          <T>{r.explain}</T>
          <BigButton
            label={round + 1 < data.rounds.length ? '下一題' : '完成'}
            onPress={() => {
              setPicked(null);
              setRound((n) => n + 1);
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  option: { borderRadius: radius, borderWidth: 2, padding: 16, minHeight: 56 },
  idle: { backgroundColor: colors.card, borderColor: colors.border },
  good: { backgroundColor: colors.correctSoft, borderColor: colors.correct },
  bad: { backgroundColor: colors.wrongSoft, borderColor: colors.wrong },
});
