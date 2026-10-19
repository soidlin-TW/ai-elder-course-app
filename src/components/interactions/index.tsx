import { Chat } from './Chat';
import { NextWord } from './NextWord';
import { PickBetter } from './PickBetter';
import { Sort } from './Sort';
import { TapReveal } from './TapReveal';
import type { Interaction } from '@/content';

export function InteractionView({ data, onDone }: { data: Interaction; onDone: () => void }) {
  switch (data.type) {
    case 'tapReveal':
      return <TapReveal data={data} onDone={onDone} />;
    case 'chat':
      return <Chat data={data} onDone={onDone} />;
    case 'nextWord':
      return <NextWord data={data} onDone={onDone} />;
    case 'sort':
      return <Sort data={data} onDone={onDone} />;
    case 'pickBetter':
      return <PickBetter data={data} onDone={onDone} />;
  }
}
