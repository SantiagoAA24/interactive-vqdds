import { nParams } from './ansatz'
import { energy, exactGroundEnergy, terms, type HamKey } from './hamiltonian'

export type TrainConfig = { ham: HamKey; n: number; lr: number; seed: number }

export type TrainState = TrainConfig & {
  th: number[]
  m: number[]
  v: number[]
  t: number
  hist: number[]
  gnorm: number | null
}

/** Seeded PRNG from the Module 3 prototype (mulberry32 with hashed seed). */
export function createRng(seed: number): () => number {
  let a = (seed * 2654435761) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fresh training state: random θ on [0, 2π), Adam moments zeroed. */
export function initTrainState(config: TrainConfig): TrainState {
  const rnd = createRng(config.seed)
  const P = nParams(config.n)
  const th: number[] = []
  for (let i = 0; i < P; i++) th.push(rnd() * 2 * Math.PI)
  return {
    ...config,
    th,
    m: new Array(P).fill(0),
    v: new Array(P).fill(0),
    t: 0,
    hist: [],
    gnorm: null,
  }
}

/**
 * Run `k` Adam epochs with central finite-difference gradients (ε=1e-4).
 * Appends energy error (E − e0) to hist each epoch.
 */
export function advance(st: TrainState, k: number): TrainState {
  const T = terms(st.ham, st.n)
  const e0 = exactGroundEnergy(st.ham, st.n)
  const th = st.th.slice()
  const m = st.m.slice()
  const v = st.v.slice()
  const hist = st.hist.slice()
  let t = st.t
  let g = st.gnorm
  const b1 = 0.9
  const b2 = 0.999
  const eps = 1e-4
  for (let it = 0; it < k; it++) {
    const grad = th.map((x, i) => {
      th[i] = x + eps
      const ep = energy(th, st.n, T)
      th[i] = x - eps
      const em = energy(th, st.n, T)
      th[i] = x
      return (ep - em) / (2 * eps)
    })
    g = Math.sqrt(grad.reduce((a, x) => a + x * x, 0))
    t++
    for (let i = 0; i < th.length; i++) {
      m[i] = b1 * m[i]! + (1 - b1) * grad[i]!
      v[i] = b2 * v[i]! + (1 - b2) * grad[i]! * grad[i]!
      const mh = m[i]! / (1 - Math.pow(b1, t))
      const vh = v[i]! / (1 - Math.pow(b2, t))
      th[i] -= st.lr * mh / (Math.sqrt(vh) + 1e-8)
    }
    hist.push(energy(th, st.n, T) - e0)
  }
  return {
    ham: st.ham,
    n: st.n,
    lr: st.lr,
    seed: st.seed,
    th,
    m,
    v,
    t,
    hist,
    gnorm: g,
  }
}
