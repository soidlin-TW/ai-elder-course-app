import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Guide } from '@/components/Guide';
import { Pill, T } from '@/components/ui';
import { promptCategories, promptCount } from '@/content/extras';
import { FadeIn, PressableScale } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors, radius, shadow } from '@/lib/theme';

export default function Prompts() {
  const { unlocked } = useStore();
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Guide says={`這裡有 ${promptCount} 個寫好的問法。挑一個，換掉【括號】裡的字，複製貼到 AI 就能用。`} />
      <PressableScale accessibilityRole="button" accessibilityLabel="提問小幫手，四步驟組出好問題" onPress={() => router.push('/prompts/builder')} style={styles.builder}>
        <Text style={{ fontSize: 40 }}>🧩</Text>
        <View style={{ flex: 1, gap: 2 }}>
          <T size="large" bold color="#fff">
            提問小幫手
          </T>
          <T size="small" color="#fff">
            填四格，組出一句好問題，免費使用
          </T>
        </View>
        <T size="large" bold color="#fff">
          ›
        </T>
      </PressableScale>
      <View style={styles.grid}>
        {promptCategories.map((c, i) => (
          <FadeIn key={c.id} delay={i * 40} style={[styles.cell, i === promptCategories.length - 1 && i % 2 === 0 && { width: '100%' }]}>
            <PressableScale accessibilityRole="button" accessibilityLabel={c.title} onPress={() => router.push(`/prompts/${c.id}`)} style={styles.tile}>
              <Text style={{ fontSize: 36 }}>{c.icon}</Text>
              <T bold style={{ textAlign: 'center' }}>
                {c.title}
              </T>
              {unlocked ? (
                <T size="small" color={colors.muted}>
                  {c.prompts.length} 個範本
                </T>
              ) : (
                <Pill label="1 個免費" color={colors.accent} bg={colors.accentSoft} />
              )}
            </PressableScale>
          </FadeIn>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  cell: { width: '48.5%' },
  builder: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.primary, borderRadius: radius, padding: 18, ...shadow(2) },
  tile: { backgroundColor: colors.card, borderRadius: radius, padding: 16, minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 6, ...shadow(1) },
});
