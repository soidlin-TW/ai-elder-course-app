import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Robot } from './Robot';
import { lessonImages } from '@/content/images';
import { radius, unitThemes } from '@/lib/theme';

/** The lesson illustration, or a soft branded placeholder until the Krita image is added. */
export function LessonImage({ lessonId, unitId }: { lessonId: string; unitId: number }) {
  const source = lessonImages[lessonId];
  if (source) {
    return <Image source={source} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />;
  }
  const t = unitThemes[unitId] ?? unitThemes[1];
  return (
    <LinearGradient colors={[t.soft, '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.image, styles.placeholder]}>
      <View style={[styles.blob, { backgroundColor: t.color, opacity: 0.12, top: -30, right: -20 }]} />
      <View style={[styles.blob, { backgroundColor: t.color, opacity: 0.08, bottom: -50, left: -30, width: 180, height: 180 }]} />
      <Robot size={120} />
      <Text style={styles.icon}>{t.icon}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // 1216 × 832 source images
  image: { width: '100%', aspectRatio: 1216 / 832, borderRadius: radius, overflow: 'hidden' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 140, height: 140, borderRadius: 999 },
  icon: { position: 'absolute', top: 18, left: 20, fontSize: 34 },
});
