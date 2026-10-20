import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  background: '#FFF8EE',
  card: '#FFFFFF',
  text: '#26302F',
  muted: '#6B6560',
  primary: '#1F8A84',
  primaryDark: '#16675F',
  primarySoft: '#DDF1EF',
  accent: '#E8775B',
  accentSoft: '#FDEDE7',
  gold: '#F2B84B',
  goldSoft: '#FDF3DC',
  correct: '#2E8B57',
  correctSoft: '#E3F4EA',
  wrong: '#C0453A',
  wrongSoft: '#FBE6E3',
  border: '#EDE4D8',
  screen: '#22403D',
  glow: '#7FF0E4',
};

/** Hero gradient behind the home and paywall headers. */
export const heroGradient = ['#1F8A84', '#2FA69C', '#5CC2B4'] as const;

/** One colour and icon per unit so learners can find their place at a glance. */
export const unitThemes: Record<number, { color: string; soft: string; icon: string }> = {
  1: { color: '#1F8A84', soft: '#DDF1EF', icon: '💡' },
  2: { color: '#3A7BD5', soft: '#E3EDFB', icon: '💬' },
  3: { color: '#E08A3C', soft: '#FCEEDF', icon: '🏠' },
  4: { color: '#7B5EC6', soft: '#ECE6F8', icon: '💼' },
  5: { color: '#D2504A', soft: '#FBE6E3', icon: '🛡️' },
  6: { color: '#4C9A52', soft: '#E4F2E4', icon: '🌱' },
};

/** Base sizes at font scale 1. Older readers get a larger default than typical apps. */
export const fontSize = {
  small: 16,
  body: 20,
  large: 24,
  title: 28,
  hero: 34,
};

export const radius = 20;
export const minTouch = 56;

/** Soft, warm elevation instead of hard borders. */
export function shadow(level: 1 | 2 | 3 = 1): ViewStyle {
  const y = [0, 2, 6, 12][level];
  const blur = [0, 8, 18, 28][level];
  return Platform.select<ViewStyle>({
    web: { boxShadow: `0 ${y}px ${blur}px rgba(80, 60, 30, ${0.06 + level * 0.03})` } as ViewStyle,
    default: {
      shadowColor: '#503C1E',
      shadowOpacity: 0.08 + level * 0.03,
      shadowRadius: blur / 2,
      shadowOffset: { width: 0, height: y },
      elevation: level * 2,
    },
  })!;
}
