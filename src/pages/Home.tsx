import { Button, TextLink } from '../components/Button'
import { ModuleCard } from '../components/ModuleCard'
import { glossary } from '../content/glossary'
import {
  homeFooter,
  homeGlossarySection,
  homeGuide,
  homeHero,
  homeHowToSection,
  homeModulesSection,
} from '../content/home'
import { howToSteps } from '../content/howTo'
import { modules } from '../content/modules'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { PageShell } from '../layout/PageShell'
import './home.css'

function HeroDiagram() {
  return (
    <svg
      viewBox="0 0 520 600"
      role="img"
      aria-label={homeHero.heroAriaLabel}
    >
      <g
        stroke="var(--violet)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      >
        <line x1="260" y1="96" x2="140" y2="196" />
        <line x1="260" y1="96" x2="380" y2="196" />
        <path d="M140 196 Q 210 215 260 296" />
        <path d="M380 196 Q 350 250 260 296" />
        <path d="M380 196 Q 310 215 260 296" />
        <line x1="260" y1="296" x2="140" y2="396" />
        <path d="M140 396 Q 170 450 260 496" />
        <path d="M140 396 Q 210 415 260 496" />
        <path d="M380 396 Q 350 450 260 496" />
        <path d="M260 496 Q 235 530 258 552" />
      </g>
      <g
        stroke="var(--accent)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="260" y1="40" x2="260" y2="96" />
        <line x1="260" y1="96" x2="140" y2="196" />
        <path d="M140 196 Q 170 250 260 296" />
        <line x1="260" y1="296" x2="380" y2="396" />
        <path d="M380 396 Q 310 415 260 496" />
        <path d="M260 496 Q 285 530 262 552" />
      </g>
      <g fill="var(--surface)" strokeWidth="4">
        <circle cx="260" cy="96" r="28" stroke="var(--accent)" />
        <circle cx="140" cy="196" r="28" stroke="var(--accent)" />
        <circle cx="380" cy="196" r="28" stroke="var(--violet)" />
        <circle cx="260" cy="296" r="28" stroke="var(--accent)" />
        <circle cx="140" cy="396" r="28" stroke="var(--violet)" />
        <circle cx="380" cy="396" r="28" stroke="var(--accent)" />
        <circle cx="260" cy="496" r="28" stroke="var(--accent)" />
      </g>
      <circle cx="260" cy="34" r="10" fill="var(--accent)" />
      <rect
        x="240"
        y="552"
        width="40"
        height="40"
        rx="8"
        fill="var(--accent)"
      />
    </svg>
  )
}

function ModuleMediaPath({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="home-module-media">
      <svg viewBox="0 0 280 150" role="img" aria-label={ariaLabel}>
        <g
          stroke="var(--violet)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        >
          <line x1="140" y1="40" x2="200" y2="86" />
          <path d="M200 86 Q 190 108 150 120" />
          <path d="M200 86 Q 170 90 150 120" />
        </g>
        <g stroke="var(--accent)" strokeWidth="5" fill="none" strokeLinecap="round">
          <line x1="140" y1="12" x2="140" y2="40" />
          <line x1="140" y1="40" x2="80" y2="86" />
          <path d="M80 86 Q 90 108 130 120" />
        </g>
        <g fill="var(--surface)" strokeWidth="3.5">
          <circle cx="140" cy="40" r="14" stroke="var(--accent)" />
          <circle cx="80" cy="86" r="14" stroke="var(--accent)" />
          <circle cx="200" cy="86" r="14" stroke="var(--violet)" />
        </g>
        <circle cx="140" cy="10" r="6" fill="var(--accent)" />
        <rect x="128" y="120" width="24" height="22" rx="5" fill="var(--accent)" />
      </svg>
    </div>
  )
}

function ModuleMediaBars({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="home-module-media">
      <svg viewBox="0 0 280 150" role="img" aria-label={ariaLabel}>
        <line
          x1="14"
          y1="132"
          x2="266"
          y2="132"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <g fill="var(--accent)">
          <rect x="20" y="62" width="11" height="70" rx="2" />
          <rect x="51" y="92" width="11" height="40" rx="2" />
          <rect x="82" y="42" width="11" height="90" rx="2" />
          <rect x="113" y="102" width="11" height="30" rx="2" />
          <rect x="144" y="72" width="11" height="60" rx="2" />
          <rect x="175" y="32" width="11" height="100" rx="2" />
          <rect x="206" y="112" width="11" height="20" rx="2" />
          <rect x="237" y="82" width="11" height="50" rx="2" />
        </g>
        <g fill="var(--violet)">
          <rect x="33" y="70" width="11" height="62" rx="2" />
          <rect x="64" y="88" width="11" height="44" rx="2" />
          <rect x="95" y="52" width="11" height="80" rx="2" />
          <rect x="126" y="96" width="11" height="36" rx="2" />
          <rect x="157" y="76" width="11" height="56" rx="2" />
          <rect x="188" y="46" width="11" height="86" rx="2" />
          <rect x="219" y="104" width="11" height="28" rx="2" />
          <rect x="250" y="86" width="11" height="46" rx="2" />
        </g>
      </svg>
    </div>
  )
}

