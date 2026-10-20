import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Alert, StyleSheet, Text, View, type HostInstance } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Robot } from './Robot';
import { BigButton } from './ui';
import { APP_NAME } from '@/lib/config';
import { colors, radius, shadow } from '@/lib/theme';

/**
 * A picture card people forward to LINE groups. Fixed font sizes so the image looks the
 * same whatever the reader's text-size setting.
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
      <View ref={ref} collapsable={false} style={styles.frame}>
        <LinearGradient colors={['#E6F6F3', '#FFF8EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={styles.circle} />
          <View style={styles.head}>
            <Robot size={56} blink={false} />
            <Text style={styles.heading}>{heading}</Text>
          </View>
          <Text style={styles.quote}>“</Text>
          <Text style={styles.body}>{body}</Text>
          <View style={styles.footer}>
            <Text style={styles.footerText}>來自 App「{APP_NAME}」</Text>
            <Text style={styles.footerText}>50+ 也學得會的 AI 課</Text>
          </View>
        </LinearGradient>
      </View>
      <BigButton variant="secondary" icon="📤" label={buttonLabel} onPress={share} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radius, overflow: 'hidden', ...shadow(2) },
  card: { padding: 22, gap: 6 },
  circle: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(31,138,132,0.07)', right: -40, top: -50 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heading: { flex: 1, fontSize: 20, fontWeight: '800', color: colors.primaryDark, lineHeight: 28 },
  quote: { fontSize: 56, lineHeight: 56, color: colors.primary, opacity: 0.35, marginBottom: -24, marginTop: 4 },
  body: { fontSize: 22, lineHeight: 36, color: colors.text, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(31,138,132,0.2)' },
  footerText: { fontSize: 13, color: colors.muted },
});
