import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PurchaseProvider } from '@/lib/purchase';
import { StoreProvider } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <PurchaseProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.primaryDark,
              headerTitleStyle: { fontSize: 20, fontWeight: '800' },
              headerBackTitle: '返回',
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="unlock" options={{ title: '解鎖完整課程', presentation: 'modal' }} />
            <Stack.Screen name="settings" options={{ title: '設定' }} />
            <Stack.Screen name="certificate" options={{ title: '結業證書' }} />
            <Stack.Screen name="prompts/index" options={{ title: '提問範本' }} />
            <Stack.Screen name="scam/index" options={{ title: '防詐工具箱' }} />
            <Stack.Screen name="scam/quiz" options={{ title: '這是詐騙嗎？' }} />
            <Stack.Screen name="guides" options={{ title: 'AI 上手指南' }} />
            <Stack.Screen name="glossary" options={{ title: 'AI 小字典' }} />
            <Stack.Screen name="review" options={{ title: '每日複習' }} />
          </Stack>
        </PurchaseProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
