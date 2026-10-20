import * as StoreReview from 'expo-store-review';
import { Redirect, Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Confetti } from '@/components/Confetti';
import { Guide } from '@/components/Guide';
import { InteractionView } from '@/components/interactions';
import { LessonImage } from '@/components/LessonImage';
import { QuizView } from '@/components/QuizView';
import { Robot } from '@/components/Robot';
import { ShareCard } from '@/components/ShareCard';
import { BigButton, Card, StickyFooter, T } from '@/components/ui';
import { allLessons, findLesson, nextLessonId, takeaway, units } from '@/content';
import { FadeIn, PressableScale } from '@/lib/motion';
import { speak, stopSpeaking } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { colors, radius, unitThemes } from '@/lib/theme';

const STEPS = ['read', 'example', 'interaction', 'quiz', 'done'] as const;
type Step = (typeof STEPS)[number];
const STEP_LABELS: Record<Step, string> = { read: '讀一讀', example: '生活例子', interaction: '動手試試', quiz: '小測驗', done: '完成' };

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
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

  const t = unitThemes[unit.id];
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
  const doneCount = allLessons.filter((l) => l.id === lesson.id || store.completed[l.id]).length;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <PressableScale accessibilityRole="button" accessibilityLabel="離開這一課" onPress={() => router.back()} style={styles.close}>
          <Text style={{ fontSize: 22, color: colors.muted, fontWeight: '700' }}>✕</Text>
        </PressableScale>
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View key={s} style={[styles.dot, { backgroundColor: i <= stepIndex ? t.color : colors.border }]} />
            ))}
          </View>
          <T size="small" color={colors.muted}>
            第 {unit.id} 單元・第 {index + 1} 課・{STEP_LABELS[step]}
          </T>
        </View>
      </View>

      <ScrollView ref={scroll} contentContainerStyle={[styles.page, step === 'done' && { paddingBottom: insets.bottom + 32 }]}>
        {step === 'read' && (
          <FadeIn key="read" style={styles.stack}>
            <T size="title" bold>
              {lesson.title}
            </T>
            <LessonImage lessonId={lesson.id} unitId={unit.id} />
            <PressableScale accessibilityRole="button" accessibilityLabel={speaking ? '停止朗讀' : '唸給我聽'} onPress={toggleSpeak} style={[styles.listen, speaking && { backgroundColor: t.color }]}>
              <Text style={{ fontSize: 22 }}>{speaking ? '⏹' : '🔊'}</Text>
              <T bold color={speaking ? '#fff' : colors.primaryDark}>
                {speaking ? '正在朗讀，點一下停止' : '唸給我聽'}
              </T>
            </PressableScale>
            {lesson.paragraphs.map((p) => (
              <T key={p}>{p}</T>
            ))}
          </FadeIn>
        )}

        {step === 'example' && (
          <FadeIn key="example" style={styles.stack}>
            <T size="title" bold>
              生活中的例子
            </T>
            <Card style={{ gap: 10, borderLeftWidth: 6, borderLeftColor: colors.gold }}>
              <Text style={{ fontSize: 36 }}>💡</Text>
              <T>{lesson.example}</T>
            </Card>
            <Guide says="看完例子，我們來動手試試看！" />
          </FadeIn>
        )}

        {step === 'interaction' && (
          <FadeIn key="interaction" style={styles.stack}>
            <T size="title" bold>
              {lesson.interaction.title}
            </T>
            <InteractionView key={lesson.id} data={lesson.interaction} onDone={() => go('quiz')} />
          </FadeIn>
        )}

        {step === 'quiz' && (
          <FadeIn key="quiz" style={styles.stack}>
            <T size="title" bold>
              小測驗
            </T>
            <QuizView key={lesson.id} quiz={lesson.quiz} onDone={finish} />
          </FadeIn>
        )}

        {step === 'done' && (
          <FadeIn key="done" style={styles.stack}>
            <View style={styles.celebrate}>
              <Robot size={140} mood="cheer" />
              <T size="title" bold style={{ textAlign: 'center' }}>
                這一課完成了！
              </T>
              <T color={colors.muted} style={{ textAlign: 'center' }}>
                你已經上完 {doneCount} / {allLessons.length} 課
              </T>
            </View>
            <T bold>把今天學到的一句話分享給家人：</T>
            <ShareCard heading={`今天學到：${lesson.title}`} body={takeaway(lesson)} />
            {allDone ? (
              <BigButton icon="🎓" label="領取結業證書" onPress={() => router.replace('/certificate')} />
            ) : nextId ? (
              <BigButton
                icon={nextLocked ? '🔓' : '▶️'}
                variant={nextLocked ? 'accent' : 'primary'}
                label={nextLocked ? '解鎖後繼續下一課' : '下一課'}
                onPress={() => router.replace(nextLocked ? '/unlock' : `/lesson/${nextId}`)}
              />
            ) : null}
            <BigButton variant="ghost" label="回到首頁" onPress={() => router.dismissTo('/')} />
          </FadeIn>
        )}
      </ScrollView>

      {step === 'read' && (
        <StickyFooter>
          <BigButton label="讀完了，下一步" onPress={() => go('example')} />
        </StickyFooter>
      )}
      {step === 'example' && (
        <StickyFooter>
          <BigButton label="來動手試試" onPress={() => go('interaction')} />
        </StickyFooter>
      )}
      {step === 'done' && <Confetti />}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: colors.background },
  close: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3ECE2' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 8, borderRadius: 4 },
  page: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  stack: { gap: 18 },
  listen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 20,
  },
  celebrate: { alignItems: 'center', gap: 6, paddingTop: 8, backgroundColor: colors.goldSoft, borderRadius: radius, padding: 20 },
});
