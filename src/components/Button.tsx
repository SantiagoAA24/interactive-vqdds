import type { ReactNode } from 'react'

type ButtonProps = {
  variant: 'primary' | 'secondary'
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  href?: string
  className?: string
}

type TextLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function Button({
  variant,
  children,
  type = 'button',
  disabled,
  onClick,
  href,
  className,
}: ButtonProps) {
  const variantClass = variant === 'primary' ? 'dd-btn--primary' : 'dd-btn--secondary'
  const classes = joinClassNames('dd-btn', variantClass, className)

  if (href !== undefined) {
    return (
      <a className={classes} href={href} onClick={onClick}>
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

export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <a className={joinClassNames('dd-link', className)} href={href}>
      {children}
    </a>
  )
}
