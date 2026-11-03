type SliderProps = {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  formattedValue: string
  violet?: boolean
  onChange: (value: number) => void
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  formattedValue,
  violet = false,
  onChange,
  className,
}: SliderProps) {
  return (
    <div className={joinClassNames('dd-slider', className)}>
      <label className="dd-slider-head" htmlFor={id}>
        <span>{label}</span>
        <span className="dd-slider-value">{formattedValue}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={violet ? 'is-violet' : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  )
}
