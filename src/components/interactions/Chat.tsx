import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Robot } from '../Robot';
import { BigButton, T } from '../ui';
import { FadeIn } from '@/lib/motion';
import type { ChatInteraction } from '@/content';
import { colors, radius, shadow } from '@/lib/theme';

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
          <FadeIn key={i} style={[styles.line, m.from === 'me' && { justifyContent: 'flex-end' }]}>
            {m.from === 'ai' && <Robot size={36} blink={false} />}
            <View style={[styles.bubble, m.from === 'me' ? styles.me : styles.ai]}>
              <T color={m.from === 'me' ? '#fff' : colors.text}>{m.text}</T>
            </View>
          </FadeIn>
        ))}
        {busy && (
          <View style={styles.line}>
            <Robot size={36} mood="think" blink={false} />
            <View style={[styles.bubble, styles.ai]}>
              <T>{shown === 0 ? '…' : typing!.slice(0, shown) + '▍'}</T>
            </View>
          </View>
        )}
        {messages.length === 0 && !busy && (
          <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
            點下面的問題開始
          </T>
        )}
      </View>
      {!busy && stage === 'followUp' && turn != null && (
        <BigButton variant="secondary" icon="💬" label={`接著問：${data.turns[turn].followUp.question}`} onPress={followUp} />
      )}
      {!busy && stage !== 'followUp' && (
        <View style={{ gap: 10 }}>
          {data.turns.map((t, i) => (
            <BigButton key={t.question} variant="secondary" icon="🙋" label={t.question} onPress={() => pick(i)} />
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
    backgroundColor: '#EAF2F1',
    borderRadius: radius,
    padding: 12,
    gap: 10,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  line: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { maxWidth: '82%', borderRadius: radius, paddingHorizontal: 14, paddingVertical: 10 },
  me: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  ai: { backgroundColor: colors.card, borderBottomLeftRadius: 6, flexShrink: 1, ...shadow(1) },
});
