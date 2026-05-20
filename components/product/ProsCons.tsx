'use client';

import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ProsConsProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export function ProsCons({ pros, cons, className = '' }: ProsConsProps) {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`}>
      {/* Pros */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 dark:bg-green-600 rounded-lg flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-green-900 dark:text-green-200">
            Pros
          </h3>
        </div>
        <ul className="space-y-3">
          {pros.map((pro, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300"
            >
              <span className="w-1.5 h-1.5 bg-green-500 dark:bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500 dark:bg-red-600 rounded-lg flex items-center justify-center">
            <ThumbsDown className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
            Cons
          </h3>
        </div>
        <ul className="space-y-3">
          {cons.map((con, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300"
            >
              <span className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full mt-2 flex-shrink-0" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
