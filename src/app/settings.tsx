import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Robot } from '@/components/Robot';
import { BigButton, Card, T } from '@/components/ui';
import { APP_NAME, GUIDE_NAME, PRIVACY_URL, SUPPORT_EMAIL } from '@/lib/config';
import { PressableScale } from '@/lib/motion';
import { usePurchase } from '@/lib/purchase';
import { speak } from '@/lib/speech';
import { useStore, type FontScale, type SpeechRate } from '@/lib/store';
import { colors, radius } from '@/lib/theme';

function Choice<V>({ options, value, onChange }: { options: { label: string; value: V; sample?: number }[]; value: V; onChange: (v: V) => void }) {
  return (
    <View style={styles.choices} accessibilityRole="radiogroup">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <PressableScale
            key={o.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            outerStyle={{ flex: 1 }}
            style={[styles.choice, on && styles.choiceOn]}
          >
            {o.sample && <Text style={{ fontSize: o.sample, fontWeight: '700', color: on ? '#fff' : colors.text }}>字</Text>}
            <Text style={{ fontSize: 17, fontWeight: on ? '700' : '500', color: on ? '#fff' : colors.text }}>{o.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

function Row({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.row} haptic={false}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <T style={{ flex: 1 }}>{label}</T>
      <T color={colors.muted}>›</T>
    </PressableScale>
  );
}

export default function Settings() {
  const { fontScale, setFontScale, speechRate, setSpeechRate, unlocked } = useStore();
  const { restore, busy } = usePurchase();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Card style={{ gap: 14 }}>
        <T bold>字體大小</T>
        <Choice<FontScale>
          options={[
            { label: '標準', value: 1, sample: 18 },
            { label: '大', value: 1.2, sample: 24 },
            { label: '特大', value: 1.4, sample: 30 },
          ]}
          value={fontScale}
          onChange={setFontScale}
        />
        <View style={styles.preview}>
          <Robot size={44} blink={false} />
          <T style={{ flex: 1 }}>這段字會跟著變大變小，選你看起來最舒服的。</T>
        </View>
      </Card>

      <Card style={{ gap: 14 }}>
        <T bold>朗讀速度</T>
        <Choice<SpeechRate>
          options={[
            { label: '🐢 慢', value: 0.8 },
            { label: '普通', value: 1 },
            { label: '🐇 快', value: 1.2 },
          ]}
          value={speechRate}
          onChange={(r) => {
            setSpeechRate(r);
            speak(`你好，我是${GUIDE_NAME}，這是朗讀速度的範例。`, r);
          }}
        />
        <T size="small" color={colors.muted}>
          點一下就會試聽。
        </T>
      </Card>

      <Card style={{ gap: 10 }}>
        <T bold>購買</T>
        <T size="small" color={colors.muted}>
          {unlocked ? '✅ 你已經解鎖完整課程，謝謝支持！' : '換了新手機？用同一個 Apple ID 登入後按下面的按鈕。'}
        </T>
        <BigButton variant="secondary" label="恢復購買" onPress={restore} disabled={busy} />
      </Card>

      <Card style={{ paddingVertical: 6 }}>
        <Row icon="🔒" label="隱私權政策" onPress={() => Linking.openURL(PRIVACY_URL)} />
        <View style={styles.sep} />
        <Row icon="✉️" label="聯絡我們" onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${APP_NAME} 意見回饋`)}`)} />
      </Card>

      <T size="small" color={colors.muted} style={{ textAlign: 'center' }}>
        {APP_NAME} 版本 {Constants.expoConfig?.version ?? ''}
      </T>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  choices: { flexDirection: 'row', gap: 10 },
  choice: {
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius - 4,
    backgroundColor: '#F4EEE5',
    paddingVertical: 8,
  },
  choiceOn: { backgroundColor: colors.primary },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primarySoft, borderRadius: radius - 4, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 34 },
});
