import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Animated, View } from 'react-native';

import { Guide } from './Guide';
import { OptionCard, type OptionState } from './OptionCard';
import { BigButton, Card, T } from './ui';
import type { Quiz } from '@/content';
import { useShake } from '@/lib/motion';

export function QuizView({ quiz, onDone }: { quiz: Quiz; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const right = picked === quiz.answer;
  const shake = useShake(misses);

  const choose = (i: number) => {
    if (right) return;
    const ok = i === quiz.answer;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
    if (!ok) setMisses((n) => n + 1);
    setPicked(i);
  };

  const stateOf = (i: number): OptionState => {
    if (right) return i === quiz.answer ? 'right' : 'dim';
    if (picked === i) return 'wrong';
    return 'idle';
  };

  return (
    <View style={{ gap: 14 }}>
      <Card>
        <T size="large" bold>
          {quiz.question}
        </T>
      </Card>
      <Animated.View style={[{ gap: 12 }, shake]}>
        {quiz.options.map((o, i) => (
          <OptionCard key={o} index={i} text={o} state={stateOf(i)} onPress={() => choose(i)} disabled={right} />
        ))}
      </Animated.View>
      {picked != null && !right && <Guide mood="think" says="不太對喔，沒關係，再選一次看看。" />}
      {right && (
        <>
          <Guide mood="cheer" says={`答對了！${quiz.explanation}`} />
          <BigButton icon="🎉" label="完成這一課" onPress={onDone} />
        </>
      )}
    </View>
  );
}
