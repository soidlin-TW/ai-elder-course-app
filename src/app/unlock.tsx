import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Guide } from '@/components/Guide';
import { BigButton, Card, T } from '@/components/ui';
import { allLessons, units } from '@/content';
import { usePurchase } from '@/lib/purchase';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

const PERKS = [
  '6 個單元、24 課，從「AI 是什麼」到「看穿 AI 詐騙」',
  '每課都有互動練習和小測驗，學了就會用',
  '大字體、可朗讀，不用打字也能學',
  '一次買斷，之後新增的課程也免費更新',
  '同一個 Apple ID 的 iPhone、iPad 都能用',
];

export default function Unlock() {
  const { unlocked } = useStore();
  const { price, busy, buy, restore } = usePurchase();

  useEffect(() => {
    if (unlocked) router.back();
  }, [unlocked]);

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Guide says="前面幾課覺得有幫助嗎？解鎖後我陪你把剩下的課程都學完，特別是怎麼保護自己不被 AI 詐騙。" />
      <Card style={{ gap: 12 }}>
        <T size="large" bold>
          完整課程包含
        </T>
        {PERKS.map((p) => (
          <View key={p} style={styles.perk}>
            <T color={colors.correct}>✔</T>
            <T style={{ flex: 1 }}>{p}</T>
          </View>
        ))}
      </Card>
      <Card style={{ gap: 6 }}>
        <T size="small" color={colors.muted}>
          課程目錄
        </T>
        {units.map((u) => (
          <T key={u.id}>
            {u.id}. {u.title}
          </T>
        ))}
      </Card>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <T size="title" bold color={colors.primaryDark}>
          {price}
        </T>
        <T size="small" color={colors.muted}>
          一次付費，永久使用・共 {allLessons.length} 課
        </T>
      </View>
      <BigButton label={busy ? '處理中…' : `用 ${price} 解鎖全部課程`} onPress={buy} disabled={busy} />
      <BigButton variant="ghost" label="我之前買過了（恢復購買）" onPress={restore} disabled={busy} />
      <BigButton variant="ghost" label="先不要" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  perk: { flexDirection: 'row', gap: 10 },
});
