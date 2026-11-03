import { useState } from 'react'
import { Button, TextLink } from '../components/Button'
import { Chip } from '../components/Chip'
import { ModuleCard } from '../components/ModuleCard'
import { NodeDiagram } from '../components/NodeDiagram'
import { Panel } from '../components/Panel'
import { PredictCard } from '../components/PredictCard'
import { ProbabilityRow } from '../components/ProbabilityRow'
import { Slider } from '../components/Slider'
import { StatTile } from '../components/StatTile'

const PREDICT_OPTIONS = [
  { id: 'paths', label: 'Solo las de los caminos que pasan por ese nodo' },
  { id: 'all', label: 'Las ocho, siempre' },
  { id: 'none', label: 'Ninguna: r solo cambia la fase' },
]

const DIAGRAM_EDGES = [
  { kind: 'line' as const, x1: 280, y1: 32, x2: 280, y2: 80, active: true },
  { kind: 'line' as const, x1: 270, y1: 104, x2: 170, y2: 168 },
  { kind: 'line' as const, x1: 290, y1: 104, x2: 390, y2: 168, active: true },
  { kind: 'path' as const, d: 'M160 190 Q 180 275 280 330' },
  { kind: 'path' as const, d: 'M160 190 Q 235 250 280 330' },
  { kind: 'path' as const, d: 'M400 190 Q 325 250 280 330', active: true },
  { kind: 'path' as const, d: 'M400 190 Q 380 275 280 330' },
]

const DIAGRAM_NODES = [
  { id: 'A', x: 280, y: 80, label: 'A', r: 28, labelDy: 9, active: true },
  { id: 'B', x: 160, y: 190, label: 'B', r: 28, labelDy: 9 },
  {
    id: 'C',
    x: 400,
    y: 190,
    label: 'C',
    r: 28,
    labelDy: 9,
    active: true,
    editing: true,
    ringR: 40,
  },
  { id: 'D', x: 280, y: 330, label: 'D', r: 28, labelDy: 9, active: true },
]

function formatDecimal(value: number, digits: number): string {
  return value.toFixed(digits).replace('.', ',')
}

