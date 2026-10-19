import * as StoreReview from 'expo-store-review';
import { Redirect, Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewInstance } from 'react-native';

import { Guide } from '@/components/Guide';
import { InteractionView } from '@/components/interactions';
import { LessonImage } from '@/components/LessonImage';
import { QuizView } from '@/components/QuizView';
import { ShareCard } from '@/components/ShareCard';
import { BigButton, Card, T } from '@/components/ui';
import { allLessons, findLesson, nextLessonId, takeaway, units } from '@/content';
import { speak, stopSpeaking } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const STEPS = ['read', 'example', 'interaction', 'quiz', 'done'] as const;
type Step = (typeof STEPS)[number];
const STEP_LABELS: Record<Step, string> = { read: '讀一讀', example: '生活例子', interaction: '動手試試', quiz: '小測驗', done: '完成' };

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const [step, setStep] = useState<Step>('read');
  const [speaking, setSpeaking] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const found = findLesson(id);

  useEffect(() => {
    setStep('read');
    if (found) store.setLastLesson(found.lesson.id);
    return stopSpeaking;
  }, [id]);

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
    stopSpeaking();
    setSpeaking(false);
  }, [step, id]);

  if (!found) return <Redirect href="/" />;
  const { unit, lesson, index } = found;
  if (!lesson.free && !store.unlocked) return <Redirect href="/unlock" />;

  const nextId = nextLessonId(lesson.id);
  const nextLocked = nextId ? !store.unlocked && !findLesson(nextId)!.lesson.free : false;
  const stepIndex = STEPS.indexOf(step);
  const go = (s: Step) => setStep(s);

  const toggleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speak([lesson.title, ...lesson.paragraphs].join('\n'), store.speechRate, () => setSpeaking(false));
    }
  };

  const finish = async () => {
    store.markCompleted(lesson.id);
    go('done');
    // Ask for a rating once, right after the free unit 1 is finished, when goodwill is highest.
    const unit1Done = units[0].lessons.every((l) => l.id === lesson.id || store.completed[l.id]);
    if (unit.id === 1 && unit1Done && !store.reviewRequested) {
      store.setReviewRequested();
      try {
        if (await StoreReview.isAvailableAsync()) await StoreReview.requestReview();
      } catch {}
    }
  };

  const allDone = allLessons.every((l) => l.id === lesson.id || store.completed[l.id]);

  return (
    <ScrollView ref={scroll} contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `第 ${unit.id} 單元・第 ${index + 1} 課` }} />
      <View style={styles.dots}>
        {STEPS.map((s, i) => (
          <View key={s} style={[styles.dot, i <= stepIndex && styles.dotOn]} />
        ))}
      </View>
      <T size="small" color={colors.muted}>
        {STEP_LABELS[step]}
      </T>

      {step === 'read' && (
        <>
          <T size="title" bold>
            {lesson.title}
          </T>
          <LessonImage lessonId={lesson.id} />
          <BigButton variant="secondary" label={speaking ? '⏹ 停止朗讀' : '🔊 唸給我聽'} onPress={toggleSpeak} />
          {lesson.paragraphs.map((p) => (
            <T key={p}>{p}</T>
          ))}
          <BigButton label="下一步" onPress={() => go('example')} />
        </>
      )}

      {step === 'example' && (
        <>
          <Card style={{ gap: 8 }}>
            <T bold color={colors.primaryDark}>
              💡 生活中的例子
            </T>
            <T>{lesson.example}</T>
          </Card>
          <BigButton label="來動手試試" onPress={() => go('interaction')} />
        </>
      )}

      {step === 'interaction' && (
        <>
          <T size="large" bold>
            {lesson.interaction.title}
          </T>
          <InteractionView key={lesson.id} data={lesson.interaction} onDone={() => go('quiz')} />
        </>
      )}

      {step === 'quiz' && <QuizView key={lesson.id} quiz={lesson.quiz} onDone={finish} />}

      {step === 'done' && (
        <>
          <Guide says={`「${lesson.title}」上完了！把今天學到的一句話分享給家人吧。`} />
          <ShareCard heading={`今天學到：${lesson.title}`} body={takeaway(lesson)} />
          {allDone ? (
            <BigButton label="🎓 領取結業證書" onPress={() => router.replace('/certificate')} />
          ) : nextId ? (
            <BigButton
              label={nextLocked ? '🔓 解鎖後繼續下一課' : '下一課'}
              onPress={() => router.replace(nextLocked ? '/unlock' : `/lesson/${nextId}`)}
            />
          ) : null}
          <BigButton variant="ghost" label="回到首頁" onPress={() => router.dismissTo('/')} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 56 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotOn: { backgroundColor: colors.primary },
});
