import { useReducer } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Chip } from '../components/Chip'
import { ModuleCard } from '../components/ModuleCard'
import {
  NodeDiagram,
  type DiagramEdge,
  type DiagramNode,
} from '../components/NodeDiagram'
import { Panel } from '../components/Panel'
import { PredictCard } from '../components/PredictCard'
import { ProbabilityRow } from '../components/ProbabilityRow'
import { Slider } from '../components/Slider'
import {
  module1Ideas,
  module1NodeIds,
  module1Page,
  module1PredictFeedback,
  module1PredictOptions,
  type PredictAnswerId,
} from '../content/module1'
import {
  amp,
  defaultParameters,
  edge,
  path,
  probabilities,
  type Bit,
  type Bits,
  type DiagramParams,
  type NodeId,
} from '../lib/dd/amplitude'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import './module1.css'

const TAU = 2 * Math.PI
const NODE_GEOMETRY: Record<NodeId, { x: number; y: number }> = {
  A: { x: 280, y: 80 },
  B: { x: 160, y: 190 },
  C: { x: 400, y: 190 },
  D: { x: 280, y: 330 },
}

const EDGE_DEFS: Array<{ id: string; edge: DiagramEdge }> = [
  { id: 'root', edge: { kind: 'line', x1: 280, y1: 32, x2: 280, y2: 80, active: true } },
  { id: 'A0', edge: { kind: 'line', x1: 270, y1: 104, x2: 170, y2: 168 } },
  { id: 'A1', edge: { kind: 'line', x1: 290, y1: 104, x2: 390, y2: 168 } },
  { id: 'B0', edge: { kind: 'path', d: 'M160 190 Q 180 275 280 330' } },
  { id: 'B1', edge: { kind: 'path', d: 'M160 190 Q 235 250 280 330' } },
  { id: 'C0', edge: { kind: 'path', d: 'M400 190 Q 325 250 280 330' } },
  { id: 'C1', edge: { kind: 'path', d: 'M400 190 Q 380 275 280 330' } },
  { id: 'D0', edge: { kind: 'path', d: 'M280 330 Q 250 390 272 440' } },
  { id: 'D1', edge: { kind: 'path', d: 'M280 330 Q 310 390 288 440' } },
]

type State = {
  selectedNode: NodeId
  bits: Bits
  parameters: DiagramParams
  chosenAnswer: PredictAnswerId | null
}

type Action =
  | { type: 'selectNode'; node: NodeId }
  | { type: 'toggleBit'; index: 0 | 1 | 2 }
  | { type: 'setParam'; key: 'r' | 'w' | 'f'; value: number }
  | { type: 'chooseAnswer'; id: PredictAnswerId }
  | { type: 'reset' }

function initialState(): State {
  return {
    selectedNode: 'C',
    bits: [1, 0, 1],
    parameters: defaultParameters(),
    chosenAnswer: null,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'selectNode':
      return { ...state, selectedNode: action.node }
    case 'toggleBit': {
      const bits = [...state.bits] as Bits
      bits[action.index] = (1 - bits[action.index]) as Bit
      return { ...state, bits }
    }
    case 'setParam': {
      if (Number.isNaN(action.value)) return state
      return {
        ...state,
        parameters: {
          ...state.parameters,
          [state.selectedNode]: {
            ...state.parameters[state.selectedNode],
            [action.key]: action.value,
          },
        },
      }
    }
    case 'chooseAnswer':
      return { ...state, chosenAnswer: action.id }
    case 'reset':
      return {
        ...state,
        selectedNode: 'C',
        bits: [1, 0, 1],
        parameters: defaultParameters(),
      }
    default:
      return state
  }
}

function formatDecimal(value: number, digits = 2): string {
  return value.toFixed(digits).replace('.', ',')
}

function buildEdges(bits: Bits): DiagramEdge[] {
  const pathNodes = path(bits)
  const activeIds = new Set([
    `A${bits[0]}`,
    `${pathNodes[1]}${bits[1]}`,
    `D${bits[2]}`,
  ])

  return EDGE_DEFS.map(({ id, edge: edgeDef }) => {
    if (id === 'root') return edgeDef
    return { ...edgeDef, active: activeIds.has(id) }
  })
}

