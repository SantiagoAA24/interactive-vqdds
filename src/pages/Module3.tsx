import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { ModuleCard } from '../components/ModuleCard'
import { Panel } from '../components/Panel'
import { PredictCard } from '../components/PredictCard'
import { Slider } from '../components/Slider'
import { StatTile } from '../components/StatTile'
import {
  module3Hamiltonians,
  module3Ideas,
  module3Page,
  module3PredictFeedback,
  module3PredictOptions,
  module3QubitOptions,
  type PredictAnswerId,
} from '../content/module3'
import { nParams } from '../lib/dd/ansatz'
import {
  energy,
  exactGroundEnergy,
  terms,
  type HamKey,
} from '../lib/dd/hamiltonian'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTrainer, type UseTrainerResult } from '../hooks/useTrainer'
import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import {
  buildLogErrorChart,
  formatEnergy,
  formatError,
  formatGradNorm,
  nodesParamsText,
  trainerStatusMessage,
} from './module3Model'
import './module3.css'

export type Module3Props = {
  /** Optional trainer injection for tests; production uses useTrainer(). */
  trainer?: UseTrainerResult
}

function formatDecimal(value: number, digits = 3): string {
  return value.toFixed(digits).replace('.', ',')
}

export default function Module3({ trainer: trainerProp }: Module3Props) {
  useDocumentTitle(module3Page.documentTitle)
  const hookTrainer = useTrainer()
  const { state, start, pause, step, setConfig } = trainerProp ?? hookTrainer

  const [pick, setPick] = useState<PredictAnswerId | null>(null)

  const e0 = exactGroundEnergy(state.ham, state.n)
  const E =
    state.t === 0
      ? energy(state.th, state.n, terms(state.ham, state.n))
      : e0 + (state.hist[state.hist.length - 1] ?? 0)
  const err = Math.max(0, E - e0)

  const chart = buildLogErrorChart(state.hist)
  const status = trainerStatusMessage({
    t: state.t,
    err,
    gnorm: state.gnorm,
    running: state.running,
  })
  const errText = formatError(err)
  const chartAriaLabel = `Gráfica del error de energía frente a la época en escala logarítmica. Época ${state.t}, error ${errText}.`

  const hamMeta =
    module3Hamiltonians.find((h) => h.key === state.ham) ?? module3Hamiltonians[0]!
  const feedback = pick === null ? null : module3PredictFeedback[pick]
  const runLabel = state.running ? module3Page.pauseLabel : module3Page.trainLabel

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-2', label: module3Page.pagerPrevLabel }}
          next={{ to: '/paper', label: module3Page.pagerNextLabel }}
          note={module3Page.pagerNote}
        />
      }
    >
      <div className="m3-stack">
        <section className="m3-intro" aria-labelledby="m3-title">
          <p className="eyebrow m3-breadcrumb">
            <Link to="/">{module3Page.breadcrumbHome}</Link>
            {' / '}
            {module3Page.breadcrumbCurrent}
          </p>
          <h1 id="m3-title" className="h1">
            {module3Page.title}
          </h1>
          <p className="lead">{module3Page.lead}</p>
          <p className="body-sm m3-slides">{module3Page.slidesNote}</p>
        </section>

        <PredictCard
          eyebrow={module3Page.predictEyebrow}
          question={module3Page.predictQuestion}
          options={[...module3PredictOptions]}
          correctId={module3Page.predictCorrectId}
          selectedId={pick}
          onSelect={(id) => setPick(id as PredictAnswerId)}
          feedback={feedback}
        />

        <section className="m3-move" aria-labelledby="m3-move-title">
          <div className="m3-section-titles">
            <p className="eyebrow">{module3Page.moveEyebrow}</p>
            <h2 id="m3-move-title" className="h2">
              {module3Page.moveHeading}
            </h2>
          </div>

          <div className="m3-move-grid">
            <Panel className="m3-config-panel">
              <fieldset className="m3-field">
                <legend className="m3-field-label">{module3Page.hamLabel}</legend>
                <div className="m3-chip-row">
                  {module3Hamiltonians.map((h) => (
                    <Chip
                      key={h.key}
                      className="m3-ham-chip"
                      pressed={state.ham === h.key}
                      onPressedChange={() => setConfig({ ham: h.key as HamKey })}
                    >
                      {h.name}
                    </Chip>
                  ))}
                </div>
                <p className="m3-field-help">{hamMeta.desc}</p>
              </fieldset>

              <fieldset className="m3-field">
                <legend className="m3-field-label">{module3Page.nLabel}</legend>
                <div className="m3-chip-row">
                  {module3QubitOptions.map((n) => (
                    <Chip
                      key={n}
                      className="m3-n-chip"
                      pressed={state.n === n}
                      onPressedChange={() => setConfig({ n })}
                    >
                      {String(n)}
                    </Chip>
                  ))}
                </div>
                <p className="m3-field-help">
                  {nodesParamsText(state.n, nParams(state.n))}
                </p>
              </fieldset>

              <div>
                <Slider
                  id="m3-sl-lr"
                  label={module3Page.lrLabel}
                  value={state.lr}
                  min={0.005}
                  max={0.2}
                  step={0.005}
                  formattedValue={formatDecimal(state.lr)}
                  violet
                  onChange={(value) => {
                    if (!Number.isNaN(value)) setConfig({ lr: value })
                  }}
                />
                <p className="m3-lr-help">{module3Page.lrHelp}</p>
              </div>

              <div className="m3-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (state.running) pause()
                    else start()
                  }}
                >
                  {runLabel}
                </Button>
                <Button variant="secondary" onClick={() => step(50)}>
                  {module3Page.step50Label}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setConfig({ seed: state.seed + 1 })}
                >
                  {module3Page.newSeedLabel}
                </Button>
              </div>
            </Panel>

            <Panel className="m3-metrics-panel">
              <p className="m3-chart-heading">{module3Page.chartHeading}</p>
              <svg
                className="m3-chart"
                viewBox="0 0 640 320"
                role="img"
                aria-label={chartAriaLabel}
              >
                <rect
                  className="m3-chart-plot"
                  x="56"
                  y="16"
                  width="568"
                  height="268"
                  rx="8"
                />
                <g className="m3-chart-grid">
                  {chart.yTicks.map((tick) => (
                    <line
                      key={tick.label}
                      x1="56"
                      x2="624"
                      y1={tick.y}
                      y2={tick.y}
                    />
                  ))}
                </g>
                <g className="m3-chart-tick" textAnchor="end">
                  {chart.yTicks.map((tick) => (
                    <text key={tick.label} x="48" y={tick.ty}>
                      {tick.label}
                    </text>
                  ))}
                </g>
                {chart.points ? (
                  <polyline className="m3-chart-curve" points={chart.points} />
                ) : null}
                <g className="m3-chart-axis">
                  <text x="56" y="312">
                    0
                  </text>
                  <text x="624" y="312" textAnchor="end">
                    {module3Page.chartEpochPrefix} {chart.xMax}
                  </text>
                </g>
              </svg>

              <div className="m3-stats">
                <StatTile
                  label={module3Page.statEpoch}
                  value={String(state.t)}
                />
                <StatTile
                  label={module3Page.statEnergy}
                  value={formatEnergy(E)}
                />
                <StatTile
                  label={module3Page.statExact}
                  value={formatEnergy(e0)}
                />
                <StatTile
                  label={module3Page.statError}
                  value={errText}
                  accent
                />
                <StatTile
                  label={module3Page.statGrad}
                  value={formatGradNorm(state.gnorm)}
                />
              </div>

              <p className="m3-status" data-testid="m3-status" aria-live="polite">
                {status}
              </p>
            </Panel>
          </div>
        </section>

        <section className="m3-check" aria-labelledby="m3-check-title">
          <div className="m3-section-titles">
            <p className="eyebrow">{module3Page.checkEyebrow}</p>
            <h2 id="m3-check-title" className="h2">
              {module3Page.checkHeading}
            </h2>
          </div>
          <div className="m3-ideas">
            {module3Ideas.map((idea) => (
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
