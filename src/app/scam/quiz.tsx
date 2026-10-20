import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Confetti } from '@/components/Confetti';
import { Guide } from '@/components/Guide';
import { LockedHint } from '@/components/LockedHint';
import { Bar, BigButton, Card, T } from '@/components/ui';
import { FREE_SCENARIOS, scamKit } from '@/content/extras';
import { feedback } from '@/lib/feedback';
import { FadeIn } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function ScamQuiz() {
  const { unlocked } = useStore();
  const list = unlocked ? scamKit.scenarios : scamKit.scenarios.slice(0, FREE_SCENARIOS);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= list.length;

  if (done) {
    const perfect = score === list.length;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.page}>
          <T size="title" bold style={{ textAlign: 'center' }}>
            答對 {score} / {list.length} 題
          </T>
          <Guide mood={perfect ? 'cheer' : 'happy'} says={perfect ? '全部答對！你已經是防詐高手了，記得教教家人。' : '有些情境很逼真，多練幾次就會越來越敏銳。'} />
          {!unlocked && <LockedHint text={`還有 ${scamKit.scenarios.length - FREE_SCENARIOS} 個情境可以練習`} />}
          <BigButton
            variant="secondary"
            label="再練一次"
            onPress={() => {
              setI(0);
              setScore(0);
              setAnswer(null);
            }}
          />
          <BigButton variant="ghost" label="回到防詐工具箱" onPress={() => router.back()} />
        </ScrollView>
        {perfect && <Confetti />}
      </View>
    );
  }

  const s = list[i];
  const right = answer === s.scam;
  const choose = (scam: boolean) => {
    if (answer != null) return;
    const ok = scam === s.scam;
    feedback(ok ? 'correct' : 'retry');
    if (ok) setScore((n) => n + 1);
    setAnswer(scam);
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={{ gap: 6 }}>
        <T size="small" color={colors.muted}>
          第 {i + 1} / {list.length} 題
        </T>
        <Bar progress={i / list.length} color={colors.wrong} track={colors.wrongSoft} height={6} />
      </View>
      <FadeIn key={i}>
        <Card style={{ gap: 10 }}>
          <T size="small" bold color={colors.muted}>
            {s.channel}
          </T>
          <T size="large">{s.text}</T>
        </Card>
      </FadeIn>
      {answer == null ? (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <BigButton variant="accent" icon="🚨" label="是詐騙" onPress={() => choose(true)} outerStyle={{ flex: 1 }} />
          <BigButton icon="👌" label="沒問題" onPress={() => choose(false)} outerStyle={{ flex: 1 }} />
        </View>
      ) : (
        <FadeIn style={{ gap: 14 }}>
          <View style={[styles.verdict, { backgroundColor: right ? colors.correctSoft : colors.wrongSoft }]}>
            <Text style={{ fontSize: 30 }}>{right ? '✅' : '❌'}</Text>
            <T bold color={right ? colors.correct : colors.wrong} style={{ flex: 1 }}>
              {right ? '答對了！' : '再想想。'}這{s.scam ? '是詐騙' : '不是詐騙'}。
            </T>
          </View>
          <T>{s.explain}</T>
          <BigButton
            label={i + 1 < list.length ? '下一題' : '看結果'}
            onPress={() => {
              setAnswer(null);
              setI((n) => n + 1);
            }}
          />
        </FadeIn>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14 },
});
