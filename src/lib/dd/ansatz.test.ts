import { describe, expect, it } from 'vitest'
import { createRng } from './adam'
import { nParams, stateVec } from './ansatz'

const NORM_TOL = 1e-9

function l2Norm(re: number[], im: number[]): number {
  let s = 0
  for (let i = 0; i < re.length; i++) {
    s += re[i]! * re[i]! + im[i]! * im[i]!
  }
  return Math.sqrt(s)
}

function randomThetas(n: number, seed: number): number[] {
  const rnd = createRng(seed)
  const P = nParams(n)
  const th: number[] = []
  for (let i = 0; i < P; i++) th.push(rnd() * 2 * Math.PI)
  return th
}

describe('ansatz (module 3)', () => {
  it('nParams is 9 per two-qubit block', () => {
    expect(nParams(4)).toBe(18)
    expect(nParams(6)).toBe(27)
  })

  it.each([1, 42, 99, 12345])('stateVec is normalized for seed %s (n=4)', (seed) => {
    const th = randomThetas(4, seed)
    const { re, im } = stateVec(th, 4)
    expect(re).toHaveLength(16)
    expect(Math.abs(l2Norm(re, im) - 1)).toBeLessThan(NORM_TOL)
  })

  it.each([7, 88])('stateVec is normalized for seed %s (n=6)', (seed) => {
    const th = randomThetas(6, seed)
    const { re, im } = stateVec(th, 6)
    expect(re).toHaveLength(64)
    expect(Math.abs(l2Norm(re, im) - 1)).toBeLessThan(NORM_TOL)
  })
})
