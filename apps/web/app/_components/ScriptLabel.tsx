import type { ReactNode } from 'react'

type ScriptLabelProps = {
  children: ReactNode
  tone?: 'orange' | 'dark' | 'green' | 'blue'
  className?: string
}

const toneClasses = {
  orange: 'text-[var(--color-accent-orange-dark)]',
  dark: 'text-[var(--color-text-primary)]',
  green: 'text-[var(--color-live-inventory)]',
  blue: 'text-[var(--color-ai-feature)]',
}

export function ScriptLabel({ children, tone = 'orange', className = '' }: ScriptLabelProps) {
  return (
    <p className={`font-[var(--font-script)] text-3xl font-black leading-none ${toneClasses[tone]} ${className}`}>
      {children}
    </p>
  )
}
