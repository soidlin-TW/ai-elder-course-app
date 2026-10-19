import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BigButton, T } from './ui';
import type { Quiz } from '@/content';
import { colors, radius } from '@/lib/theme';

export function QuizView({ quiz, onDone }: { quiz: Quiz; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const right = picked === quiz.answer;

  const choose = (i: number) => {
    if (picked === quiz.answer) return;
    Haptics.notificationAsync(i === quiz.answer ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setPicked(i);
  };

  return (
    <View style={{ gap: 14 }}>
      <T size="large" bold>
        {quiz.question}
      </T>
      {quiz.options.map((o, i) => {
        const style = picked === i ? (i === quiz.answer ? styles.good : styles.bad) : right && i === quiz.answer ? styles.good : styles.idle;
        return (
          <Pressable key={o} accessibilityRole="button" onPress={() => choose(i)} style={[styles.option, style]}>
            <T>{o}</T>
          </Pressable>
        );
      })}
      {picked != null && (
        <>
          <T bold color={right ? colors.correct : colors.wrong}>
            {right ? '答對了！' : '不太對，再選一次看看。'}
          </T>
          {right && <T>{quiz.explanation}</T>}
        </>
      )}
      {right && <BigButton label="完成這一課" onPress={onDone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  option: { borderRadius: radius, borderWidth: 2, padding: 16, minHeight: 56 },
  idle: { backgroundColor: colors.card, borderColor: colors.border },
  good: { backgroundColor: colors.correctSoft, borderColor: colors.correct },
  bad: { backgroundColor: colors.wrongSoft, borderColor: colors.wrong },
});
