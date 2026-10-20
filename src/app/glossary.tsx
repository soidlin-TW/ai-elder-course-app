import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Card, T } from '@/components/ui';
import { glossary } from '@/content/extras';
import { speak } from '@/lib/speech';
import { useStore } from '@/lib/store';
import { PressableScale } from '@/lib/motion';
import { colors, fontSize, radius } from '@/lib/theme';

export default function Glossary() {
  const { fontScale, speechRate } = useStore();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k ? glossary.filter((g) => (g.term + g.meaning).toLowerCase().includes(k)) : glossary;
  }, [q]);

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="🔍 搜尋名詞，例如：幻覺"
        placeholderTextColor={colors.muted}
        style={[styles.search, { fontSize: fontSize.body * fontScale }]}
        accessibilityLabel="搜尋名詞"
        clearButtonMode="while-editing"
      />
      <T size="small" color={colors.muted}>
        共 {list.length} 個名詞，點一下可以聽唸法和解釋
      </T>
      {list.map((g) => (
        <PressableScale key={g.term} accessibilityRole="button" accessibilityLabel={`${g.term}，${g.meaning}`} onPress={() => speak(`${g.term}。${g.meaning}`, speechRate)}>
          <Card style={{ gap: 6 }}>
            <T size="large" bold color={colors.primaryDark}>
              {g.term}
            </T>
            <T>{g.meaning}</T>
            <View style={styles.example}>
              <T size="small">例：{g.example}</T>
            </View>
          </Card>
        </PressableScale>
      ))}
      {list.length === 0 && (
        <T color={colors.muted} style={{ textAlign: 'center' }}>
          找不到這個名詞，換個字試試看。
        </T>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 12, paddingBottom: 48 },
  search: { backgroundColor: colors.card, borderRadius: radius, paddingHorizontal: 16, minHeight: 56, color: colors.text, borderWidth: 1.5, borderColor: colors.border },
  example: { backgroundColor: '#F7F2EA', borderRadius: radius - 8, padding: 10 },
});
