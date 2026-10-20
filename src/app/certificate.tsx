import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, type HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Confetti } from '@/components/Confetti';
import { Guide } from '@/components/Guide';
import { ProgressRing } from '@/components/ProgressRing';
import { Robot } from '@/components/Robot';
import { BigButton, T } from '@/components/ui';
import { allLessons } from '@/content';
import { APP_NAME, GUIDE_NAME } from '@/lib/config';
import { useStore } from '@/lib/store';
import { colors, radius, shadow } from '@/lib/theme';

export default function Certificate() {
  const { completed } = useStore();
  const ref = useRef<HostInstance>(null);
  const done = allLessons.filter((l) => completed[l.id]).length;
  const allDone = done === allLessons.length;
  const date = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!allDone) {
    return (
      <ScrollView contentContainerStyle={[styles.page, { alignItems: 'center' }]}>
        <ProgressRing progress={done / allLessons.length} color={colors.primary} track={colors.primarySoft} size={160} stroke={14}>
          <T size="title" bold color={colors.primaryDark}>
            {done}/{allLessons.length}
          </T>
        </ProgressRing>
        <Guide says={`還差 ${allLessons.length - done} 課就能拿到結業證書，加油！`} />
        <BigButton label="回到首頁" onPress={() => router.dismissTo('/')} style={{ alignSelf: 'stretch' }} />
      </ScrollView>
    );
  }

  const share = async () => {
    try {
      const uri = await captureRef(ref, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '分享結業證書' });
    } catch {
      Alert.alert('分享沒有完成', '請再試一次。');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.page}>
        <View ref={ref} collapsable={false} style={styles.cert}>
          <View style={styles.inner}>
            <Text style={styles.ribbon}>🎓</Text>
            <Text style={styles.title}>結業證書</Text>
            <Text style={styles.sub}>AI 入門課程</Text>
            <View style={styles.rule} />
            <Text style={styles.text}>恭喜完成全部 {allLessons.length} 課</Text>
            <Text style={styles.text}>會用 AI，也懂得防範 AI 詐騙</Text>
            <View style={styles.rule} />
            <View style={styles.sign}>
              <Robot size={52} mood="cheer" blink={false} />
              <View>
                <Text style={styles.small}>講師 {GUIDE_NAME}</Text>
                <Text style={styles.small}>{date}</Text>
              </View>
            </View>
            <Text style={styles.brand}>App「{APP_NAME}」</Text>
          </View>
        </View>
        <BigButton variant="accent" icon="📤" label="把證書分享給家人" onPress={share} />
        <Guide mood="cheer" says="謝謝你一路學到最後！有空回來複習，或推薦給朋友一起學。" />
        <BigButton variant="ghost" label="回到首頁" onPress={() => router.dismissTo('/')} />
      </ScrollView>
      <Confetti />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 18, paddingBottom: 48 },
  cert: { backgroundColor: '#FFFDF7', borderRadius: radius, padding: 10, ...shadow(2) },
  inner: { borderWidth: 2, borderColor: colors.gold, borderRadius: radius - 6, padding: 22, alignItems: 'center', gap: 6 },
  ribbon: { fontSize: 48 },
  title: { fontSize: 32, fontWeight: '800', color: colors.primaryDark, letterSpacing: 6 },
  sub: { fontSize: 16, color: colors.muted, letterSpacing: 2 },
  rule: { width: '60%', height: 1, backgroundColor: colors.gold, marginVertical: 10 },
  text: { fontSize: 20, lineHeight: 32, color: colors.text, fontWeight: '600', textAlign: 'center' },
  sign: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  small: { fontSize: 15, color: colors.muted },
  brand: { fontSize: 13, color: colors.muted, marginTop: 10 },
});
