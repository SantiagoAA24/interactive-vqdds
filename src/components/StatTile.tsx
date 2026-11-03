type StatTileProps = {
  label: string
  value: string
  accent?: boolean
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function StatTile({ label, value, accent = false, className }: StatTileProps) {
  return (
    <div className={joinClassNames('dd-stat', className)}>
      <p className="dd-stat-label">{label}</p>
      <p className={joinClassNames('dd-stat-value', accent && 'is-accent')}>{value}</p>
    </div>
  )
}
