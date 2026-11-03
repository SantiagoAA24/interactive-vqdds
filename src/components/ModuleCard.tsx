import type { ReactNode } from 'react'
import { TextLink } from './Button'

type ModuleCardModuleProps = {
  variant: 'module'
  eyebrow: string
  title: string
  description: string
  linkLabel: string
  className?: string
  media?: ReactNode
  prompt?: string
  href?: string
  to?: string
}

type ModuleCardIdeaProps = {
  variant: 'idea'
  title: string
  description: string
  className?: string
}

type ModuleCardProps = ModuleCardModuleProps | ModuleCardIdeaProps

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

export function ModuleCard(props: ModuleCardProps) {
  if (props.variant === 'module') {
    const { href, to, linkLabel } = props
    if (href === undefined && to === undefined) {
      throw new Error('ModuleCard module variant requires either `to` or `href`')
    }

    return (
      <div className={joinClassNames('dd-module', props.className)}>
        {props.media}
        <p className="dd-eyebrow">{props.eyebrow}</p>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        {props.prompt !== undefined ? (
          <p className="home-module-prompt body">{props.prompt}</p>
        ) : null}
        <TextLink href={href} to={to}>
          {linkLabel}
        </TextLink>
      </div>
    )
  }

  return (
    <div className={joinClassNames('dd-card', props.className)}>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </div>
  )
}
