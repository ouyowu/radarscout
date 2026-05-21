import { Lightbulb } from 'lucide-react';

interface QuickAnswerBoxProps {
  answer: string;
  label?: string;
}

export function QuickAnswerBox({ answer, label = 'Quick Answer' }: QuickAnswerBoxProps) {
  return (
    <div className="quick-answer article-summary not-prose my-8 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-slate-200 text-base leading-relaxed">{answer}</p>
    </div>
  );
}
