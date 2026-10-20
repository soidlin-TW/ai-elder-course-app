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
          </Stack>
        </PurchaseProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