function ModuleMediaCurve({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="home-module-media">
      <svg viewBox="0 0 280 150" role="img" aria-label={ariaLabel}>
        <line
          x1="16"
          y1="122"
          x2="264"
          y2="122"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />
        <path
          d="M 16 28 C 50 30, 66 98, 112 110 S 200 120, 264 124"
          fill="none"
          stroke="var(--violet)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="28" r="6" fill="var(--violet)" />
      </svg>
    </div>
  )
}

function moduleMedia(id: string, ariaLabel: string) {
  if (id === 'modulo-1') return <ModuleMediaPath ariaLabel={ariaLabel} />
  if (id === 'modulo-2') return <ModuleMediaBars ariaLabel={ariaLabel} />
  return <ModuleMediaCurve ariaLabel={ariaLabel} />
}

export default function Home() {
  useDocumentTitle('Inicio · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <div className="home-footer">
          <p className="body-sm">
            {homeFooter.citationBefore}
            <i>{homeFooter.citationTitle}</i>
            {homeFooter.citationAfter}
            <TextLink href={homeFooter.arxivUrl}>{homeFooter.arxivLabel}</TextLink>.
          </p>
          <p className="body-sm">{homeFooter.didacticNote}</p>
        </div>
      }
    >
      <div className="home-stack">
        <section id="inicio" className="home-hero" aria-labelledby="home-hero-title">
          <div className="home-hero-copy">
            <p className="eyebrow">{homeHero.eyebrow}</p>
            <h1 id="home-hero-title" className="h1">
              {homeHero.title}
            </h1>
            <p className="lead">{homeHero.lead}</p>
            <div className="home-hero-actions">
              <Button variant="primary" to={homeHero.primaryTo}>
                {homeHero.primaryCta}
              </Button>
              <Button variant="secondary" href={homeHero.arxivUrl}>
                {homeHero.secondaryCta}
              </Button>
            </div>
          </div>
          <div className="home-hero-visual">
            <HeroDiagram />
          </div>
        </section>

        <section className="dd-band home-guide" aria-labelledby="home-guide-title">
          <p className="dd-eyebrow">{homeGuide.eyebrow}</p>
          <h2 id="home-guide-title" className="dd-question">
            {homeGuide.question}
          </h2>
        </section>

        <section id="modulos" className="home-section" aria-labelledby="home-modules-title">
          <div className="home-section-intro">
            <h2 id="home-modules-title" className="h2">
              {homeModulesSection.title}
            </h2>
            <p className="lead">{homeModulesSection.lead}</p>
          </div>
          <div className="home-modules-grid">
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                variant="module"
                eyebrow={module.eyebrow}
                title={module.title}
                description={module.description}
                prompt={module.prompt}
                to={module.to}
                linkLabel={module.linkLabel}
                media={moduleMedia(module.id, module.ariaLabel)}
              />
            ))}
          </div>
        </section>

        <section id="como-usar" className="home-section" aria-labelledby="home-howto-title">
          <h2 id="home-howto-title" className="h2">
            {homeHowToSection.title}
          </h2>
          <div className="home-howto-grid">
            {howToSteps.map((step) => (
              <div
                key={step.number}
                className={
                  step.accent === 'violet'
                    ? 'home-howto-step home-howto-step--violet'
                    : 'home-howto-step'
                }
              >
                <p className="home-howto-number h1">{step.number}</p>
                <h3 className="card-title">{step.title}</h3>
                <p className="body">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="glosario" className="home-section" aria-labelledby="home-glossary-title">
          <div className="home-section-intro">
            <h2 id="home-glossary-title" className="h2">
              {homeGlossarySection.title}
            </h2>
            <p className="lead">{homeGlossarySection.lead}</p>
          </div>
          <div className="home-glossary-grid">
            {glossary.map((entry) => (
              <ModuleCard
                key={entry.term}
                variant="idea"
                title={entry.term}
                description={entry.definition}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