export default function Components() {
  const [nodePressed, setNodePressed] = useState('C')
  const [bitQ1, setBitQ1] = useState(false)
  const [bitQ2, setBitQ2] = useState(false)
  const [r, setR] = useState(0.3)
  const [omega, setOmega] = useState(0.5)
  const [correctSelected, setCorrectSelected] = useState<string | null>('paths')
  const [wrongSelected, setWrongSelected] = useState<string | null>('all')

  return (
    <main
      style={{
        maxWidth: 'var(--container)',
        marginInline: 'auto',
        padding: 'var(--space-32)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-64)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <p className="eyebrow">Sistema de diseño</p>
        <h1 className="h1">Componentes</h1>
        <p className="lead">
          Los nueve componentes base con los estados de cada preview del sistema de diseño.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Acciones</p>
          <h2 className="h2">Button</h2>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-12)',
            alignItems: 'center',
          }}
        >
          <Button variant="primary">Entrenar</Button>
          <Button variant="secondary">+50 épocas</Button>
          <Button variant="primary" href="#">
            Empezar con el módulo 1
          </Button>
          <TextLink href="#">Abrir módulo 1 →</TextLink>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Acciones</p>
          <h2 className="h2">Chip</h2>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-12)',
            alignItems: 'center',
          }}
        >
          {(['A', 'B', 'C', 'D'] as const).map((node) => (
            <Chip
              key={node}
              pressed={nodePressed === node}
              onPressedChange={() => setNodePressed(node)}
            >
              {node}
            </Chip>
          ))}
          <Chip bit pressed={bitQ1} onPressedChange={setBitQ1}>
            q1 = 1
          </Chip>
          <Chip bit pressed={bitQ2} onPressedChange={setBitQ2}>
            q2 = 0
          </Chip>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Superficies</p>
          <h2 className="h2">Panel</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, var(--space-96)), 1fr))',
            gap: 'var(--space-12)',
          }}
        >
          <Panel>
            <p className="dd-eyebrow">2 · Mueve</p>
            <p className="body" style={{ marginTop: 'var(--space-8)', color: 'var(--ink-muted)' }}>
              Panel estándar sobre el fondo de página.
            </p>
          </Panel>
          <Panel accent>
            <p className="body" style={{ margin: 0, fontWeight: 600 }}>
              Amplitud de |101⟩
            </p>
            <p className="value" style={{ marginTop: 'var(--space-8)', color: 'var(--accent)' }}>
              módulo = 0,129
            </p>
          </Panel>
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Controles</p>
          <h2 className="h2">Slider</h2>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-16)',
            maxWidth: 'var(--space-96)',
          }}
        >
          <Slider
            id="slider-r"
            label="r (reparte la probabilidad)"
            value={r}
            min={0}
            max={1}
            step={0.01}
            formattedValue={formatDecimal(r, 2)}
            onChange={setR}
          />
          <Slider
            id="slider-omega"
            label="ω (fase de la arista 0)"
            value={omega}
            min={0}
            max={6.28}
            step={0.01}
            formattedValue={formatDecimal(omega, 2)}
            violet
            onChange={setOmega}
          />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Datos</p>
          <h2 className="h2">StatTile</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, var(--space-96)), 1fr))',
            gap: 'var(--space-12)',
          }}
        >
          <StatTile label="Época" value="350" />
          <StatTile label="Energía actual" value="−4,533" />
          <StatTile label="Energía exacta" value="−4,759" />
          <StatTile label="Error" value="0,2260" accent />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Datos</p>
          <h2 className="h2">ProbabilityRow</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <ProbabilityRow
            label="|101⟩"
            probability={0.161}
            formattedValue="0,161"
            tag="camino elegido · pasa por el nodo C"
            selected
          />
          <ProbabilityRow label="|100⟩" probability={0.201} formattedValue="0,201" />
          <ProbabilityRow label="|011⟩" probability={0.118} formattedValue="0,118" />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Superficies</p>
          <h2 className="h2">PredictCard</h2>
        </div>
        <PredictCard
          eyebrow="1 · Predice"
          question="Si mueves r del nodo C, ¿qué probabilidades cambian?"
          options={[...PREDICT_OPTIONS]}
          correctId="paths"
          selectedId={correctSelected}
          onSelect={setCorrectSelected}
          feedback={
            correctSelected
              ? {
                  verdict: 'Correcto.',
                  detail: 'El nodo C solo está en los caminos que empiezan en 1.',
                }
              : null
          }
        />
        <PredictCard
          eyebrow="1 · Predice"
          question="Si mueves r del nodo C, ¿qué probabilidades cambian?"
          options={[...PREDICT_OPTIONS]}
          correctId="paths"
          selectedId={wrongSelected}
          onSelect={setWrongSelected}
          feedback={
            wrongSelected
              ? {
                  verdict: 'No siempre.',
                  detail: 'r en C solo afecta los caminos que pasan por ese nodo.',
                }
              : null
          }
        />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Navegación</p>
          <h2 className="h2">ModuleCard</h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, var(--space-96)), 1fr))',
            gap: 'var(--space-12)',
            alignItems: 'stretch',
          }}
        >
          <ModuleCard
            variant="module"
            eyebrow="Módulo 1"
            title="Lee un estado en el diagrama"
            description="Recorre un camino y multiplica las aristas para obtener una amplitud."
            href="#"
            linkLabel="Abrir módulo 1 →"
          />
          <ModuleCard
            variant="idea"
            title="La suma siempre da 1"
            description="En cada nodo, |izquierda|² + |derecha|² = 1."
          />
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <p className="eyebrow">Diagramas</p>
          <h2 className="h2">NodeDiagram</h2>
        </div>
        <div style={{ maxWidth: 'var(--space-96)' }}>
          <NodeDiagram
            root={{ cx: 280, cy: 32, r: 9 }}
            nodes={DIAGRAM_NODES}
            edges={DIAGRAM_EDGES}
            ariaLabel="Diagrama de decisión de tres qubits con el camino 1-0-1 resaltado"
          />
        </div>
      </section>
    </main>
  )
}
