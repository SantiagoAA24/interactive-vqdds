export type StateKey = 'prod' | 'bb' | 'b23' | 'ghz' | 'w' | 'mix' | 'rnd'

export type AnalyzeResult = {
  amplitudes: number[]
  levels: [number, number, number, number]
  total: number
  fidelity: number
  approx: number[]
}

/** Fixed Accordion ansatz node counts per level (q1..q4). */
export const ACCORDION_LEVELS: [number, number, number, number] = [1, 2, 1, 2]
export const ACCORDION_TOTAL = 6

const GENERIC_AMPS = [
  0.31, -0.12, 0.44, 0.05, -0.27, 0.38, 0.09, -0.33, 0.21, 0.15, -0.41, 0.28, 0.07,
  -0.19, 0.36, 0.24,
]

function normalize(v: number[]): number[] {
  const n = Math.sqrt(v.reduce((a, x) => a + x * x, 0))
  return v.map((x) => x / n)
}

/** 16 real amplitudes for a named 4-qubit state (L2-normalized). */
export function stateAmplitudes(key: StateKey, mix: number): number[] {
  const v = new Array<number>(16).fill(0)
  if (key === 'prod') {
    v.fill(0.25)
  } else if (key === 'bb') {
    for (const i of [0, 3, 12, 15]) v[i] = 0.5
  } else if (key === 'b23') {
    for (let i = 0; i < 16; i++) {
      const b2 = (i >> 2) & 1
      const b3 = (i >> 1) & 1
      if (b2 === b3) v[i] = 1 / Math.sqrt(8)
    }
  } else if (key === 'ghz') {
    v[0] = 1 / Math.SQRT2
    v[15] = 1 / Math.SQRT2
  } else if (key === 'w') {
    for (const i of [8, 4, 2, 1]) v[i] = 0.5
  } else if (key === 'mix') {
    const t = (mix * Math.PI) / 2
    const c = Math.cos(t)
    const s = Math.sin(t)
    for (let i = 0; i < 16; i++) v[i] = c * 0.25
    v[0]! += s / Math.SQRT2
    v[15]! += s / Math.SQRT2
  } else {
    for (let i = 0; i < 16; i++) v[i] = GENERIC_AMPS[i]!
  }
  return normalize(v)
}

/**
 * Exact decision-diagram node count per level for a 4-qubit amplitude vector.
 * Sub-vectors that are proportional (tolerance 1e-9) share one node.
 */
export function levelNodeCounts(v: number[]): [number, number, number, number] {
  const out: number[] = []
  for (let L = 1; L <= 4; L++) {
    const len = 1 << (5 - L)
    const reps: Array<{ s: number[]; n: number }> = []
    for (let p = 0; p < 1 << (L - 1); p++) {
      const s = v.slice(p * len, (p + 1) * len)
      const ns = s.reduce((a, x) => a + x * x, 0)
      if (ns < 1e-12) continue
      let found = false
      for (const r of reps) {
        let d = 0
        for (let i = 0; i < len; i++) d += s[i]! * r.s[i]!
        if (d * d >= (1 - 1e-9) * ns * r.n) {
          found = true
          break
        }
      }
      if (!found) reps.push({ s, n: ns })
    }
    out.push(reps.length)
  }
  return out as [number, number, number, number]
}

/**
 * Best Accordion fidelity for blocks (q1,q2)|(q3,q4): largest singular value
 * squared of the 4×4 reshape, via power iteration on the Gram matrix.
 */
export function accordionApprox(v: number[]): { fidelity: number; approx: number[] } {
  const M = [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => v[i * 4 + j]!))
  const G = [0, 1, 2, 3].map((a) =>
    [0, 1, 2, 3].map((b) => M.reduce((s, row) => s + row[a]! * row[b]!, 0)),
  )
  let w = [0.9, 0.5, 0.3, 0.7]
  for (let it = 0; it < 400; it++) {
    const x = G.map((row) => row.reduce((s, g, k) => s + g * w[k]!, 0))
    const n = Math.sqrt(x.reduce((a, y) => a + y * y, 0))
    if (n < 1e-14) break
    w = x.map((y) => y / n)
  }
  const Gw = G.map((row) => row.reduce((s, g, k) => s + g * w[k]!, 0))
  const lam = w.reduce((s, x, k) => s + x * Gw[k]!, 0)
  const Mw = M.map((row) => row.reduce((s, m, k) => s + m * w[k]!, 0))
  const nu = Math.sqrt(Mw.reduce((a, y) => a + y * y, 0)) || 1
  const u = Mw.map((y) => y / nu)
  const approx: number[] = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) approx.push(u[i]! * w[j]!)
  }
  return { fidelity: Math.min(1, lam), approx }
}

export function analyzeState(key: StateKey, mix: number): AnalyzeResult {
  const amplitudes = stateAmplitudes(key, mix)
  const levels = levelNodeCounts(amplitudes)
  const { fidelity, approx } = accordionApprox(amplitudes)
  return {
    amplitudes,
    levels,
    total: levels.reduce((a, b) => a + b, 0),
    fidelity,
    approx,
  }
}
