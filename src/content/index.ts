import unit1 from './unit1.json';
import unit2 from './unit2.json';
import unit3 from './unit3.json';
import unit4 from './unit4.json';
import unit5 from './unit5.json';
import unit6 from './unit6.json';

export type TapRevealInteraction = {
  type: 'tapReveal';
  title: string;
  intro: string;
  items: { label: string; emoji: string; correct: boolean; reveal: string }[];
  outro: string;
};

export type ChatInteraction = {
  type: 'chat';
  title: string;
  intro: string;
  turns: { question: string; answer: string; followUp: { question: string; answer: string } }[];
  note: string;
};

export type NextWordInteraction = {
  type: 'nextWord';
  title: string;
  intro: string;
  steps: { prefix: string; options: { word: string; p: number }[] }[];
  outro: string;
};

export type SortInteraction = {
  type: 'sort';
  title: string;
  intro: string;
  bins: [string, string];
  cards: { text: string; bin: number; reason: string }[];
  outro: string;
};

export type PickBetterInteraction = {
  type: 'pickBetter';
  title: string;
  intro: string;
  rounds: { situation: string; options: { text: string; good: boolean }[]; explain: string }[];
  outro: string;
};

export type Interaction =
  | TapRevealInteraction
  | ChatInteraction
  | NextWordInteraction
  | SortInteraction
  | PickBetterInteraction;

export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  free: boolean;
  imagePrompt: string;
  paragraphs: string[];
  example: string;
  interaction: Interaction;
  quiz: Quiz;
};

export type Unit = {
  id: number;
  title: string;
  lessons: Lesson[];
};

export const units = [unit1, unit2, unit3, unit4, unit5, unit6] as Unit[];

export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);

export function findLesson(id: string): { unit: Unit; lesson: Lesson; index: number } | undefined {
  for (const unit of units) {
    const index = unit.lessons.findIndex((l) => l.id === id);
    if (index >= 0) return { unit, lesson: unit.lessons[index], index };
  }
  return undefined;
}

export function nextLessonId(id: string): string | undefined {
  const i = allLessons.findIndex((l) => l.id === id);
  return i >= 0 ? allLessons[i + 1]?.id : undefined;
}

/** The sentence a lesson's share card carries: the interaction's closing line. */
export function takeaway(lesson: Lesson): string {
  const it = lesson.interaction;
  return it.type === 'chat' ? lesson.quiz.explanation : it.outro;
}
