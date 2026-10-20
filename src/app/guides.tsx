import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Guide } from '@/components/Guide';
import { Card, T } from '@/components/ui';
import { guides } from '@/content/extras';
import { FadeIn, PressableScale } from '@/lib/motion';
import { colors, radius } from '@/lib/theme';

export default function Guides() {
  const [openId, setOpenId] = useState<string | null>(guides[0].id);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Guide says="挑一個 AI 開始就好，三個都可以免費使用。下載時一定要認明開發者，避免裝到山寨 App。" />
      {guides.map((g, gi) => {
        const open = openId === g.id;
        return (
          <FadeIn key={g.id} delay={gi * 60}>
            <Card style={{ gap: 12, padding: 0, overflow: 'hidden' }}>
              <PressableScale
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={`${g.name} 上手步驟`}
                onPress={() => setOpenId(open ? null : g.id)}
                style={[styles.head, { borderLeftColor: g.color }]}
              >
                <Text style={{ fontSize: 34 }}>{g.icon}</Text>
                <View style={{ flex: 1 }}>
                  <T size="large" bold>
                    {g.name}
                  </T>
                  <T size="small" color={colors.muted}>
                    開發者：{g.maker}
                  </T>
                </View>
                <T size="large" color={colors.muted}>
                  {open ? '︿' : '﹀'}
                </T>
              </PressableScale>
              {open && (
                <View style={styles.body}>
                  <T>{g.intro}</T>
                  {g.steps.map((s, i) => (
                    <View key={s} style={styles.step}>
                      <View style={[styles.num, { backgroundColor: g.color }]}>
                        <Text style={styles.numText}>{i + 1}</Text>
                      </View>
                      <T style={{ flex: 1 }}>{s}</T>
                    </View>
                  ))}
                  <View style={styles.tips}>
                    {g.tips.map((t) => (
                      <T key={t} size="small">
                        💡 {t}
                      </T>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          </FadeIn>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderLeftWidth: 6 },
  body: { paddingHorizontal: 18, paddingBottom: 18, gap: 12 },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  num: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  numText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  tips: { backgroundColor: colors.goldSoft, borderRadius: radius - 6, padding: 12, gap: 6 },
});
