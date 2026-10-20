import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressRing } from '@/components/ProgressRing';
import { Robot } from '@/components/Robot';
import { Bar, BigButton, Card, Pill, T } from '@/components/ui';
import { allLessons, findLesson, units } from '@/content';
import { APP_NAME, GUIDE_NAME } from '@/lib/config';
import { FadeIn, Float, PressableScale } from '@/lib/motion';
import { usePurchase } from '@/lib/purchase';
import { dayKey, useStore } from '@/lib/store';
import { colors, heroGradient, radius, shadow, unitThemes } from '@/lib/theme';

const TOOLS = [
  { href: '/prompts', icon: '📋', title: '提問範本', text: '40 個複製就能用的問法', bg: '#E3EDFB' },
  { href: '/scam', icon: '🛡️', title: '防詐工具箱', text: '165、暗號卡、情境練習', bg: '#FBE6E3' },
  { href: '/guides', icon: '📱', title: 'AI 上手指南', text: '一步步裝好第一個 AI', bg: '#E4F2E4' },
  { href: '/glossary', icon: '📖', title: 'AI 小字典', text: '30 個名詞白話解釋', bg: '#FCEEDF' },
] as const;

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? '早安' : h < 18 ? '午安' : '晚安';
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { ready, completed, lastLessonId, unlocked, reviewDay, reviewStreak } = useStore();
  const { price } = usePurchase();
  if (!ready) return null;

  const doneCount = allLessons.filter((l) => completed[l.id]).length;
  const firstUndone = allLessons.find((l) => !completed[l.id]);
  const resumeId = lastLessonId && !completed[lastLessonId] ? lastLessonId : firstUndone?.id;
  const resume = resumeId ? findLesson(resumeId) : undefined;
  const allDone = doneCount === allLessons.length;
  const resumeLocked = resume ? !unlocked && !resume.lesson.free : false;

  const says =
    doneCount === 0
      ? `我是${GUIDE_NAME}，每課只要幾分鐘，我們從第一課開始吧！`
      : allDone
        ? '全部上完了，真厲害！去領你的結業證書吧。'
        : `你已經上完 ${doneCount} 課了，今天也來一課吧！`;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 12 }]}>
        <View style={styles.bubbleA} />
        <View style={styles.bubbleB} />
        <View style={styles.topRow}>
          <Text style={styles.brand}>{APP_NAME}</Text>
          <PressableScale accessibilityRole="button" accessibilityLabel="設定" onPress={() => router.push('/settings')} style={styles.iconBtn}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
            <Text style={styles.iconLabel}>設定</Text>
          </PressableScale>
        </View>
        <View style={styles.heroRow}>
          <Float>
            <Robot size={108} mood={allDone ? 'cheer' : 'happy'} />
          </Float>
          <View style={{ flex: 1, gap: 4 }}>
            <T size="large" bold color="#fff">
              {greeting()}！
            </T>
            <T color="rgba(255,255,255,0.92)">{says}</T>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <FadeIn>
          <Card style={styles.resumeCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <ProgressRing progress={doneCount / allLessons.length} color={colors.primary} track={colors.primarySoft} size={84} stroke={9}>
                <T bold color={colors.primaryDark}>
                  {Math.round((doneCount / allLessons.length) * 100)}%
                </T>
              </ProgressRing>
              <View style={{ flex: 1, gap: 2 }}>
                <T size="small" color={colors.muted}>
                  {allDone ? '課程進度' : doneCount === 0 ? '第一課' : '接著上'}
                </T>
                {allDone ? (
                  <T size="large" bold>
                    {allLessons.length} 課全部完成
                  </T>
                ) : (
                  resume && (
                    <>
                      <T size="large" bold numberOfLines={2}>
                        {resume.lesson.title}
                      </T>
                      <T size="small" color={colors.muted}>
                        第 {resume.unit.id} 單元・第 {resume.index + 1} 課
                      </T>
                    </>
                  )
                )}
              </View>
            </View>
            {allDone ? (
              <BigButton icon="🎓" label="領取結業證書" onPress={() => router.push('/certificate')} />
            ) : (
              resume && (
                <BigButton
                  icon={resumeLocked ? '🔓' : '▶️'}
                  label={resumeLocked ? '解鎖後繼續上課' : doneCount === 0 ? '開始第一課' : '繼續上課'}
                  onPress={() => router.push(resumeLocked ? '/unlock' : `/lesson/${resume.lesson.id}`)}
                />
              )
            )}
          </Card>
        </FadeIn>

        <FadeIn delay={60}>
          <PressableScale accessibilityRole="button" accessibilityLabel="每日複習" onPress={() => router.push('/review')} style={styles.review}>
            <Text style={{ fontSize: 34 }}>{reviewDay === dayKey() ? '🔥' : '📝'}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <T bold>{reviewDay === dayKey() ? `今天複習完了・連續 ${reviewStreak} 天` : '每日複習 3 題'}</T>
              <T size="small" color={colors.muted}>
                {doneCount === 0 ? '上完第一課就能開始' : '每天幾分鐘，學過的不會忘'}
              </T>
            </View>
            <T size="large" color={colors.muted}>
              ›
            </T>
          </PressableScale>
        </FadeIn>

        <T size="large" bold style={{ marginTop: 8 }}>
          實用工具箱
        </T>
        <View style={styles.tools}>
          {TOOLS.map((tool, i) => (
            <FadeIn key={tool.href} delay={100 + i * 40} style={styles.toolCell}>
              <PressableScale accessibilityRole="button" accessibilityLabel={tool.title} onPress={() => router.push(tool.href)} style={[styles.tool, { backgroundColor: tool.bg }]}>
                <Text style={{ fontSize: 34 }}>{tool.icon}</Text>
                <T bold>{tool.title}</T>
                <T size="small" color={colors.muted}>
                  {tool.text}
                </T>
              </PressableScale>
            </FadeIn>
          ))}
        </View>

        {!unlocked && (
          <FadeIn delay={80}>
            <PressableScale accessibilityRole="button" onPress={() => router.push('/unlock')} style={styles.promo}>
              <Text style={{ fontSize: 32 }}>🎁</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <T bold color={colors.accent}>
                  前 6 課免費試看
                </T>
                <T size="small">解鎖 24 課、40 個提問範本和防詐練習，只要 {price}，一次買斷。</T>
              </View>
              <T size="large" color={colors.accent}>
                ›
              </T>
            </PressableScale>
          </FadeIn>
        )}

        <T size="large" bold style={{ marginTop: 8 }}>
          課程單元
        </T>

        {units.map((u, i) => {
          const t = unitThemes[u.id];
          const done = u.lessons.filter((l) => completed[l.id]).length;
          const freeCount = u.lessons.filter((l) => l.free).length;
          const finished = done === u.lessons.length;
          const locked = !unlocked && freeCount === 0;
          return (
            <FadeIn key={u.id} delay={120 + i * 50}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={`第 ${u.id} 單元，${u.title}，完成 ${done} 課，共 ${u.lessons.length} 課${locked ? '，需要解鎖' : ''}`}
                onPress={() => router.push(`/unit/${u.id}`)}
                style={styles.unit}
              >
                <View style={[styles.unitIcon, { backgroundColor: t.soft }]}>
                  <Text style={{ fontSize: 30 }}>{t.icon}</Text>
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <T size="small" bold color={t.color}>
                      第 {u.id} 單元
                    </T>
                    {!unlocked && freeCount > 0 && <Pill label={freeCount === u.lessons.length ? '免費' : `${freeCount} 課免費`} color={colors.accent} bg={colors.accentSoft} />}
                  </View>
                  <T bold>{u.title}</T>
                  <Bar progress={done / u.lessons.length} color={t.color} track={t.soft} height={8} />
                </View>
                <Text style={{ fontSize: 22, opacity: locked ? 1 : 0.6 }}>{finished ? '✅' : locked ? '🔒' : '›'}</Text>
              </PressableScale>
            </FadeIn>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 20, paddingBottom: 56, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  bubbleA: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.08)', top: -60, right: -60 },
  bubbleB: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)', bottom: -40, left: -30 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  iconBtn: { flexDirection: 'row', gap: 6, height: 48, paddingHorizontal: 16, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  iconLabel: { fontSize: 17, fontWeight: '700', color: colors.primaryDark },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  body: { paddingHorizontal: 20, gap: 14, marginTop: -36 },
  resumeCard: { gap: 16, ...shadow(3) },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.accentSoft, borderRadius: radius, padding: 16, borderWidth: 1.5, borderColor: '#F6CDBF' },
  review: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.goldSoft, borderRadius: radius, padding: 16 },
  tools: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  toolCell: { width: '48.5%' },
  tool: { borderRadius: radius, padding: 16, gap: 4, minHeight: 150 },
  unit: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radius, padding: 16, ...shadow(1) },
  unitIcon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
