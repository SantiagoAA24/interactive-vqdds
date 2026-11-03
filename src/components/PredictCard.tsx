type PredictOption = {
  id: string
  label: string
}

type PredictCardProps = {
  eyebrow: string
  question: string
  options: PredictOption[]
  correctId: string
  selectedId: string | null
  onSelect: (id: string) => void
  feedback: { verdict: string; detail: string } | null
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

function optionState(
  optionId: string,
  selectedId: string | null,
  correctId: string,
): 'correct' | 'wrong' | undefined {
  if (selectedId === null) return undefined
  if (optionId === correctId) return 'correct'
  if (optionId === selectedId) return 'wrong'
  return undefined
}

export function PredictCard({
  eyebrow,
  question,
  options,
  correctId,
  selectedId,
  onSelect,
  feedback,
  className,
}: PredictCardProps) {
  return (
    <div className={joinClassNames('dd-band', className)}>
      <div>
        <p className="dd-eyebrow">{eyebrow}</p>
        <h2 className="dd-question">{question}</h2>
      </div>
      <div className="dd-options">
        {options.map((option) => {
          const state = optionState(option.id, selectedId, correctId)
          return (
            <button
              key={option.id}
              type="button"
              className="dd-option"
              data-state={state}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {feedback ? (
        <p className="dd-feedback" aria-live="polite">
          <b>{feedback.verdict}</b> {feedback.detail}
        </p>
      ) : null}
    </div>
  )
}
