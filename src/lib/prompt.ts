/**
 * Joins the four parts of a good prompt (role, context, task, format) into one polite sentence,
 * after the Prompt Engineering Guide's "elements of a prompt". Empty parts are skipped.
 */
export function buildPrompt(p: { role: string; context: string; task: string; format: string }) {
  const s = (t: string) => t.trim().replace(/[。，,.\s]+$/, '');
  return [
    s(p.role) && `請你當${s(p.role)}。`,
    s(p.context) && `我的情況是：${s(p.context)}。`,
    s(p.task) && `請幫我${s(p.task).replace(/^(請|幫我)+/, '')}。`,
    s(p.format) && `回答時請${s(p.format)}。`,
  ]
    .filter(Boolean)
    .join('');
}
