export type NodeId = 'A' | 'B' | 'C' | 'D'
export type Bit = 0 | 1
export type Bits = [Bit, Bit, Bit]
export type NodeParams = { r: number; w: number; f: number }
export type DiagramParams = Record<NodeId, NodeParams>
export type EdgeAmp = { m: number; ph: number }

export function defaultParameters(): DiagramParams {
  return {
    A: { r: 0.8, w: 0, f: 0 },
    B: { r: 0.6, w: 0.5, f: 1.2 },
    C: { r: 0.3, w: 0, f: 2.0 },
    D: { r: 0.7, w: 0.4, f: 1.57 },
  }
}

export function path(bits: Bits): NodeId[] {
  return ['A', bits[0] === 0 ? 'B' : 'C', 'D']
}

export function edge(node: NodeParams, bit: Bit): EdgeAmp {
  return bit === 0
    ? { m: node.r, ph: node.w }
    : { m: Math.sqrt(Math.max(0, 1 - node.r * node.r)), ph: node.f }
}

export function amp(params: DiagramParams, bits: Bits): EdgeAmp {
  const nodes = path(bits)
  let m = 1
  let ph = 0
  for (let i = 0; i < 3; i++) {
    const e = edge(params[nodes[i]!], bits[i]!)
    m *= e.m
    ph += e.ph
  }
  return { m, ph }
}

export function probabilities(params: DiagramParams): number[] {
  const out: number[] = []
  for (let k = 0; k < 8; k++) {
    const bits: Bits = [((k >> 2) & 1) as Bit, ((k >> 1) & 1) as Bit, (k & 1) as Bit]
    const a = amp(params, bits)
    out.push(a.m * a.m)
  }
  return out
}
