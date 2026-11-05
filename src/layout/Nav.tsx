import { Link, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/modulo-1', label: 'Módulo 1' },
  { to: '/modulo-2', label: 'Módulo 2' },
  { to: '/modulo-3', label: 'Módulo 3' },
  { to: '/paper', label: 'Paper' },
] as const

function BrandMark() {
  return (
    <svg
      className="dd-brand-mark"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="16"
        cy="7"
        r="5"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="2.5"
      />
      <circle
        cx="7"
        cy="24"
        r="5"
        fill="var(--surface)"
        stroke="var(--violet)"
        strokeWidth="2.5"
      />
      <circle
        cx="25"
        cy="24"
        r="5"
        fill="var(--surface)"
        stroke="var(--violet)"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export function Nav() {
  return (
    <header className="dd-header">
      <div className="dd-container dd-nav">
        <Link to="/" className="dd-brand">
          <BrandMark />
          <span className="card-title">Diagramas de decisión variacionales</span>
        </Link>
        <nav className="dd-nav-links" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item ? item.end : false}
              className={({ isActive }) =>
                isActive ? 'dd-nav-link dd-nav-link--active body' : 'dd-nav-link body'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
