import { TextLink } from './Button'

type ModuleCardModuleProps = {
  variant: 'module'
  eyebrow: string
  title: string
  description: string
  href: string
  linkLabel: string
  className?: string
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
    return (
      <div className={joinClassNames('dd-module', props.className)}>
        <p className="dd-eyebrow">{props.eyebrow}</p>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        <TextLink href={props.href}>{props.linkLabel}</TextLink>
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
