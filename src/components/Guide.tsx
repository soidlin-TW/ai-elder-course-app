import { StyleSheet, View } from 'react-native';

import { Robot, type RobotMood } from './Robot';
import { T } from './ui';
import { GUIDE_NAME } from '@/lib/config';
import { FadeIn } from '@/lib/motion';
import { colors, radius, shadow } from '@/lib/theme';

/** 小智 with a speech bubble. */
export function Guide({ says, mood = 'happy' }: { says: string; mood?: RobotMood }) {
  return (
    <FadeIn>
      <View style={styles.row} accessible accessibilityLabel={`${GUIDE_NAME}說：${says}`}>
        <View style={styles.avatar}>
          <Robot size={52} mood={mood} />
        </View>
        <View style={styles.bubble}>
          <View style={styles.tail} />
          <T size="small" bold color={colors.primaryDark}>
            {GUIDE_NAME}
          </T>
          <T>{says}</T>
        </View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
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
