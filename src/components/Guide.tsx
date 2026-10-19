import { StyleSheet, Text, View } from 'react-native';

import { T } from './ui';
import { GUIDE_NAME } from '@/lib/config';
import { colors, radius } from '@/lib/theme';

/** The robot guide with a speech bubble. Swap the emoji for the Krita character art once it exists. */
export function Guide({ says }: { says: string }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${GUIDE_NAME}說：${says}`}>
      <View style={styles.avatar}>
        <Text style={styles.emoji}>🤖</Text>
      </View>
      <View style={styles.bubble}>
        <T size="small" bold color={colors.primaryDark}>
          {GUIDE_NAME}
        </T>
        <T>{says}</T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 32 },
  bubble: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
