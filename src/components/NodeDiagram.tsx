type DiagramNode = {
  id: string
  x: number
  y: number
  label: string
  r: number
  active?: boolean
  editing?: boolean
  ringR?: number
  labelDy?: number
}

type DiagramEdge =
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; active?: boolean }
  | { kind: 'path'; d: string; active?: boolean }

type NodeDiagramProps = {
  viewBox?: string
  root?: { cx: number; cy: number; r: number }
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  ariaLabel: string
  className?: string
}

function joinClassNames(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}

function edgeClassName(active?: boolean): string {
  return joinClassNames('edge', active && 'on')
}

function nodeClassName(active?: boolean): string {
  return joinClassNames('node', active && 'on')
}

export function NodeDiagram({
  viewBox = '0 0 560 500',
  root,
  nodes,
  edges,
  ariaLabel,
  className,
}: NodeDiagramProps) {
  return (
    <svg
      className={joinClassNames('dd-diagram', className)}
      viewBox={viewBox}
      width="100%"
      role="img"
      aria-label={ariaLabel}
    >
      {edges.map((edge, index) => {
        if (edge.kind === 'line') {
          return (
            <line
              key={`edge-${index}`}
              className={edgeClassName(edge.active)}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
            />
          )
        }

        return (
          <path key={`edge-${index}`} className={edgeClassName(edge.active)} d={edge.d} />
        )
      })}

      {root ? (
        <circle cx={root.cx} cy={root.cy} r={root.r} fill="var(--accent)" />
      ) : null}

      {nodes.map((node) => (
        <circle
          key={`node-${node.id}`}
          className={nodeClassName(node.active)}
          cx={node.x}
          cy={node.y}
          r={node.r}
        />
      ))}

      {nodes
        .filter((node) => node.editing && node.ringR !== undefined)
        .map((node) => (
          <circle
            key={`ring-${node.id}`}
            className="ring"
            cx={node.x}
            cy={node.y}
            r={node.ringR}
          />
        ))}

      {nodes.map((node) => (
        <text key={`label-${node.id}`} x={node.x} y={node.y + (node.labelDy ?? 0)}>
          {node.label}
        </text>
      ))}
    </svg>
  )
}

export type { DiagramNode, DiagramEdge, NodeDiagramProps }
