import { Image, StyleSheet, Text, View } from 'react-native';

import { lessonImages } from '@/content/images';
import { colors, radius } from '@/lib/theme';

/** The lesson illustration, or a calm placeholder until the generated image is added. */
export function LessonImage({ lessonId }: { lessonId: string }) {
  const source = lessonImages[lessonId];
  if (source) {
    return <Image source={source} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />;
  }
  return (
    <View style={[styles.image, styles.placeholder]}>
      <Text style={{ fontSize: 64 }}>🤖</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // 1216 × 832 source images
  image: { width: '100%', aspectRatio: 1216 / 832, borderRadius: radius },
  placeholder: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
