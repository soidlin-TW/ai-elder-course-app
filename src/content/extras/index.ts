import glossaryData from './glossary.json';
import guidesData from './guides.json';
import missionsData from './missions.json';
import promptsData from './prompts.json';
import scamData from './scam.json';

export type PromptItem = { id: string; title: string; when: string; text: string; tip: string };
export type PromptCategory = { id: string; icon: string; title: string; prompts: PromptItem[] };
export type Scenario = { channel: string; text: string; scam: boolean; explain: string };
export type Guide = { id: string; name: string; maker: string; icon: string; color: string; intro: string; steps: string[]; tips: string[] };
export type Term = { term: string; meaning: string; example: string };
export type Mission = { unit: number; title: string; steps: string[] };

export const promptCategories = promptsData as PromptCategory[];
export const scamKit = scamData as {
  checklist: { icon: string; title: string; text: string }[];
  redFlags: string[];
  familyCode: { intro: string; examples: string[]; rules: string[] };
  scenarios: Scenario[];
};
export const guides = guidesData as Guide[];
export const glossary = glossaryData as Term[];
export const missions = missionsData as Mission[];

/** Free samples before unlocking: the first prompt of each category and the first scenarios. */
export const FREE_SCENARIOS = 3;
export const isFreePrompt = (index: number) => index === 0;
export const promptCount = promptCategories.reduce((n, c) => n + c.prompts.length, 0);
