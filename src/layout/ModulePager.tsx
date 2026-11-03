import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type PagerLink = {
  to: string
  label: string
}

type ModulePagerProps = {
  prev?: PagerLink
  next?: PagerLink
  note?: ReactNode
}

export function ModulePager({ prev, next, note }: ModulePagerProps) {
  return (
    <div className="dd-pager">
      {prev ? (
        <Link to={prev.to} className="dd-pager-link body">
          {prev.label}
        </Link>
      ) : (
        <span className="dd-pager-spacer" aria-hidden="true" />
      )}
      {note !== undefined ? <p className="dd-pager-note caption">{note}</p> : null}
      {next ? (
        <Link to={next.to} className="dd-pager-link dd-pager-link--next body">
          {next.label}
        </Link>
      ) : (
        <span className="dd-pager-spacer" aria-hidden="true" />
      )}
    </div>
  )
}
