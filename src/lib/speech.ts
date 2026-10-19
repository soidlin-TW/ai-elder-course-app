import * as Speech from 'expo-speech';

export function speak(text: string, rate: number, onDone?: () => void) {
  Speech.stop();
  Speech.speak(text, { language: 'zh-TW', rate, onDone, onStopped: onDone, onError: onDone });
}

export function stopSpeaking() {
  Speech.stop();
}
