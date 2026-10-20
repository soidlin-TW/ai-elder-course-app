import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { LockedHint } from '@/components/LockedHint';
import { BigButton, Card, T } from '@/components/ui';
import { isFreePrompt, promptCategories, type PromptItem } from '@/content/extras';
import { feedback } from '@/lib/feedback';
import { FadeIn } from '@/lib/motion';
import { useStore } from '@/lib/store';
import { colors, radius } from '@/lib/theme';

/** Renders 【placeholders】 highlighted so readers see what to change. */
function PromptText({ text }: { text: string }) {
  const parts = text.split(/(【[^】]*】)/);
  return (
    <T>
      {parts.map((p, i) =>
        p.startsWith('【') ? (
          <T key={i} bold color={colors.accent}>
            {p}
          </T>
        ) : (
          p
        ),
      )}
    </T>
  );
}

function PromptCard({ item }: { item: PromptItem }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(item.text);
    feedback('tap');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ gap: 2 }}>
        <T size="large" bold>
          {item.title}
        </T>
        <T size="small" color={colors.muted}>
          適合：{item.when}
        </T>
      </View>
      <View style={styles.prompt}>
        <PromptText text={item.text} />
      </View>
      <View style={styles.tip}>
        <Text style={{ fontSize: 20 }}>💡</Text>
        <T size="small" style={{ flex: 1 }}>
          {item.tip}
        </T>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <BigButton icon={copied ? '✅' : '📋'} label={copied ? '已複製' : '複製'} onPress={copy} outerStyle={{ flex: 1 }} />
        <BigButton variant="secondary" icon="📤" label="分享" onPress={() => Share.share({ message: item.text })} outerStyle={{ flex: 1 }} />
      </View>
      {copied && (
        <T size="small" color={colors.correct}>
          打開 ChatGPT、Gemini 或 Claude，在輸入框長按選「貼上」，再把【括號】換成你的狀況。
        </T>
      )}
    </Card>
  );
}

export default function PromptCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { unlocked } = useStore();
  const cat = promptCategories.find((c) => c.id === id);
  if (!cat) return null;
  const open = cat.prompts.filter((_, i) => unlocked || isFreePrompt(i));
  const lockedCount = cat.prompts.length - open.length;

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Stack.Screen options={{ title: `${cat.icon} ${cat.title}` }} />
      {open.map((p, i) => (
        <FadeIn key={p.id} delay={i * 50}>
          <PromptCard item={p} />
        </FadeIn>
      ))}
      {lockedCount > 0 && (
        <>
          {cat.prompts.slice(open.length).map((p) => (
            <View key={p.id} style={styles.lockedRow}>
              <Text style={{ fontSize: 18 }}>🔒</Text>
              <T style={{ flex: 1 }} color={colors.muted}>
                {p.title}
              </T>
            </View>
          ))}
          <LockedHint text={`還有 ${lockedCount} 個「${cat.title}」範本`} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  prompt: { backgroundColor: '#F7F2EA', borderRadius: radius - 6, padding: 14 },
  tip: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius, backgroundColor: '#F4EEE5' },
});
