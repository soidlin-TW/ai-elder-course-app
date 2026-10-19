import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BigButton, Card, T } from '@/components/ui';
import { APP_NAME, PRIVACY_URL, SUPPORT_EMAIL } from '@/lib/config';
import { usePurchase } from '@/lib/purchase';
import { speak } from '@/lib/speech';
import { useStore, type FontScale, type SpeechRate } from '@/lib/store';
import { colors, radius } from '@/lib/theme';

function Choice<V>({ options, value, onChange }: { options: { label: string; value: V }[]; value: V; onChange: (v: V) => void }) {
  return (
    <View style={styles.choices}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.label}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.choice, on && styles.choiceOn]}
          >
            <T bold={on} color={on ? '#fff' : colors.text} style={{ textAlign: 'center' }}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Settings() {
  const { fontScale, setFontScale, speechRate, setSpeechRate, unlocked } = useStore();
  const { restore, busy } = usePurchase();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Card style={{ gap: 12 }}>
        <T bold>字體大小</T>
        <Choice<FontScale>
          options={[
            { label: '標準', value: 1 },
            { label: '大', value: 1.2 },
            { label: '特大', value: 1.4 },
          ]}
          value={fontScale}
          onChange={setFontScale}
        />
        <T size="small" color={colors.muted}>
          這段字會跟著變大變小，選你看起來最舒服的。
        </T>
      </Card>

      <Card style={{ gap: 12 }}>
        <T bold>朗讀速度</T>
        <Choice<SpeechRate>
          options={[
            { label: '慢', value: 0.8 },
            { label: '普通', value: 1 },
            { label: '快', value: 1.2 },
          ]}
          value={speechRate}
          onChange={(r) => {
            setSpeechRate(r);
            speak('這是朗讀速度的範例。', r);
          }}
        />
      </Card>

      <Card style={{ gap: 8 }}>
        <T bold>購買</T>
        <T size="small" color={colors.muted}>
          {unlocked ? '你已經解鎖完整課程，謝謝支持！' : '換了新手機？用同一個 Apple ID 登入後按下面的按鈕。'}
        </T>
        <BigButton variant="secondary" label="恢復購買" onPress={restore} disabled={busy} />
      </Card>

      <Card style={{ gap: 8 }}>
        <BigButton variant="ghost" label="隱私權政策" onPress={() => Linking.openURL(PRIVACY_URL)} />
        <BigButton
          variant="ghost"
          label="聯絡我們"
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${APP_NAME} 意見回饋`)}`)}
        />
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
    flex: 1,
    minHeight: 56,
    justifyContent: 'center',
    borderRadius: radius,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  choiceOn: { backgroundColor: colors.primary },
});
