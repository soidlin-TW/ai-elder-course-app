import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { Guide } from '@/components/Guide';
import { ShareCard } from '@/components/ShareCard';
import { BigButton, T } from '@/components/ui';
import { allLessons } from '@/content';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function Certificate() {
  const { completed } = useStore();
  const done = allLessons.filter((l) => completed[l.id]).length;
  const allDone = done === allLessons.length;
  const date = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!allDone) {
    return (
      <ScrollView contentContainerStyle={styles.page}>
        <Guide says={`還差 ${allLessons.length - done} 課就能拿到結業證書，加油！`} />
        <BigButton label="回到首頁" onPress={() => router.dismissTo('/')} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <T size="title" bold color={colors.primaryDark} style={{ textAlign: 'center' }}>
        🎓 恭喜結業！
      </T>
      <ShareCard
        heading="AI 入門課程 結業證書"
        body={`完成全部 ${allLessons.length} 課\n會用 AI、也懂得防範 AI 詐騙\n${date}`}
        buttonLabel="把證書分享給家人"
      />
      <Guide says="謝謝你一路學到最後！有空回來複習，或推薦給身邊的朋友一起學。" />
      <BigButton variant="ghost" label="回到首頁" onPress={() => router.dismissTo('/')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
});
