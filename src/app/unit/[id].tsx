import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Bar, Card, Pill, T } from '@/components/ui';
import { units } from '@/content';
import { missions } from '@/content/extras';
import { LockedHint } from '@/components/LockedHint';
import { FadeIn, PressableScale } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors, radius, shadow, unitThemes } from '@/lib/theme';

export default function UnitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completed, unlocked, missionsDone, toggleMission } = useStore();
  const unit = units.find((u) => String(u.id) === id);
  if (!unit) return null;

  const t = unitThemes[unit.id];
  const done = unit.lessons.filter((l) => completed[l.id]).length;
  const currentIndex = unit.lessons.findIndex((l) => !completed[l.id]);
  const mission = missions.find((m) => m.unit === unit.id);
  const missionLocked = !unlocked && unit.lessons.some((l) => !l.free);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `第 ${unit.id} 單元` }} />
      <FadeIn>
        <View style={[styles.header, { backgroundColor: t.soft }]}>
          <Text style={{ fontSize: 44 }}>{t.icon}</Text>
          <T size="title" bold>
            {unit.title}
          </T>
          <T size="small" color={colors.muted}>
            完成 {done} / {unit.lessons.length} 課
          </T>
          <Bar progress={done / unit.lessons.length} color={t.color} track="rgba(255,255,255,0.8)" />
        </View>
      </FadeIn>

      <View>
        {unit.lessons.map((l, i) => {
          const locked = !unlocked && !l.free;
          const isDone = !!completed[l.id];
          const current = i === currentIndex && !locked;
          const last = i === unit.lessons.length - 1;
          return (
            <FadeIn key={l.id} delay={80 + i * 60} style={styles.row}>
              <View style={styles.rail}>
                <View style={[styles.node, isDone ? { backgroundColor: t.color } : current ? { borderColor: t.color, borderWidth: 3, backgroundColor: '#fff' } : styles.nodeIdle]}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: isDone ? '#fff' : current ? t.color : colors.muted }}>{isDone ? '✓' : locked ? '🔒' : i + 1}</Text>
                </View>
                {!last && <View style={[styles.line, { backgroundColor: isDone ? t.color : colors.border }]} />}
              </View>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={`第 ${i + 1} 課，${l.title}${isDone ? '，已完成' : ''}${locked ? '，需要解鎖' : ''}`}
                onPress={() => router.push(locked ? '/unlock' : `/lesson/${l.id}`)}
                outerStyle={{ flex: 1 }}
                style={[styles.lesson, current && { borderColor: t.color, borderWidth: 2 }, locked && { opacity: 0.75 }]}
              >
                <View style={{ flex: 1, gap: 4 }}>
                  <T bold>{l.title}</T>
                  {current && <Pill label={done === 0 ? '從這裡開始' : '下一課'} color={t.color} bg={t.soft} />}
                  {!unlocked && l.free && !current && <Pill label="免費試看" color={colors.accent} bg={colors.accentSoft} />}
                </View>
                <T size="large" color={colors.muted}>
                  ›
                </T>
              </PressableScale>
            </FadeIn>
          );
        })}
      </View>

      {mission &&
        (missionLocked ? (
          <LockedHint text={`本單元生活任務：${mission.title}`} />
        ) : (
          <Card style={{ gap: 12, borderTopWidth: 6, borderTopColor: t.color }}>
            <T size="small" bold color={t.color}>
              🎯 生活任務
            </T>
            <T size="large" bold>
              {mission.title}
            </T>
            {mission.steps.map((step, i) => {
              const key = `m${unit.id}-${i}`;
              const on = !!missionsDone[key];
              return (
                <PressableScale key={key} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={step} onPress={() => toggleMission(key)} style={styles.check}>
                  <View style={[styles.box, on && { backgroundColor: t.color, borderColor: t.color }]}>{on && <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text>}</View>
                  <T style={{ flex: 1, textDecorationLine: on ? 'line-through' : 'none' }} color={on ? colors.muted : colors.text}>
                    {step}
                  </T>
                </PressableScale>
              );
            })}
            <T size="small" color={colors.muted}>
              學完把它用在生活裡，才是真的學會了。
            </T>
          </Card>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 20, paddingBottom: 48 },
  header: { borderRadius: radius, padding: 20, gap: 8 },
  row: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center', width: 44 },
  node: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 44 },
  box: { width: 30, height: 30, borderRadius: 8, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  nodeIdle: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.border },
  line: { flex: 1, width: 3, borderRadius: 2, marginVertical: 4 },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 76,
    backgroundColor: colors.card,
    borderRadius: radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow(1),
  },
});
