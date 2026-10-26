import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, TextInput, View } from 'react-native';

import { Guide } from '@/components/Guide';
import { BigButton, Card, T } from '@/components/ui';
import { feedback } from '@/lib/feedback';
import { PressableScale } from '@/lib/motion';
import { buildPrompt } from '@/lib/prompt';
import { useStore } from '@/lib/store';
import { colors, fontSize, radius } from '@/lib/theme';

const ROLES = ['營養師', '旅遊達人', '英文老師', '貼心的秘書', '耐心的電腦老師'];
const CONTEXTS = ['我 60 歲，膝蓋不好', '我和先生都有高血壓', '我第一次用智慧型手機', '我要帶 2 個孫子出門'];
const TASKS = ['推薦三個散步的地方', '設計一週的晚餐菜單', '解釋什麼是「雲端」', '寫一段生日祝福'];
const FORMATS = ['列出 3 點', '100 字以內', '用白話，像朋友聊天', '做成表格', '每一步都編號'];

function Chips({ options, value, onPick }: { options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const on = o === value;
        return (
          <PressableScale
            key={o}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onPick(on ? '' : o)}
            style={[styles.chip, on && styles.chipOn]}
          >
            <T size="small" bold={on} color={on ? '#fff' : colors.text}>
              {o}
            </T>
          </PressableScale>
        );
      })}
    </View>
  );
}

function Field({ step, title, hint, value, onChange, options }: { step: number; title: string; hint: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const { fontScale } = useStore();
  return (
    <Card style={{ gap: 10 }}>
      <View style={styles.fieldHead}>
        <View style={styles.badge}>
          <T bold color="#fff">
            {step}
          </T>
        </View>
        <T size="large" bold style={{ flex: 1 }}>
          {title}
        </T>
      </View>
      <T size="small" color={colors.muted}>
        {hint}
      </T>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="自己打，或點下面的例子"
        placeholderTextColor={colors.muted}
        style={[styles.input, { fontSize: fontSize.body * fontScale }]}
        accessibilityLabel={title}
      />
      <Chips options={options} value={value} onPick={onChange} />
    </Card>
  );
}

export default function PromptBuilder() {
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [task, setTask] = useState('');
  const [format, setFormat] = useState('');
  const [copied, setCopied] = useState(false);
  const text = buildPrompt({ role, context, task, format });

  const copy = async () => {
    await Clipboard.setStringAsync(text);
    feedback('tap');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Guide says="好的問題有四個部分：請它當誰、你的情況、要它做什麼、要什麼樣子。一格一格填，我幫你組成一句話。" />
      <Field step={1} title="請它當誰（可以不填）" hint="先給 AI 一個角色，回答會更專業。" value={role} onChange={setRole} options={ROLES} />
      <Field step={2} title="你的情況" hint="年紀、身體、家人、預算，說越清楚越好。" value={context} onChange={setContext} options={CONTEXTS} />
      <Field step={3} title="要它做什麼" hint="這一格最重要，一定要填。" value={task} onChange={setTask} options={TASKS} />
      <Field step={4} title="要什麼樣子" hint="長短、條列還是表格、什麼語氣。" value={format} onChange={setFormat} options={FORMATS} />

      <Card style={[styles.result, { gap: 12 }]}>
        <T size="small" bold color={colors.primaryDark}>
          ✨ 你的問題
        </T>
        <T>{text || '還沒填，先從第 3 格「要它做什麼」開始。'}</T>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <BigButton icon={copied ? '✅' : '📋'} label={copied ? '已複製' : '複製'} onPress={copy} disabled={!task.trim()} outerStyle={{ flex: 1 }} />
          <BigButton variant="secondary" icon="📤" label="分享" onPress={() => Share.share({ message: text })} disabled={!task.trim()} outerStyle={{ flex: 1 }} />
        </View>
        {copied && (
          <T size="small" color={colors.correct}>
            打開 ChatGPT、Gemini 或 Claude，在輸入框長按選「貼上」就可以送出。
          </T>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 16, paddingBottom: 48 },
  fieldHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 56, borderRadius: radius - 6, borderWidth: 2, borderColor: colors.border, backgroundColor: '#fff', paddingHorizontal: 14, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 22, backgroundColor: '#F4EEE5' },
  chipOn: { backgroundColor: colors.primary },
  result: { backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.primary },
});
