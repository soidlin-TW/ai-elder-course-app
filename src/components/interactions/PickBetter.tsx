import { useState } from 'react';
import { View } from 'react-native';

import { Guide } from '../Guide';
import { OptionCard } from '../OptionCard';
import { BigButton, Card, Pill, T } from '../ui';
import type { PickBetterInteraction } from '@/content';
import { feedback } from '@/lib/feedback';
import { FadeIn } from '@/lib/motion';
import { colors } from '@/lib/theme';

export function PickBetter({ data, onDone }: { data: PickBetterInteraction; onDone: () => void }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const finished = round >= data.rounds.length;

  if (finished) {
    return (
      <View style={{ gap: 16 }}>
        <T size="large" bold style={{ textAlign: 'center' }}>
          選對 {score} / {data.rounds.length} 題
        </T>
        <Guide mood="cheer" says={data.outro} />
        <BigButton label="下一步" onPress={onDone} />
      </View>
    );
  }

  const r = data.rounds[round];
  const choose = (i: number) => {
    if (picked != null) return;
    const good = r.options[i].good;
    feedback(good ? 'correct' : 'retry');
    if (good) setScore((s) => s + 1);
    setPicked(i);
  };

  return (
    <FadeIn key={round} style={{ gap: 14 }}>
      {round === 0 && <T>{data.intro}</T>}
      <Pill label={`第 ${round + 1} / ${data.rounds.length} 題`} />
      <Card>
        <T size="large" bold>
          {r.situation}
        </T>
      </Card>
      {r.options.map((o, i) => (
        <OptionCard
          key={o.text}
          index={i}
          text={o.text}
          disabled={picked != null}
          state={picked == null ? 'idle' : o.good ? 'right' : i === picked ? 'wrong' : 'dim'}
          onPress={() => choose(i)}
        />
      ))}
      {picked != null && (
        <>
          <T bold color={r.options[picked].good ? colors.correct : colors.wrong}>
            {r.options[picked].good ? '選得好！' : '比較好的是綠色那個。'}
          </T>
          <T>{r.explain}</T>
          <BigButton
            label={round + 1 < data.rounds.length ? '下一題' : '看結果'}
            onPress={() => {
              setPicked(null);
              setRound((n) => n + 1);
            }}
          />
        </>
      )}
    </FadeIn>
  );
}
