import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Guide } from '../Guide';
import { BigButton, Card, T } from '../ui';
import type { SortInteraction } from '@/content';
import { colors } from '@/lib/theme';

/** One card at a time with two big buttons: easier than dragging for older hands. */
export function Sort({ data, onDone }: { data: SortInteraction; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = index >= data.cards.length;
  const card = data.cards[index];

  const choose = (bin: number) => {
    const right = bin === card.bin;
    Haptics.notificationAsync(right ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (right) setScore((s) => s + 1);
    setAnswer(bin);
  };

  const next = () => {
    setAnswer(null);
    setIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <View style={{ gap: 16 }}>
        <T size="large" bold style={{ textAlign: 'center' }}>
          答對 {score} / {data.cards.length} 張
        </T>
        <Guide says={data.outro} />
        <BigButton label="下一步" onPress={onDone} />
      </View>
    );
  }

  const right = answer === card.bin;

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <T size="small" color={colors.muted}>
        第 {index + 1} / {data.cards.length} 張
      </T>
      <Card style={answer == null ? undefined : { backgroundColor: right ? colors.correctSoft : colors.wrongSoft }}>
        <T size="large" bold style={{ textAlign: 'center' }}>
          {card.text}
        </T>
      </Card>
      {answer == null ? (
        <View style={styles.row}>
          {data.bins.map((label, bin) => (
            <BigButton key={label} label={label} variant={bin === 0 ? 'secondary' : 'primary'} onPress={() => choose(bin)} style={{ flex: 1 }} />
          ))}
        </View>
      ) : (
        <>
          <T bold color={right ? colors.correct : colors.wrong}>
            {right ? '答對了！' : `答案是「${data.bins[card.bin]}」`}
          </T>
          <T>{card.reason}</T>
          <BigButton label={index + 1 < data.cards.length ? '下一張' : '看結果'} onPress={next} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
});
