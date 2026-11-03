type LevelDotsProps = {
  count: number
  tone: 'accent' | 'violet'
  /** Accessible name; defaults to the node count in Spanish. */
  ariaLabel?: string
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function LevelDots({ count, tone, ariaLabel, className }: LevelDotsProps) {
  const safeCount = Math.max(0, Math.floor(count))
  const defaultLabel = safeCount === 1 ? '1 nodo' : `${safeCount} nodos`

  return (
    <div
      className={joinClassNames(
        'dd-level-dots',
        tone === 'accent' ? 'dd-level-dots--accent' : 'dd-level-dots--violet',
        className,
      )}
      role="img"
      aria-label={ariaLabel ?? defaultLabel}
    >
      {Array.from({ length: safeCount }, (_, i) => (
        <span key={i} className="dd-level-dot" aria-hidden="true" />
      ))}
    </div>
  )
}
