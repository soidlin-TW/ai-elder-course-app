import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, type HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Robot } from '@/components/Robot';
import { BigButton, Card, T } from '@/components/ui';
import { FREE_SCENARIOS, scamKit } from '@/content/extras';
import { APP_NAME } from '@/lib/config';
import { FadeIn } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors, fontSize, radius, shadow } from '@/lib/theme';

export default function ScamKit() {
  const { familyQuestion, setFamilyQuestion, fontScale, unlocked } = useStore();
  const card = useRef<HostInstance>(null);

  const call165 = () =>
    Alert.alert('撥打 165 反詐騙專線', '免付費，24 小時都有人接聽。', [
      { text: '取消', style: 'cancel' },
      { text: '撥打', onPress: () => Linking.openURL('tel:165') },
    ]);

  const shareCard = async () => {
    try {
      const uri = await captureRef(card, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '分享防詐小卡' });
    } catch {
      Alert.alert('分享沒有完成', '請再試一次。');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <FadeIn>
        <View style={styles.sos}>
          <Text style={{ fontSize: 40 }}>🚨</Text>
          <View style={{ flex: 1, gap: 2 }}>
            <T size="large" bold color="#fff">
              覺得怪怪的？
            </T>
            <T color="rgba(255,255,255,0.92)">先掛斷，打 165 問問看。</T>
          </View>
        </View>
        <BigButton variant="accent" icon="📞" label="撥打 165 反詐騙專線" onPress={call165} style={{ marginTop: -28, marginHorizontal: 16 }} />
      </FadeIn>

      <T size="large" bold>
        接到可疑電話或訊息時
      </T>
      {scamKit.checklist.map((c, i) => (
        <FadeIn key={c.title} delay={i * 40}>
          <Card style={styles.step}>
            <View style={styles.num}>
              <Text style={{ fontSize: 24 }}>{c.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T bold>
                {i + 1}. {c.title}
              </T>
              <T size="small">{c.text}</T>
            </View>
          </Card>
        </FadeIn>
      ))}

      <Card style={{ gap: 10, backgroundColor: colors.wrongSoft }}>
        <T bold color={colors.wrong}>
          聽到這些話，八成是詐騙
        </T>
        {scamKit.redFlags.map((f) => (
          <T key={f} size="small">
            ⚠️ {f}
          </T>
        ))}
      </Card>

      <T size="large" bold>
        家庭防詐暗號
      </T>
      <T>{scamKit.familyCode.intro}</T>
      <Card style={{ gap: 10 }}>
        <T size="small" bold>
          我們家的暗號問題（答案當面說，不要寫下來）
        </T>
        <TextInput
          value={familyQuestion}
          onChangeText={setFamilyQuestion}
          placeholder="例如：我們家第一隻狗叫什麼名字？"
          placeholderTextColor={colors.muted}
          style={[styles.input, { fontSize: fontSize.body * fontScale }]}
          accessibilityLabel="家庭暗號問題"
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {scamKit.familyCode.examples.map((e) => (
            <BigButton key={e} variant="secondary" label={e} onPress={() => setFamilyQuestion(e)} style={{ minHeight: 44, paddingVertical: 6 }} />
          ))}
        </View>
      </Card>

      <View ref={card} collapsable={false} style={styles.shareCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Robot size={52} blink={false} />
          <Text style={styles.shareTitle}>我們家的防詐約定</Text>
        </View>
        {scamKit.familyCode.rules.map((r, i) => (
          <Text key={r} style={styles.shareRule}>
            {i + 1}. {r}
          </Text>
        ))}
        <Text style={styles.shareRule}>5. 有疑問，一起打 165 問</Text>
        <Text style={styles.shareFoot}>來自 App「{APP_NAME}」</Text>
      </View>
      <BigButton icon="📤" label="把防詐約定傳到家族群組" onPress={shareCard} />

      <Card style={{ gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 40 }}>🕵️</Text>
        <T size="large" bold>
          這是詐騙嗎？情境練習
        </T>
        <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
          {scamKit.scenarios.length} 個真實常見的情境，練習一眼看出破綻。{unlocked ? '' : `前 ${FREE_SCENARIOS} 題免費。`}
        </T>
        <BigButton label="開始練習" onPress={() => router.push('/scam/quiz')} style={{ alignSelf: 'stretch' }} outerStyle={{ alignSelf: 'stretch' }} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 14, paddingBottom: 48 },
  sos: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.wrong, borderRadius: radius, padding: 20, paddingBottom: 44 },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 16 },
  num: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: '#F7F2EA', borderRadius: radius - 6, padding: 14, color: colors.text, minHeight: 56 },
  shareCard: { backgroundColor: '#FFFDF7', borderRadius: radius, padding: 20, gap: 8, borderWidth: 2, borderColor: colors.gold, ...shadow(1) },
  shareTitle: { fontSize: 22, fontWeight: '800', color: colors.primaryDark },
  shareRule: { fontSize: 19, lineHeight: 30, color: colors.text },
  shareFoot: { fontSize: 13, color: colors.muted, marginTop: 6 },
});
