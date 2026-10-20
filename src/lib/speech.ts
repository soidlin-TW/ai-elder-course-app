import * as Speech from 'expo-speech';

let voicePick: Promise<{ id?: string; enhanced: boolean }> | null = null;

/** The best Taiwanese Mandarin voice on this phone; prefers an enhanced (downloaded) voice. */
export function pickVoice() {
  voicePick ??= Speech.getAvailableVoicesAsync()
    .then((voices) => {
      const tw = voices.filter((v) => v.language.replace('_', '-').toLowerCase() === 'zh-tw');
      const best = tw.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ?? tw[0];
      return { id: best?.identifier, enhanced: best?.quality === Speech.VoiceQuality.Enhanced };
    })
    .catch(() => ({ id: undefined, enhanced: false }));
  return voicePick;
}

export function speak(text: string, rate: number, onDone?: () => void) {
  Speech.stop();
  pickVoice().then(({ id }) => {
    Speech.speak(text, { language: 'zh-TW', voice: id, rate, onDone, onStopped: onDone, onError: onDone });
  });
}

export function stopSpeaking() {
  Speech.stop();
}
