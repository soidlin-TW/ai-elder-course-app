import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BigButton, T } from '../ui';
import type { ChatInteraction } from '@/content';
import { colors, radius } from '@/lib/theme';

type Message = { from: 'me' | 'ai'; text: string };

/** Scripted chat: answers type out character by character so it feels like a real AI reply. */
export function Chat({ data, onDone }: { data: ChatInteraction; onDone: () => void }) {
  const [turn, setTurn] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [shown, setShown] = useState(0);
  const [stage, setStage] = useState<'pick' | 'followUp' | 'done'>('pick');
  const [tried, setTried] = useState(0);

  useEffect(() => {
    if (typing == null) return;
    if (shown >= typing.length) {
      setMessages((m) => [...m, { from: 'ai', text: typing }]);
      setTyping(null);
      setShown(0);
      return;
    }
    const t = setTimeout(() => setShown((n) => n + 2), 30);
    return () => clearTimeout(t);
  }, [typing, shown]);

  const ask = (question: string, answer: string) => {
    setMessages((m) => [...m, { from: 'me', text: question }]);
    setTyping(answer);
  };

  const pick = (i: number) => {
    setTurn(i);
    setMessages([]);
    ask(data.turns[i].question, data.turns[i].answer);
    setStage('followUp');
  };

  const followUp = () => {
    if (turn == null) return;
    const f = data.turns[turn].followUp;
    ask(f.question, f.answer);
    setStage('done');
    setTried((n) => n + 1);
  };

  const busy = typing != null;

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <View style={styles.chat}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.from === 'me' ? styles.me : styles.ai]}>
            <T color={m.from === 'me' ? '#fff' : colors.text}>{m.text}</T>
          </View>
        ))}
        {busy && (
          <View style={[styles.bubble, styles.ai]}>
            <T>{typing!.slice(0, shown) + '▍'}</T>
          </View>
        )}
        {messages.length === 0 && !busy && (
          <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
            點下面的問題開始
          </T>
        )}
      </View>
      {!busy && stage === 'followUp' && turn != null && (
        <BigButton variant="secondary" label={`接著問：${data.turns[turn].followUp.question}`} onPress={followUp} />
      )}
      {!busy && stage !== 'followUp' && (
        <View style={{ gap: 10 }}>
          {data.turns.map((t, i) => (
            <BigButton key={t.question} variant="secondary" label={t.question} onPress={() => pick(i)} />
          ))}
        </View>
      )}
      <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
        {data.note}
      </T>
      {tried > 0 && !busy && <BigButton label="下一步" onPress={onDone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  chat: {
    backgroundColor: '#EEF3F2',
    borderRadius: radius,
    padding: 12,
    gap: 10,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  bubble: { maxWidth: '85%', borderRadius: radius, paddingHorizontal: 14, paddingVertical: 10 },
  me: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  ai: { alignSelf: 'flex-start', backgroundColor: colors.card },
});
