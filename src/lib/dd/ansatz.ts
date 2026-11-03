export type ComplexState = { re: number[]; im: number[] }

/** Number of variational parameters: 9 per two-qubit Accordion block. */
export function nParams(n: number): number {
  return (n / 2) * 9
}

/**
 * Accordion ansatz state vector. Each node uses (θ, ω, φ) with r = cos θ
 * (branch 0: cos θ · e^{iω}, branch 1: sin θ · e^{iφ}).
 */
export function stateVec(th: number[], n: number): ComplexState {
  let re = [1]
  let im = [0]
  for (let b = 0; b < n / 2; b++) {
    const o = b * 9
    const edge = (k: number, bit: number): [number, number] =>
      bit === 0
        ? [Math.cos(th[o + k * 3]!), th[o + k * 3 + 1]!]
        : [Math.sin(th[o + k * 3]!), th[o + k * 3 + 2]!]
    const br: number[] = []
    const bm: number[] = []
    for (let a = 0; a < 2; a++) {
      for (let c = 0; c < 2; c++) {
        const e1 = edge(0, a)
        const e2 = edge(1 + a, c)
        const mag = e1[0] * e2[0]
        const ph = e1[1] + e2[1]
        br.push(mag * Math.cos(ph))
        bm.push(mag * Math.sin(ph))
      }
    }
    const nr: number[] = []
    const nm: number[] = []
    for (let i = 0; i < re.length; i++) {
      for (let k = 0; k < 4; k++) {
        nr.push(re[i]! * br[k]! - im[i]! * bm[k]!)
        nm.push(re[i]! * bm[k]! + im[i]! * br[k]!)
      }
    }
    re = nr
    im = nm
  }
  return { re, im }
}
