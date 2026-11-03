type ProbabilityRowProps = {
  label: string
  probability: number
  formattedValue: string
  tag?: string
  selected?: boolean
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function ProbabilityRow({
  label,
  probability,
  formattedValue,
  tag = '',
  selected = false,
  className,
}: ProbabilityRowProps) {
  const widthPercent = `${probability * 100}%`

  return (
    <div
      className={joinClassNames('dd-row', className)}
      aria-current={selected ? 'true' : undefined}
    >
      <span className="dd-row-label">{label}</span>
      <div className="dd-bar">
        <span style={{ width: widthPercent }} />
      </div>
      <span className="dd-row-value">{formattedValue}</span>
      <span className="dd-row-tag">{tag}</span>
    </div>
  )
}
