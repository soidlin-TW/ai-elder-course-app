import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

export type SoundName = 'correct' | 'retry' | 'complete' | 'tap';

const sources: Record<SoundName, number> = {
  correct: require('../../assets/sounds/correct.wav'),
  retry: require('../../assets/sounds/retry.wav'),
  complete: require('../../assets/sounds/complete.wav'),
  tap: require('../../assets/sounds/tap.wav'),
};

let enabled = true;
let modeSet = false;
const players: Partial<Record<SoundName, AudioPlayer>> = {};

/** Kept in sync with the store's soundOn setting. */
export function setSoundEnabled(on: boolean) {
  enabled = on;
}

function playSound(name: SoundName) {
  if (!enabled) return;
  try {
    if (!modeSet) {
      modeSet = true;
      // Follow the ring/silent switch and never pause the user's music.
      setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
    }
    const player = (players[name] ??= createAudioPlayer(sources[name]));
    player.volume = 0.5;
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // Sound is a nicety; never let it break the lesson.
  }
}

/** Sound plus haptic for an answer or a milestone. */
export function feedback(kind: SoundName) {
  playSound(kind);
  if (kind === 'tap') {
    Haptics.selectionAsync().catch(() => {});
  } else {
    Haptics.notificationAsync(kind === 'retry' ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
}
