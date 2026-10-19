import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Guide } from '../Guide';
import { BigButton, T } from '../ui';
import type { NextWordInteraction } from '@/content';
import { colors, radius } from '@/lib/theme';

export function NextWord({ data, onDone }: { data: NextWordInteraction; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [sentence, setSentence] = useState(data.steps[0].prefix);
  const [note, setNote] = useState<string | null>(null);
  const finished = step >= data.steps.length;

  const choose = (word: string) => {
    const options = data.steps[step].options;
    const top = options.reduce((a, b) => (b.p > a.p ? b : a));
    const next = step + 1;
    // Later prefixes assume the most likely word, the same way the AI would continue.
    setNote(word === top.word || next >= data.steps.length ? null : `你選了「${word}」，AI 最可能選「${top.word}」，我們照 AI 的選擇接下去。`);
    setSentence(next < data.steps.length ? data.steps[next].prefix : sentence + word + '。');
    setStep(next);
  };

  return (
    <View style={{ gap: 16 }}>
      <T>{data.intro}</T>
      <View style={styles.sentence}>
        <T size="large" bold>
          {sentence}
          {!finished && '＿＿'}
        </T>
      </View>
      {note && <T size="small" color={colors.muted}>{note}</T>}
      {!finished &&
        data.steps[step].options.map((o) => (
          <Pressable key={o.word} accessibilityRole="button" onPress={() => choose(o.word)} style={styles.option}>
            <T bold style={{ width: 64 }}>
              {o.word}
            </T>
            <View style={styles.track}>
              <View style={[styles.bar, { width: `${o.p}%` }]} />
            </View>
            <T size="small" color={colors.muted} style={{ width: 48, textAlign: 'right' }}>
              {o.p}%
            </T>
          </Pressable>
        ))}
      {finished && (
        <>
          <Guide says={data.outro} />
          <BigButton label="下一步" onPress={onDone} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sentence: { backgroundColor: colors.card, borderRadius: radius, padding: 16, borderWidth: 1, borderColor: colors.border },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 56,
    backgroundColor: colors.card,
    borderRadius: radius,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  track: { flex: 1, height: 14, borderRadius: 7, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.primary },
});
