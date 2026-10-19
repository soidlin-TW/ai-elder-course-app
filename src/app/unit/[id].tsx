import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { T } from '@/components/ui';
import { units } from '@/content';
import { useStore } from '@/lib/store';
import { colors, radius } from '@/lib/theme';

export default function UnitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { completed, unlocked } = useStore();
  const unit = units.find((u) => String(u.id) === id);
  if (!unit) return null;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `第 ${unit.id} 單元` }} />
      <T size="title" bold>
        {unit.title}
      </T>
      {unit.lessons.map((l, i) => {
        const locked = !unlocked && !l.free;
        return (
          <Pressable
            key={l.id}
            accessibilityRole="button"
            accessibilityLabel={`${l.title}${locked ? '，需要解鎖' : ''}`}
            onPress={() => router.push(locked ? '/unlock' : `/lesson/${l.id}`)}
            style={styles.row}
          >
            <View style={styles.num}>
              <T bold color={colors.primaryDark}>
                {i + 1}
              </T>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T bold>{l.title}</T>
              {l.free && !unlocked && (
                <T size="small" color={colors.accent}>
                  免費試看
                </T>
              )}
            </View>
            <T size="large">{completed[l.id] ? '✅' : locked ? '🔒' : '›'}</T>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 14, paddingBottom: 48 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 72,
    backgroundColor: colors.card,
    borderRadius: radius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  num: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});
