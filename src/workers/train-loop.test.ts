import { describe, expect, it } from 'vitest'
import { initTrainState } from '../lib/dd/adam'
import { runStep, stateToSnapshot } from './train-loop'
import { BLOCK_EPOCHS } from './train-protocol'

const TRAIN_TIMEOUT = 60_000

describe('train-loop (worker logic in Node)', () => {
  it(
    'Z₁Z₂ n=4 reaches error < 1e-6 in under 5 seconds via 8-epoch blocks',
    () => {
      const config = { ham: 'zz' as const, n: 4, lr: 0.05, seed: 1 }
      let snapshot = stateToSnapshot(initTrainState(config))
      const t0 = performance.now()
      let blocks = 0

      while (true) {
        snapshot = runStep(config, snapshot, BLOCK_EPOCHS)
        blocks++
        const err = snapshot.hist.at(-1)!
        if (err < 1e-6) break
        // Safety: same ballpark as 8A (600 epochs ≈ 75 blocks).
        if (blocks > 500) break
      }

      const ms = performance.now() - t0
      const err = snapshot.hist.at(-1)!
      console.info(
        `train-loop zz n=4: ${ms.toFixed(1)} ms, blocks=${blocks}, err=${err}`,
      )
      expect(err).toBeLessThan(1e-6)
      expect(ms).toBeLessThan(5000)
    },
    TRAIN_TIMEOUT,
  )
})
