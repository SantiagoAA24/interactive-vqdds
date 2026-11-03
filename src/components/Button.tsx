import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps = {
  variant: 'primary' | 'secondary'
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  href?: string
  to?: string
  className?: string
}

type TextLinkProps = {
  children: ReactNode
  className?: string
  href?: string
  to?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

export function Button({
  variant,
  children,
  type = 'button',
  disabled,
  onClick,
  href,
  to,
  className,
}: ButtonProps) {
  const variantClass = variant === 'primary' ? 'dd-btn--primary' : 'dd-btn--secondary'
  const classes = joinClassNames('dd-btn', variantClass, className)

  if (to !== undefined) {
    return (
      <Link className={classes} to={to} onClick={onClick}>
        {children}
      </Link>
    )
  }

  if (href !== undefined) {
    const external = isExternalHref(href)
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export function TextLink({ href, to, children, className }: TextLinkProps) {
  const classes = joinClassNames('dd-link', className)

  if (to !== undefined) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    )
  }

  if (href === undefined) {
    throw new Error('TextLink requires either `to` or `href`')
  }

  const external = isExternalHref(href)
  return (
    <a
      className={classes}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  )
}
