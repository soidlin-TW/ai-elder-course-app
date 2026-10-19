import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Guide } from '@/components/Guide';
import { BigButton, Card, T } from '@/components/ui';
import { allLessons, findLesson, units } from '@/content';
import { APP_NAME } from '@/lib/config';
import { useStore } from '@/lib/store';
import { colors, radius } from '@/lib/theme';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { ready, completed, lastLessonId, unlocked } = useStore();
  if (!ready) return null;

  const doneCount = allLessons.filter((l) => completed[l.id]).length;
  const firstUndone = allLessons.find((l) => !completed[l.id]);
  const resume = lastLessonId && !completed[lastLessonId] ? findLesson(lastLessonId)?.lesson : firstUndone;
  const allDone = doneCount === allLessons.length;

  return (
    <ScrollView contentContainerStyle={[styles.page, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.header}>
        <T size="title" bold color={colors.primaryDark}>
          {APP_NAME}
        </T>
        <Link href="/settings" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="設定" style={styles.settings}>
            <T size="large">⚙️</T>
          </Pressable>
        </Link>
      </View>

      <Guide
        says={
          doneCount === 0
            ? '你好！我會一課一課陪你認識 AI，每課只要幾分鐘。我們從第一課開始吧！'
            : allDone
              ? '你把全部課程都上完了，真厲害！去領你的結業證書吧。'
              : `你已經上完 ${doneCount} 課了，今天也來一課吧！`
        }
      />

      <Card style={{ gap: 12 }}>
        <T size="small" color={colors.muted}>
          學習進度 {doneCount} / {allLessons.length} 課
        </T>
        <View style={styles.track}>
          <View style={[styles.bar, { width: `${(doneCount / allLessons.length) * 100}%` }]} />
        </View>
        {resume && <BigButton label={doneCount === 0 ? '開始第一課' : `繼續：${resume.title}`} onPress={() => router.push(`/lesson/${resume.id}`)} />}
        {allDone && <BigButton label="領取結業證書" onPress={() => router.push('/certificate')} />}
      </Card>

      {!unlocked && (
        <Pressable accessibilityRole="button" onPress={() => router.push('/unlock')} style={styles.promo}>
          <T bold color={colors.accent}>
            🔓 前 6 課免費試看（第 1 單元和第 2 單元前兩課）
          </T>
          <T size="small">解鎖全部 6 個單元、24 課，一次買斷，之後不再收費。</T>
        </Pressable>
      )}

      {units.map((u) => {
        const done = u.lessons.filter((l) => completed[l.id]).length;
        const open = unlocked || u.lessons.some((l) => l.free);
        return (
          <Pressable key={u.id} accessibilityRole="button" onPress={() => router.push(`/unit/${u.id}`)} style={styles.unit}>
            <View style={{ flex: 1, gap: 4 }}>
              <T size="small" color={colors.muted}>
                第 {u.id} 單元・{done} / {u.lessons.length} 課
              </T>
              <T size="large" bold>
                {u.title}
              </T>
            </View>
            <T size="large">{done === u.lessons.length ? '✅' : open ? '›' : '🔒'}</T>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 20, gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settings: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.primary },
  promo: { backgroundColor: '#FDEDE7', borderRadius: radius, padding: 16, gap: 4 },
  unit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
