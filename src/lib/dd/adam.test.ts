import { describe, expect, it } from 'vitest'
import { advance, initTrainState, type TrainConfig } from './adam'

const TRAIN_TIMEOUT = 60_000

function train(config: TrainConfig, epochs: number) {
  const t0 = performance.now()
  const final = advance(initTrainState(config), epochs)
  const ms = performance.now() - t0
  return { final, ms }
}

describe('adam (module 3)', () => {
  it(
    'Z₁Z₂ n=4 seed=1 reaches error < 1e-8 in 600 epochs',
    () => {
      const { final, ms } = train({ ham: 'zz', n: 4, lr: 0.05, seed: 1 }, 600)
      console.info(`adam train zz n=4: ${ms.toFixed(1)} ms, err=${final.hist.at(-1)}`)
      expect(final.hist.at(-1)!).toBeLessThan(1e-8)
    },
    TRAIN_TIMEOUT,
  )

  it(
    'Ising g=0 n=4 seed=1 reaches error < 1e-8 in 600 epochs',
    () => {
      const { final, ms } = train({ ham: 'tfim0', n: 4, lr: 0.05, seed: 1 }, 600)
      console.info(`adam train tfim0 n=4: ${ms.toFixed(1)} ms, err=${final.hist.at(-1)}`)
      expect(final.hist.at(-1)!).toBeLessThan(1e-8)
    },
    TRAIN_TIMEOUT,
  )

  it(
    'Heisenberg n=4 seed=1 stays above 0.4 after 600 epochs (ansatz limit)',
    () => {
      const { final, ms } = train({ ham: 'heis', n: 4, lr: 0.05, seed: 1 }, 600)
      console.info(`adam train heis n=4: ${ms.toFixed(1)} ms, err=${final.hist.at(-1)}`)
      expect(final.hist.at(-1)!).toBeGreaterThan(0.4)
    },
    TRAIN_TIMEOUT,
  )

  it('same seed yields identical training history', () => {
    const cfg: TrainConfig = { ham: 'zz', n: 4, lr: 0.05, seed: 1 }
    const a = advance(initTrainState(cfg), 50)
    const b = advance(initTrainState(cfg), 50)
    expect(b.hist).toEqual(a.hist)
    expect(b.th).toEqual(a.th)
  })
})
