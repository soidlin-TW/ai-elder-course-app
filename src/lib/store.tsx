import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'app-state-v1';

export type FontScale = 1 | 1.2 | 1.4;
export type SpeechRate = 0.8 | 1 | 1.2;

type PersistedState = {
  completed: Record<string, true>;
  lastLessonId?: string;
  unlocked: boolean;
  fontScale: FontScale;
  speechRate: SpeechRate;
  reviewRequested: boolean;
};

const initialState: PersistedState = {
  completed: {},
  unlocked: false,
  fontScale: 1.2,
  speechRate: 0.8,
  reviewRequested: false,
};

type Store = PersistedState & {
  ready: boolean;
  markCompleted: (lessonId: string) => void;
  setLastLesson: (lessonId: string) => void;
  setUnlocked: (unlocked: boolean) => void;
  setFontScale: (scale: FontScale) => void;
  setSpeechRate: (rate: SpeechRate) => void;
  setReviewRequested: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback((patch: Partial<PersistedState> | ((s: PersistedState) => Partial<PersistedState>)) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      markCompleted: (id) => update((s) => ({ completed: { ...s.completed, [id]: true } })),
      setLastLesson: (id) => update({ lastLessonId: id }),
      setUnlocked: (unlocked) => update({ unlocked }),
      setFontScale: (fontScale) => update({ fontScale }),
      setSpeechRate: (speechRate) => update({ speechRate }),
      setReviewRequested: () => update({ reviewRequested: true }),
    }),
    [state, ready, update],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
