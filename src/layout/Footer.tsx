import type { ReactNode } from 'react'

type FooterProps = {
  children: ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="dd-footer">
      <div className="dd-footer-inner">{children}</div>
    </footer>
  )
}
