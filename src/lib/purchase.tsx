import { requireOptionalNativeModule } from 'expo';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

import { FALLBACK_PRICE, UNLOCK_PRODUCT_ID } from './config';
import { useStore } from './store';

type Purchase = {
  available: boolean;
  price: string;
  busy: boolean;
  buy: () => Promise<void>;
  restore: () => Promise<void>;
};

const PurchaseContext = createContext<Purchase | null>(null);

// Expo Go has no StoreKit module; fall back so the course can still be previewed there.
const hasNativeIap = requireOptionalNativeModule('ExpoIap') != null;

export function PurchaseProvider({ children }: { children: ReactNode }) {
  return hasNativeIap ? <StorePurchaseProvider>{children}</StorePurchaseProvider> : <PreviewPurchaseProvider>{children}</PreviewPurchaseProvider>;
}

function StorePurchaseProvider({ children }: { children: ReactNode }) {
  // Required lazily so Expo Go never loads the native module.
  const { useIAP, ErrorCode } = require('expo-iap') as typeof import('expo-iap');
  const { setUnlocked } = useStore();
  const [busy, setBusy] = useState(false);

  const { connected, products, availablePurchases, fetchProducts, requestPurchase, finishTransaction, getAvailablePurchases, restorePurchases } =
    useIAP({
      onPurchaseSuccess: async (purchase) => {
        if (purchase.productId === UNLOCK_PRODUCT_ID) {
          setUnlocked(true);
          await finishTransaction({ purchase, isConsumable: false });
        }
        setBusy(false);
      },
      onPurchaseError: (error) => {
        setBusy(false);
        if (error.code !== ErrorCode.UserCancelled) {
          Alert.alert('購買沒有完成', '請稍後再試一次，或檢查網路連線。');
        }
      },
    });

  useEffect(() => {
    if (!connected) return;
    fetchProducts({ skus: [UNLOCK_PRODUCT_ID], type: 'in-app' }).catch(() => {});
    getAvailablePurchases().catch(() => {});
  }, [connected]);

  useEffect(() => {
    if (availablePurchases.some((p) => p.productId === UNLOCK_PRODUCT_ID)) setUnlocked(true);
  }, [availablePurchases]);

  const product = products.find((p) => p.id === UNLOCK_PRODUCT_ID);

  const value = useMemo<Purchase>(
    () => ({
      available: connected && !!product,
      price: product?.displayPrice ?? FALLBACK_PRICE,
      busy,
      buy: async () => {
        setBusy(true);
        try {
          await requestPurchase({
            type: 'in-app',
            request: { apple: { sku: UNLOCK_PRODUCT_ID }, google: { skus: [UNLOCK_PRODUCT_ID] } },
          });
        } catch {
          setBusy(false);
        }
      },
      restore: async () => {
        setBusy(true);
        try {
          await restorePurchases();
          await getAvailablePurchases();
        } finally {
          setBusy(false);
        }
      },
    }),
    [connected, product, busy],
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

function PreviewPurchaseProvider({ children }: { children: ReactNode }) {
  const { setUnlocked } = useStore();
  const value = useMemo<Purchase>(
    () => ({
      available: false,
      price: FALLBACK_PRICE,
      busy: false,
      buy: async () => {
        if (__DEV__) {
          setUnlocked(true);
          Alert.alert('預覽模式', '這個環境沒有 App Store 付款，已直接解鎖方便測試。');
        } else {
          Alert.alert('目前無法購買', '請稍後再試。');
        }
      },
      restore: async () => {},
    }),
    [setUnlocked],
  );
  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchase(): Purchase {
  const purchase = useContext(PurchaseContext);
  if (!purchase) throw new Error('usePurchase must be used inside PurchaseProvider');
  return purchase;
}
