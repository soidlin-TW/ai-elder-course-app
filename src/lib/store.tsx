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
  missionsDone: Record<string, true>;
  familyQuestion: string;
  /** Daily review: last day finished (YYYY-MM-DD, local) and the run of consecutive days. */
  reviewDay?: string;
  reviewStreak: number;
};

const initialState: PersistedState = {
  completed: {},
  unlocked: false,
  fontScale: 1.2,
  speechRate: 0.8,
  reviewRequested: false,
  missionsDone: {},
  familyQuestion: '',
  reviewStreak: 0,
};

type Store = PersistedState & {
  ready: boolean;
  markCompleted: (lessonId: string) => void;
  setLastLesson: (lessonId: string) => void;
  setUnlocked: (unlocked: boolean) => void;
  setFontScale: (scale: FontScale) => void;
  setSpeechRate: (rate: SpeechRate) => void;
  setReviewRequested: () => void;
  toggleMission: (key: string) => void;
  setFamilyQuestion: (q: string) => void;
  finishReview: () => void;
};

export function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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
      toggleMission: (key) =>
        update((s) => {
          const next = { ...s.missionsDone };
          if (next[key]) delete next[key];
          else next[key] = true;
          return { missionsDone: next };
        }),
      setFamilyQuestion: (familyQuestion) => update({ familyQuestion }),
      finishReview: () =>
        update((s) => {
          const today = dayKey();
          if (s.reviewDay === today) return {};
          const y = new Date();
          y.setDate(y.getDate() - 1);
          return { reviewDay: today, reviewStreak: s.reviewDay === dayKey(y) ? s.reviewStreak + 1 : 1 };
        }),
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
