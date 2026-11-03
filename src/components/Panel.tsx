import type { ReactNode } from 'react'

type PanelProps = {
  accent?: boolean
  children: ReactNode
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function Panel({ accent = false, children, className }: PanelProps) {
  return (
    <div className={joinClassNames('dd-panel', accent && 'dd-panel--accent', className)}>
      {children}
    </div>
  )
}
