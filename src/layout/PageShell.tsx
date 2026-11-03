import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Nav } from './Nav'
import './layout.css'

type PageShellProps = {
  children: ReactNode
  footer?: ReactNode
}

export function PageShell({ children, footer }: PageShellProps) {
  return (
    <div className="dd-page">
      <Nav />
      <main className="dd-main">
        <div className="dd-container dd-main-inner">{children}</div>
      </main>
      {footer !== undefined ? <Footer>{footer}</Footer> : null}
    </div>
  )
}
