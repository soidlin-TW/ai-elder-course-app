import { StyleSheet, View } from 'react-native';

import { Robot, type RobotMood } from './Robot';
import { T } from './ui';
import { GUIDE_NAME } from '@/lib/config';
import { FadeIn, PressableScale } from '@/lib/motion';
import { speak } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { colors, radius, shadow } from '@/lib/theme';

/** 小智 with a speech bubble; tap it to hear 小智 say the line. */
export function Guide({ says, mood = 'happy' }: { says: string; mood?: RobotMood }) {
  const { speechRate } = useStore();
  return (
    <FadeIn>
      <PressableScale
        style={styles.row}
        haptic={false}
        accessibilityRole="button"
        accessibilityLabel={`${GUIDE_NAME}說：${says}`}
        accessibilityHint="點兩下聽小智唸出來"
        onPress={() => speak(says, speechRate)}
      >
        <View style={styles.avatar}>
          <Robot size={52} mood={mood} />
        </View>
        <View style={styles.bubble}>
          <View style={styles.tail} />
          <View style={styles.head}>
            <T size="small" bold color={colors.primaryDark}>
              {GUIDE_NAME}
            </T>
            <T size="small" color={colors.muted}>
              🔊 點我聽
            </T>
          </View>
          <T>{says}</T>
        </View>
      </PressableScale>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...shadow(1),
  },
  tail: {
    position: 'absolute',
    left: -6,
    top: 14,
    width: 12,
    height: 12,
    backgroundColor: colors.card,
    transform: [{ rotate: '45deg' }],
  },
});
