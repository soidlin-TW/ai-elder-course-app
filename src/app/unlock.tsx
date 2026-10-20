import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Robot } from '@/components/Robot';
import { BigButton, Card, StickyFooter, T } from '@/components/ui';
import { allLessons, units } from '@/content';
import { FadeIn, Float, PressableScale } from '@/lib/motion';
import { usePurchase } from '@/lib/purchase';
import { useStore } from '@/lib/store';
import { colors, heroGradient, radius, shadow, unitThemes } from '@/lib/theme';

const PERKS = [
  { icon: '📚', title: `全部 ${allLessons.length} 課`, text: '從「AI 是什麼」學到「看穿 AI 詐騙」' },
  { icon: '🛡️', title: '防詐專章', text: '認出假聲音、假影片，也能教爸媽' },
  { icon: '🔊', title: '大字又會朗讀', text: '眼睛累了，用聽的也能學' },
  { icon: '💳', title: '一次買斷', text: '不訂閱、不自動扣款，新課免費更新' },
];

export default function Unlock() {
  const insets = useSafeAreaInsets();
  const { unlocked } = useStore();
  const { price, busy, buy, restore } = usePurchase();

  useEffect(() => {
    if (unlocked) router.back();
  }, [unlocked]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={heroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { paddingTop: insets.top + 8 }]}>
          <PressableScale accessibilityRole="button" accessibilityLabel="關閉" onPress={() => router.back()} style={styles.close}>
            <Text style={{ fontSize: 20, color: '#fff', fontWeight: '700' }}>✕</Text>
          </PressableScale>
          <Float style={{ alignSelf: 'center' }}>
            <Robot size={120} mood="cheer" />
          </Float>
          <T size="title" bold color="#fff" style={{ textAlign: 'center' }}>
            解鎖完整課程
          </T>
          <T color="rgba(255,255,255,0.92)" style={{ textAlign: 'center' }}>
            前面的課覺得有幫助嗎？剩下的我陪你一起學完。
          </T>
        </LinearGradient>

        <View style={styles.body}>
          <FadeIn>
            <Card style={styles.priceCard}>
              <T size="small" color={colors.muted}>
                一次付費・永久使用
              </T>
              <Text style={styles.price}>{price}</Text>
              <T size="small" color={colors.muted}>
                平均每課不到 {Math.ceil(parseInt(price.replace(/[^0-9]/g, '') || '199', 10) / allLessons.length)} 元
              </T>
            </Card>
          </FadeIn>

          <View style={styles.perks}>
            {PERKS.map((p, i) => (
              <FadeIn key={p.title} delay={60 + i * 50} style={styles.perkWrap}>
                <View style={styles.perk}>
                  <Text style={{ fontSize: 30 }}>{p.icon}</Text>
                  <T bold>{p.title}</T>
                  <T size="small" color={colors.muted}>
                    {p.text}
                  </T>
                </View>
              </FadeIn>
            ))}
          </View>

          <Card style={{ gap: 12 }}>
            <T bold>課程目錄</T>
            {units.map((u) => (
              <View key={u.id} style={styles.unitRow}>
                <View style={[styles.unitIcon, { backgroundColor: unitThemes[u.id].soft }]}>
                  <Text style={{ fontSize: 20 }}>{unitThemes[u.id].icon}</Text>
                </View>
                <T style={{ flex: 1 }}>{u.title}</T>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      <StickyFooter>
        <BigButton variant="accent" label={busy ? '處理中…' : `用 ${price} 解鎖全部課程`} onPress={buy} disabled={busy} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <BigButton variant="ghost" label="恢復購買" onPress={restore} disabled={busy} style={{ minHeight: 44, paddingVertical: 4 }} />
          <BigButton variant="ghost" label="先不要" onPress={() => router.back()} style={{ minHeight: 44, paddingVertical: 4 }} />
        </View>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 52, gap: 8, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  close: { alignSelf: 'flex-end', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 20, gap: 16, marginTop: -32 },
  priceCard: { alignItems: 'center', gap: 2 },
  price: { fontSize: 44, fontWeight: '800', color: colors.accent, letterSpacing: 1 },
  perks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
  perkWrap: { width: '48.5%' },
  perk: { backgroundColor: colors.card, borderRadius: radius, padding: 14, gap: 4, minHeight: 168, ...shadow(1) },
  unitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  unitIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
