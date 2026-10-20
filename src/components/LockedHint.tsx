import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { T } from './ui';
import { PressableScale } from '@/lib/motion';
import { colors, radius } from '@/lib/theme';

/** Shown in place of paid extras: says what unlocking adds and opens the paywall. */
export function LockedHint({ text }: { text: string }) {
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={`${text}，前往解鎖`} onPress={() => router.push('/unlock')} style={styles.box}>
      <Text style={{ fontSize: 26 }}>🔒</Text>
      <View style={{ flex: 1 }}>
        <T bold color={colors.accent}>
          {text}
        </T>
        <T size="small" color={colors.muted}>
          解鎖完整課程後就能使用
        </T>
      </View>
      <T size="large" color={colors.accent}>
        ›
      </T>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.accentSoft, borderRadius: radius, padding: 16, borderWidth: 1.5, borderColor: '#F6CDBF' },
});
