import { useEffect, useState } from 'react';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

import { useReduceMotion } from '@/lib/motion';
import { colors } from '@/lib/theme';

export type RobotMood = 'happy' | 'cheer' | 'think';

/**
 * 小智: the round white robot with a teal antenna. Drawn in SVG so it stays sharp at any
 * size and matches the character prompt used for the Krita illustrations.
 */
export function Robot({ size = 64, mood = 'happy', blink = true }: { size?: number; mood?: RobotMood; blink?: boolean }) {
  const reduce = useReduceMotion();
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!blink || reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setClosed(true);
        t = setTimeout(() => {
          setClosed(false);
          loop();
        }, 140);
      }, 2800 + Math.random() * 2400);
    };
    loop();
    return () => clearTimeout(t);
  }, [blink, reduce]);

  const eyeY = mood === 'think' ? 51 : 54;
  const eyes =
    mood === 'cheer' ? (
      <>
        <Path d="M41 56 Q47 48 53 56" stroke={colors.glow} strokeWidth={4} strokeLinecap="round" fill="none" />
        <Path d="M67 56 Q73 48 79 56" stroke={colors.glow} strokeWidth={4} strokeLinecap="round" fill="none" />
      </>
    ) : closed ? (
      <>
        <Line x1={41} y1={eyeY} x2={53} y2={eyeY} stroke={colors.glow} strokeWidth={4} strokeLinecap="round" />
        <Line x1={67} y1={eyeY} x2={79} y2={eyeY} stroke={colors.glow} strokeWidth={4} strokeLinecap="round" />
      </>
    ) : (
      <>
        <Ellipse cx={47} cy={eyeY} rx={6} ry={7} fill={colors.glow} />
        <Ellipse cx={73} cy={eyeY} rx={6} ry={7} fill={colors.glow} />
        <Circle cx={49} cy={eyeY - 3} r={2} fill="#fff" />
        <Circle cx={75} cy={eyeY - 3} r={2} fill="#fff" />
      </>
    );

  const mouth =
    mood === 'cheer' ? (
      <Path d="M48 63 Q60 75 72 63 Z" fill={colors.glow} />
    ) : mood === 'think' ? (
      <Circle cx={63} cy={66} r={3} fill={colors.glow} />
    ) : (
      <Path d="M50 64 Q60 71 70 64" stroke={colors.glow} strokeWidth={4} strokeLinecap="round" fill="none" />
    );

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {/* arms */}
      {mood === 'cheer' ? (
        <>
          <Path d="M38 92 L22 74" stroke="#E6EEEC" strokeWidth={8} strokeLinecap="round" />
          <Path d="M82 92 L98 74" stroke="#E6EEEC" strokeWidth={8} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Path d="M38 94 L28 104" stroke="#E6EEEC" strokeWidth={8} strokeLinecap="round" />
          <Path d="M82 94 L92 104" stroke="#E6EEEC" strokeWidth={8} strokeLinecap="round" />
        </>
      )}
      {/* body */}
      <Rect x={36} y={82} width={48} height={30} rx={15} fill="#fff" stroke="#D6E2E0" strokeWidth={2} />
      <Circle cx={60} cy={97} r={5} fill={colors.primary} />
      {/* antenna */}
      <Line x1={60} y1={24} x2={60} y2={11} stroke={colors.primary} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={60} cy={9} r={6} fill={colors.primary} />
      <Circle cx={58} cy={7} r={2} fill="#9BE3DA" />
      {/* ears */}
      <Rect x={9} y={46} width={12} height={22} rx={6} fill={colors.primary} />
      <Rect x={99} y={46} width={12} height={22} rx={6} fill={colors.primary} />
      {/* head */}
      <Rect x={17} y={22} width={86} height={66} rx={33} fill="#fff" stroke="#D6E2E0" strokeWidth={2} />
      <Rect x={28} y={35} width={64} height={41} rx={20} fill={colors.screen} />
      {eyes}
      {mouth}
      <Circle cx={24} cy={72} r={4.5} fill="#F6A99F" opacity={0.75} />
      <Circle cx={96} cy={72} r={4.5} fill="#F6A99F" opacity={0.75} />
    </Svg>
  );
}