function buildNodes(bits: Bits, selectedNode: NodeId): DiagramNode[] {
  const pathNodes = new Set(path(bits))
  return module1NodeIds.map((id) => {
    const geo = NODE_GEOMETRY[id]
    return {
      id,
      x: geo.x,
      y: geo.y,
      label: id,
      r: 28,
      labelDy: 9,
      active: pathNodes.has(id),
      editing: selectedNode === id,
      ringR: selectedNode === id ? 40 : undefined,
    }
  })
}

function rowTag(
  isCurrent: boolean,
  throughSelected: boolean,
  selectedNode: NodeId,
): string {
  const parts: string[] = []
  if (isCurrent) parts.push(module1Page.tagChosenPath)
  if (throughSelected) parts.push(`${module1Page.tagThroughNodePrefix}${selectedNode}`)
  return parts.join(' · ')
}

export default function Module1() {
  useDocumentTitle(module1Page.documentTitle)
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const { selectedNode, bits, parameters, chosenAnswer } = state

  const pathNodes = path(bits)
  const total = amp(parameters, bits)
  const probs = probabilities(parameters)
  const sumP = probs.reduce((acc, p) => acc + p, 0)
  const selected = parameters[selectedNode]
  const bitsText = bits.join('')
  const diagramAriaLabel = `${module1Page.diagramAriaBase} Camino ${bits.join('-')}.`

  const steps = ([0, 1, 2] as const).map((i) => {
    const node = pathNodes[i]!
    const e = edge(parameters[node], bits[i]!)
    return {
      head: `q${i + 1} · nodo ${node} · arista ${bits[i]}`,
      mag: formatDecimal(e.m),
      ph: formatDecimal(e.ph % TAU),
    }
  })

  const feedback =
    chosenAnswer === null ? null : module1PredictFeedback[chosenAnswer]

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/', label: module1Page.pagerPrevLabel }}
          next={{ to: '/modulo-2', label: module1Page.pagerNextLabel }}
          note={module1Page.pagerNote}
        />
      }
    >
      <div className="m1-stack">
        <section className="m1-intro" aria-labelledby="m1-title">
          <p className="eyebrow m1-breadcrumb">
            <Link to="/">{module1Page.breadcrumbHome}</Link>
            {' / '}
            {module1Page.breadcrumbCurrent}
          </p>
          <h1 id="m1-title" className="h1">
            {module1Page.title}
          </h1>
          <p className="lead">{module1Page.lead}</p>
          <p className="body-sm m1-slides">{module1Page.slidesNote}</p>
        </section>

        <PredictCard
          eyebrow={module1Page.predictEyebrow}
          question={module1Page.predictQuestion}
          options={[...module1PredictOptions]}
          correctId={module1Page.predictCorrectId}
          selectedId={chosenAnswer}
          onSelect={(id) => dispatch({ type: 'chooseAnswer', id: id as PredictAnswerId })}
          feedback={feedback}
        />

        <section className="m1-move" aria-labelledby="m1-move-title">
          <div className="m1-section-head">
            <div className="m1-section-titles">
              <p className="eyebrow">{module1Page.moveEyebrow}</p>
              <h2 id="m1-move-title" className="h2">
                {module1Page.moveHeading}
              </h2>
            </div>
            <Button variant="secondary" onClick={() => dispatch({ type: 'reset' })}>
              {module1Page.resetLabel}
            </Button>
          </div>

          <div className="m1-move-grid">
            <Panel className="m1-diagram-panel">
              <NodeDiagram
                root={{ cx: 280, cy: 32, r: 9 }}
                nodes={buildNodes(bits, selectedNode)}
                edges={buildEdges(bits)}
                ariaLabel={diagramAriaLabel}
              />
              <p className="body-sm m1-diagram-hint">{module1Page.diagramHint}</p>
              <div className="m1-bits">
                <p className="m1-bits-heading">{module1Page.bitsHeading}</p>
                <div className="m1-chip-row">
                  {([0, 1, 2] as const).map((index) => (
                    <Chip
                      key={index}
                      bit
                      pressed={bits[index] === 1}
                      onPressedChange={() => dispatch({ type: 'toggleBit', index })}
                    >
                      {`q${index + 1} = ${bits[index]}`}
                    </Chip>
                  ))}
                </div>
              </div>
            </Panel>

            <div className="m1-controls">
              <Panel className="m1-edit-panel">
                <p className="m1-edit-heading">{module1Page.editNodeHeading}</p>
                <div className="m1-chip-row">
                  {module1NodeIds.map((node) => (
                    <Chip
                      key={node}
                      pressed={selectedNode === node}
                      onPressedChange={() => dispatch({ type: 'selectNode', node })}
                    >
                      {node}
                    </Chip>
                  ))}
                </div>
                <div className="m1-sliders">
                  <Slider
                    id="m1-sl-r"
                    label={module1Page.sliderR}
                    value={selected.r}
                    min={0}
                    max={1}
                    step={0.01}
                    formattedValue={formatDecimal(selected.r)}
                    onChange={(value) => dispatch({ type: 'setParam', key: 'r', value })}
                  />
                  <Slider
                    id="m1-sl-w"
                    label={module1Page.sliderOmega}
                    value={selected.w}
                    min={0}
                    max={6.28}
                    step={0.01}
                    formattedValue={formatDecimal(selected.w)}
                    violet
                    onChange={(value) => dispatch({ type: 'setParam', key: 'w', value })}
                  />
                  <Slider
                    id="m1-sl-f"
                    label={module1Page.sliderPhi}
                    value={selected.f}
                    min={0}
                    max={6.28}
                    step={0.01}
                    formattedValue={formatDecimal(selected.f)}
                    violet
                    onChange={(value) => dispatch({ type: 'setParam', key: 'f', value })}
                  />
                </div>
                <p className="body-sm m1-edge-note">{module1Page.edgeConvention}</p>
              </Panel>

              <Panel accent className="m1-amp-panel">
                <p className="m1-amp-title">
                  {module1Page.amplitudePrefix}
                  {bitsText}
                  {module1Page.amplitudeSuffix}
                </p>
                {steps.map((step) => (
                  <div key={step.head} className="m1-amp-step">
                    <span className="m1-amp-step-head">{step.head}</span>
                    <span className="m1-amp-step-values">
                      módulo {step.mag} · fase {step.ph}
                    </span>
                  </div>
                ))}
                <p className="m1-amp-total">
                  módulo = {formatDecimal(total.m, 3)} → probabilidad ={' '}
                  {formatDecimal(total.m * total.m, 3)}
                </p>
                <p className="body-sm m1-amp-note">{module1Page.amplitudePhasesNote}</p>
              </Panel>
            </div>
          </div>
        </section>

        <section className="m1-check" aria-labelledby="m1-check-title">
          <div className="m1-section-titles">
            <p className="eyebrow">{module1Page.checkEyebrow}</p>
            <h2 id="m1-check-title" className="h2">
              {module1Page.checkHeading}
            </h2>
          </div>

          <Panel className="m1-prob-panel">
            {probs.map((probability, k) => {
              const rowBits: Bits = [
                ((k >> 2) & 1) as Bit,
                ((k >> 1) & 1) as Bit,
                (k & 1) as Bit,
              ]
              const label = rowBits.join('')
              const isCurrent =
                rowBits[0] === bits[0] &&
                rowBits[1] === bits[1] &&
                rowBits[2] === bits[2]
              const through = path(rowBits).includes(selectedNode)
              return (
                <ProbabilityRow
                  key={label}
                  label={`|${label}⟩`}
                  probability={probability}
                  formattedValue={formatDecimal(probability, 3)}
                  selected={isCurrent}
                  tag={rowTag(isCurrent, through, selectedNode)}
                />
              )
            })}
            <p className="m1-prob-sum">
              {module1Page.sumPrefix}
              {formatDecimal(sumP, 3)}
            </p>
          </Panel>

          <div className="m1-ideas">
            {module1Ideas.map((idea) => (
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
