import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Chip } from '../components/Chip'
import { LevelDots } from '../components/LevelDots'
import { ModuleCard } from '../components/ModuleCard'
import { Panel } from '../components/Panel'
import { PredictCard } from '../components/PredictCard'
import { Slider } from '../components/Slider'
import {
  module2Ideas,
  module2Page,
  module2PredictFeedback,
  module2PredictOptions,
  module2Presets,
  type PredictAnswerId,
} from '../content/module2'
import {
  ACCORDION_LEVELS,
  ACCORDION_TOTAL,
  analyzeState,
  type StateKey,
} from '../lib/dd/nodes'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import './module2.css'

type State = {
  estadoElegido: StateKey
  mezcla: number
  respuestaElegida: PredictAnswerId | null
}

function formatDecimal(value: number, digits = 2): string {
  return value.toFixed(digits).replace('.', ',')
}

function fitMessage(fidelity: number): string {
  if (fidelity > 0.9999) return module2Page.fitExact
  if (fidelity > 0.9) return module2Page.fitAlmost
  return module2Page.fitPoor
}

function bitsLabel(index: number): string {
  return [(index >> 3) & 1, (index >> 2) & 1, (index >> 1) & 1, index & 1].join('')
}

export default function Module2() {
  useDocumentTitle(module2Page.documentTitle)

  const [state, setState] = useState<State>({
    estadoElegido: 'ghz',
    mezcla: 0.5,
    respuestaElegida: null,
  })
  const { estadoElegido, mezcla, respuestaElegida } = state

  const current = useMemo(
    () => analyzeState(estadoElegido, mezcla),
    [estadoElegido, mezcla],
  )

  const presetMeta = useMemo(
    () => module2Presets.find((p) => p.key === estadoElegido)!,
    [estadoElegido],
  )

  const levelRows = useMemo(
    () =>
      ACCORDION_LEVELS.map((nAcc, i) => {
        const nExact = current.levels[i]!
        return {
          name: `q${i + 1}`,
          nExact,
          nAcc,
          tone: (nExact > nAcc ? 'accent' : 'violet') as 'accent' | 'violet',
        }
      }),
    [current.levels],
  )

  const comparisonRows = useMemo(
    () =>
      current.amplitudes.map((amp, i) => {
        const tp = amp * amp
        const ap = current.approx[i]! * current.approx[i]!
        return {
          lab: bitsLabel(i),
          tp,
          ap,
          tpText: formatDecimal(tp, 3),
          apText: formatDecimal(ap, 3),
        }
      }),
    [current.amplitudes, current.approx],
  )

  const overview = useMemo(
    () =>
      module2Presets.map((p) => {
        const a = analyzeState(p.key, mezcla)
        return {
          key: p.key,
          name: p.name,
          nodes: a.total,
          fid: formatDecimal(a.fidelity, 3),
          active: p.key === estadoElegido,
        }
      }),
    [mezcla, estadoElegido],
  )

  const feedback =
    respuestaElegida === null ? null : module2PredictFeedback[respuestaElegida]

  const fidText = formatDecimal(current.fidelity, 3)

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-1', label: module2Page.pagerPrevLabel }}
          next={{ to: '/modulo-3', label: module2Page.pagerNextLabel }}
          note={module2Page.pagerNote}
        />
      }
    >
      <div className="m2-stack">
        <section className="m2-intro" aria-labelledby="m2-title">
          <p className="eyebrow m2-breadcrumb">
            <Link to="/">{module2Page.breadcrumbHome}</Link>
            {' / '}
            {module2Page.breadcrumbCurrent}
          </p>
          <h1 id="m2-title" className="h1">
            {module2Page.title}
          </h1>
          <p className="lead">{module2Page.lead}</p>
          <p className="body-sm m2-slides">{module2Page.slidesNote}</p>
        </section>

        <PredictCard
          eyebrow={module2Page.predictEyebrow}
          question={module2Page.predictQuestion}
          options={[...module2PredictOptions]}
          correctId={module2Page.predictCorrectId}
          selectedId={respuestaElegida}
          onSelect={(id) =>
            setState((s) => ({
              ...s,
              respuestaElegida: id as PredictAnswerId,
              estadoElegido: 'ghz',
            }))
          }
          feedback={feedback}
        />

        <section className="m2-move" aria-labelledby="m2-move-title">
          <div className="m2-section-titles">
            <p className="eyebrow">{module2Page.moveEyebrow}</p>
            <h2 id="m2-move-title" className="h2">
              {module2Page.moveHeading}
            </h2>
          </div>

          <div className="m2-presets" role="group" aria-label={module2Page.moveHeading}>
            {module2Presets.map((p) => (
              <Chip
                key={p.key}
                className="m2-preset-chip"
                pressed={estadoElegido === p.key}
                onPressedChange={() =>
                  setState((s) => ({ ...s, estadoElegido: p.key }))
                }
              >
                {p.name}
              </Chip>
            ))}
          </div>

          <Panel className="m2-desc-panel">
            <p className="m2-desc">
              <b className="m2-desc-name">{presetMeta.name}.</b>{' '}
              <span className="m2-desc-body">{presetMeta.desc}</span>
            </p>
            {estadoElegido === 'mix' ? (
              <div className="m2-mix">
                <Slider
                  id="m2-sl-mix"
                  label={module2Page.mixSliderLabel}
                  value={mezcla}
                  min={0}
                  max={1}
                  step={0.01}
                  formattedValue={formatDecimal(mezcla)}
                  onChange={(value) =>
                    setState((s) => ({
                      ...s,
                      mezcla: Number.isNaN(value) ? s.mezcla : value,
                    }))
                  }
                />
              </div>
            ) : null}
          </Panel>

          <div className="m2-compare">
            <Panel className="m2-levels-panel">
              <p className="m2-levels-heading">{module2Page.levelsHeading}</p>
              <div className="m2-levels-grid">
                <div className="m2-levels-header">
                  <span />
                  <span>{module2Page.levelsExactCol}</span>
                  <span>{module2Page.levelsAccCol}</span>
                </div>
                {levelRows.map((lv) => (
                  <div key={lv.name} className="m2-levels-row">
                    <span className="m2-level-name">{lv.name}</span>
                    <div className="m2-level-cell">
                      <LevelDots
                        count={lv.nExact}
                        tone={lv.tone}
                        ariaLabel={`Exacto ${lv.name}: ${lv.nExact} nodos`}
                      />
                      <span className="m2-level-count">{lv.nExact}</span>
                    </div>
                    <div className="m2-level-cell">
                      <LevelDots
                        count={lv.nAcc}
                        tone="violet"
                        ariaLabel={`Accordion ${lv.name}: ${lv.nAcc} nodos`}
                      />
                      <span className="m2-level-count">{lv.nAcc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="m2-levels-summary">
                {module2Page.levelsSummaryPrefix} {current.total}{' '}
                {module2Page.levelsSummaryMiddle} {ACCORDION_TOTAL}{' '}
                {module2Page.levelsSummarySuffix}
              </p>
              <p className="m2-levels-note">{module2Page.levelsNote}</p>
            </Panel>

            <Panel accent className="m2-fid-panel">
              <p className="m2-fid-heading">{module2Page.fidelityHeading}</p>
              <p className="m2-fid-value" data-testid="m2-fidelity">
                {fidText}
              </p>
              <p className="m2-fid-caption">{module2Page.fidelityCaption}</p>
              <div className="m2-fid-track" aria-hidden="true">
                <div
                  className="m2-fid-fill"
                  style={{ width: `${(current.fidelity * 100).toFixed(1)}%` }}
                  data-testid="m2-fid-bar"
                />
              </div>
              <p className="m2-fit-msg">{fitMessage(current.fidelity)}</p>
            </Panel>
          </div>
        </section>

        <section className="m2-check" aria-labelledby="m2-check-title">
          <div className="m2-section-titles">
            <p className="eyebrow">{module2Page.checkEyebrow}</p>
            <h2 id="m2-check-title" className="h2">
              {module2Page.checkHeading}
            </h2>
          </div>

          <Panel className="m2-bars-panel">
            <div className="m2-legend">
              <span>
                <span className="m2-legend-swatch m2-legend-swatch--chosen" />
                {module2Page.legendChosen}
              </span>
              <span>
                <span className="m2-legend-swatch m2-legend-swatch--approx" />
                {module2Page.legendApprox}
              </span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.lab} className="m2-dual-row">
                <span className="m2-dual-label">|{row.lab}⟩</span>
                <div className="m2-dual-bars">
                  <div className="m2-dual-track">
                    <div
                      className="m2-dual-fill m2-dual-fill--chosen"
                      style={{ width: `${(row.tp * 100).toFixed(1)}%` }}
                      data-testid={`m2-bar-chosen-${row.lab}`}
                    />
                  </div>
                  <div className="m2-dual-track">
                    <div
                      className="m2-dual-fill m2-dual-fill--approx"
                      style={{ width: `${(row.ap * 100).toFixed(1)}%` }}
                      data-testid={`m2-bar-approx-${row.lab}`}
                    />
                  </div>
                </div>
                <span className="m2-dual-values">
                  {row.tpText} · {row.apText}
                </span>
              </div>
            ))}
          </Panel>

          <Panel className="m2-overview-panel">
            <p className="m2-overview-heading">{module2Page.overviewHeading}</p>
            {overview.map((row) => (
              <div
                key={row.key}
                className={
                  row.active ? 'm2-overview-row is-active' : 'm2-overview-row'
                }
              >
                <span className="m2-overview-name">{row.name}</span>
                <span className="m2-overview-nodes">
                  {row.nodes} {module2Page.overviewNodesSuffix}
                </span>
                <span className="m2-overview-fid">
                  {module2Page.overviewFidPrefix} {row.fid}
                </span>
              </div>
            ))}
          </Panel>

          <div className="m2-ideas">
            {module2Ideas.map((idea) => (
              <ModuleCard
                key={idea.title}
                variant="idea"
                title={idea.title}
                description={idea.description}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
