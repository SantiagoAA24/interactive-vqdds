import type { ReactNode } from 'react'

type ChipProps = {
  children: ReactNode
  pressed: boolean
  onPressedChange?: (next: boolean) => void
  bit?: boolean
  disabled?: boolean
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function Chip({
  children,
  pressed,
  onPressedChange,
  bit = false,
  disabled,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      className={joinClassNames('dd-chip', bit && 'dd-chip--bit', className)}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onPressedChange?.(!pressed)}
    >
      {children}
    </button>
  )
}
