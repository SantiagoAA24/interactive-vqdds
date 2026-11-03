import { stateVec } from './ansatz'

export type HamKey = 'zz' | 'tfim0' | 'tfim1' | 'tfim10' | 'heis'
export type Pauli = 'X' | 'Y' | 'Z'
export type PauliSite = { q: number; p: Pauli }
export type Term = { c: number; ops: PauliSite[] }

const e0Cache: Record<string, number> = {}

/** Pauli terms for the five Hamiltonians (open chain). */
export function terms(ham: HamKey, n: number): Term[] {
  const T: Term[] = []
  const two = (p: Pauli, q: Pauli, i: number, j: number, c: number) =>
    T.push({ c, ops: [{ q: i, p }, { q: j, p: q }] })
  if (ham === 'zz') {
    two('Z', 'Z', 0, 1, 1)
    return T
  }
  if (ham === 'heis') {
    for (let i = 0; i < n - 1; i++) {
      two('X', 'X', i, i + 1, 1)
      two('Y', 'Y', i, i + 1, 1)
      two('Z', 'Z', i, i + 1, 1)
    }
    return T
  }
  const g = ham === 'tfim0' ? 0 : ham === 'tfim1' ? 1 : 10
  for (let i = 0; i < n - 1; i++) two('Z', 'Z', i, i + 1, 1)
  if (g !== 0) {
    for (let i = 0; i < n; i++) T.push({ c: g, ops: [{ q: i, p: 'X' }] })
  }
  return T
}

/** Apply a multi-qubit Pauli term to a complex state vector. */
export function apply(
  re: number[],
  im: number[],
  term: Term,
  n: number,
): { r: number[]; m: number[] } {
  let r = re
  let m = im
  for (const op of term.ops) {
    const bit = 1 << (n - 1 - op.q)
    const N = re.length
    const r2 = new Array<number>(N)
    const m2 = new Array<number>(N)
    for (let i = 0; i < N; i++) {
      const j = i ^ bit
      const one = (i & bit) !== 0
      if (op.p === 'X') {
        r2[i] = r[j]!
        m2[i] = m[j]!
      } else if (op.p === 'Z') {
        const s = one ? -1 : 1
        r2[i] = s * r[i]!
        m2[i] = s * m[i]!
      } else {
        // Y: bit=1 <- +i*psi[j]; bit=0 <- -i*psi[j]
        const s = one ? 1 : -1
        r2[i] = -s * m[j]!
        m2[i] = s * r[j]!
      }
    }
    r = r2
    m = m2
  }
  return { r, m }
}

/** Expectation ⟨ψ|H|ψ⟩ for a list of Pauli terms. */
export function energyOfState(re: number[], im: number[], T: Term[], n: number): number {
  let E = 0
  for (const t of T) {
    const o = apply(re, im, t, n)
    let d = 0
    for (let i = 0; i < re.length; i++) d += re[i]! * o.r[i]! + im[i]! * o.m[i]!
    E += t.c * d
  }
  return E
}

/** Ansatz energy for parameter vector `th`. */
export function energy(th: number[], n: number, T: Term[]): number {
  const s = stateVec(th, n)
  return energyOfState(s.re, s.im, T, n)
}

/**
 * Exact ground-state energy via cyclic Jacobi diagonalization of the real
 * symmetric Hamiltonian matrix. Cached by ham+n.
 */
export function exactGroundEnergy(ham: HamKey, n: number): number {
  const key = ham + n
  if (e0Cache[key] !== undefined) return e0Cache[key]!
  const T = terms(ham, n)
  const N = 1 << n
  const H: number[][] = []
  for (let i = 0; i < N; i++) H.push(new Array(N).fill(0))
  for (let j = 0; j < N; j++) {
    const re = new Array(N).fill(0)
    const im = new Array(N).fill(0)
    re[j] = 1
    for (const t of T) {
      const o = apply(re, im, t, n)
      for (let i = 0; i < N; i++) H[i]![j]! += t.c * o.r[i]!
    }
  }
  // Cyclic Jacobi for real symmetric matrix
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0
    for (let p = 0; p < N; p++) {
      for (let q = p + 1; q < N; q++) off += H[p]![q]! * H[p]![q]!
    }
    if (off < 1e-22) break
    for (let p = 0; p < N - 1; p++) {
      for (let q = p + 1; q < N; q++) {
        if (Math.abs(H[p]![q]!) < 1e-15) continue
        const th = (H[q]![q]! - H[p]![p]!) / (2 * H[p]![q]!)
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1))
        const c = 1 / Math.sqrt(t * t + 1)
        const s = t * c
        for (let k = 0; k < N; k++) {
          const a = H[k]![p]!
          const b = H[k]![q]!
          H[k]![p] = c * a - s * b
          H[k]![q] = s * a + c * b
        }
        for (let k = 0; k < N; k++) {
          const a = H[p]![k]!
          const b = H[q]![k]!
          H[p]![k] = c * a - s * b
          H[q]![k] = s * a + c * b
        }
      }
    }
  }
  let mn = Infinity
  for (let i = 0; i < N; i++) mn = Math.min(mn, H[i]![i]!)
  e0Cache[key] = mn
  return mn
}
