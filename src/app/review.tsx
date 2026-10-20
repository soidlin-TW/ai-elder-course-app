import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Confetti } from '@/components/Confetti';
import { Guide } from '@/components/Guide';
import { QuizView } from '@/components/QuizView';
import { Robot } from '@/components/Robot';
import { Bar, BigButton, Card, T } from '@/components/ui';
import { allLessons } from '@/content';
import { FadeIn } from '@/lib/motion';
import { dayKey, useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const PER_DAY = 3;

/** Same three questions all day, different tomorrow. */
function pickForToday<T>(pool: T[], n: number): T[] {
  let seed = [...dayKey()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) % 10000) / 10000;
  return [...pool].sort(() => rnd() - 0.5).slice(0, n);
}

export default function Review() {
  const { completed, reviewDay, reviewStreak, finishReview } = useStore();
  const pool = allLessons.filter((l) => completed[l.id]);
  const today = useMemo(() => pickForToday(pool, PER_DAY), [pool.length]);
  const [i, setI] = useState(0);
  const doneToday = reviewDay === dayKey();

  if (pool.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Guide says="上完第一課，就可以每天來這裡複習 3 題，幫助記得更牢。" />
        <BigButton label="去上第一課" onPress={() => router.replace(`/lesson/${allLessons[0].id}`)} />
      </ScrollView>
    );
  }

  if (i >= today.length || (doneToday && i === 0)) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.page, { alignItems: 'stretch' }]}>
          <FadeIn style={{ alignItems: 'center', gap: 8 }}>
            <Robot size={130} mood="cheer" />
            <T size="title" bold style={{ textAlign: 'center' }}>
              今天的複習完成了！
            </T>
          </FadeIn>
          <Card style={styles.streak}>
            <Text style={{ fontSize: 44 }}>🔥</Text>
            <View style={{ flex: 1 }}>
              <T size="large" bold>
                連續複習 {Math.max(reviewStreak, 1)} 天
              </T>
              <T size="small" color={colors.muted}>
                明天再來，會有新的 3 題。
              </T>
            </View>
          </Card>
          <BigButton variant="secondary" label="回到首頁" onPress={() => router.dismissTo('/')} />
        </ScrollView>
        {i >= today.length && <Confetti />}
      </View>
    );
  }

  const lesson = today[i];
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={{ gap: 6 }}>
        <T size="small" color={colors.muted}>
          今日複習 第 {i + 1} / {today.length} 題・來自「{lesson.title}」
        </T>
        <Bar progress={i / today.length} color={colors.gold} track={colors.goldSoft} height={6} />
      </View>
      <FadeIn key={lesson.id}>
        <QuizView
          quiz={lesson.quiz}
          doneLabel={i + 1 < today.length ? '下一題' : '完成今天的複習'}
          onDone={() => {
            if (i + 1 >= today.length) finishReview();
            setI((n) => n + 1);
          }}
        />
      </FadeIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.goldSoft },
});
