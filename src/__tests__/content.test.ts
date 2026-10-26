// Content checks: catch typos in the lesson JSON (wrong answer index, missing goals, broken placeholders) before they ship.
import { describe, expect, it } from '@jest/globals';

import { allLessons, nextLessonId, units } from '@/content';
import { glossary, guides, missions, promptCategories, promptCount, scamKit } from '@/content/extras';
import { buildPrompt } from '@/lib/prompt';

const FREE = ['u1l1', 'u1l2', 'u1l3', 'u1l4', 'u2l1', 'u2l2'];

describe('lessons', () => {
  it('has 6 units of 4 lessons with unique ids', () => {
    expect(units).toHaveLength(6);
    units.forEach((u) => expect(u.lessons).toHaveLength(4));
    expect(new Set(allLessons.map((l) => l.id)).size).toBe(allLessons.length);
  });

  it('keeps exactly the agreed lessons free', () => {
    expect(allLessons.filter((l) => l.free).map((l) => l.id)).toEqual(FREE);
  });

  it.each(allLessons.map((l) => [l.id, l] as const))('%s is complete', (_, l) => {
    expect(l.title.trim()).not.toBe('');
    expect(l.goals).toHaveLength(2);
    l.goals.forEach((g) => expect(g.trim()).not.toBe(''));
    expect(l.paragraphs.length).toBeGreaterThan(0);
    expect(l.example.trim()).not.toBe('');
    expect(l.challenge.trim()).not.toBe('');
    expect(l.imagePrompt.trim()).not.toBe('');
    expect(l.quiz.options.length).toBeGreaterThanOrEqual(2);
    expect(l.quiz.answer).toBeGreaterThanOrEqual(0);
    expect(l.quiz.answer).toBeLessThan(l.quiz.options.length);
  });

  it.each(allLessons.map((l) => [l.id, l.interaction] as const))('%s has a playable interaction', (_, it) => {
    switch (it.type) {
      case 'tapReveal':
        expect(it.items.some((i) => i.correct)).toBe(true);
        break;
      case 'pickBetter':
        it.rounds.forEach((r) => expect(r.options.filter((o) => o.good)).toHaveLength(1));
        break;
      case 'sort':
        it.cards.forEach((c) => expect([0, 1]).toContain(c.bin));
        break;
      case 'nextWord':
        it.steps.forEach((s) => expect(s.options.reduce((n, o) => n + o.p, 0)).toBe(100));
        break;
      case 'chat':
        expect(it.turns.length).toBeGreaterThan(0);
        break;
    }
  });

  it('links every lesson to the next one', () => {
    allLessons.slice(0, -1).forEach((l, i) => expect(nextLessonId(l.id)).toBe(allLessons[i + 1].id));
    expect(nextLessonId(allLessons[allLessons.length - 1].id)).toBeUndefined();
  });
});

describe('extras', () => {
  it('has 9 prompt categories of 5 prompts with unique ids', () => {
    expect(promptCategories).toHaveLength(9);
    promptCategories.forEach((c) => expect(c.prompts).toHaveLength(5));
    const ids = promptCategories.flatMap((c) => c.prompts.map((p) => p.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(promptCount).toBe(45);
  });

  it('marks what to change in every prompt with balanced 【】', () => {
    promptCategories.flatMap((c) => c.prompts).forEach((p) => {
      expect(p.text).toMatch(/【[^】]+】/);
      expect(p.text.split('【').length).toBe(p.text.split('】').length);
    });
  });

  it('has 15 scam scenarios, some of them real messages', () => {
    expect(scamKit.scenarios).toHaveLength(15);
    expect(scamKit.scenarios.some((s) => !s.scam)).toBe(true);
  });

  it('has unique glossary terms, 3 guides and a mission per unit', () => {
    expect(new Set(glossary.map((g) => g.term)).size).toBe(glossary.length);
    expect(guides).toHaveLength(3);
    expect(missions.map((m) => m.unit).sort()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('buildPrompt', () => {
  it('joins all four parts', () => {
    expect(buildPrompt({ role: '營養師', context: '我 60 歲，膝蓋不好', task: '推薦三個散步的地方', format: '列出 3 點' })).toBe(
      '請你當營養師。我的情況是：我 60 歲，膝蓋不好。請幫我推薦三個散步的地方。回答時請列出 3 點。',
    );
  });

  it('skips empty parts and trailing punctuation', () => {
    expect(buildPrompt({ role: ' ', context: '', task: '幫我寫一段生日祝福。', format: '' })).toBe('請幫我寫一段生日祝福。');
  });
});
