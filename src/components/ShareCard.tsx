import * as Sharing from 'expo-sharing';
import { useRef, type ReactNode } from 'react';
import { Alert, StyleSheet, Text, View, type HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { BigButton } from './ui';
import { APP_NAME } from '@/lib/config';
import { colors, radius } from '@/lib/theme';

/**
 * A small picture card people forward to LINE groups. Fixed font sizes so the
 * image looks the same whatever the reader's text-size setting.
 */
export function ShareCard({ heading, body, buttonLabel = '分享到 LINE 給家人' }: { heading: string; body: string; buttonLabel?: string }) {
  const ref = useRef<HostInstance>(null);

  const share = async () => {
    try {
      const uri = await captureRef(ref, { format: 'png', quality: 1 });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('這台裝置不支援分享');
        return;
      }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: '分享小卡片' });
    } catch {
      Alert.alert('分享沒有完成', '請再試一次。');
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View ref={ref} collapsable={false} style={styles.card}>
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.body}>{body}</Text>
        <Text style={styles.footer}>來自 App「{APP_NAME}」・50+ 也學得會的 AI 課</Text>
      </View>
      <BigButton variant="secondary" label={buttonLabel} onPress={share} />
    </View>
  );
}

export function ShareCardFrame({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius,
    padding: 24,
    gap: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emoji: { fontSize: 44 },
  heading: { fontSize: 22, fontWeight: '700', color: colors.primaryDark, textAlign: 'center' },
  body: { fontSize: 22, lineHeight: 34, color: colors.text, textAlign: 'center' },
  footer: { fontSize: 14, color: colors.muted, marginTop: 8, textAlign: 'center' },
});
