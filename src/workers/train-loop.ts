import { advance, type TrainConfig, type TrainState } from '../lib/dd/adam'
import { BLOCK_EPOCHS, type TrainSnapshot } from './train-protocol'

export function snapshotToState(
  config: TrainConfig,
  snapshot: TrainSnapshot,
): TrainState {
  return { ...config, ...snapshot }
}

export function stateToSnapshot(st: TrainState): TrainSnapshot {
  return {
    th: st.th,
    m: st.m,
    v: st.v,
    t: st.t,
    hist: st.hist,
    gnorm: st.gnorm,
  }
}

/** One discrete step of `epochs` Adam updates (e.g. +50). */
export function runStep(
  config: TrainConfig,
  snapshot: TrainSnapshot,
  epochs: number,
): TrainSnapshot {
  return stateToSnapshot(advance(snapshotToState(config, snapshot), epochs))
}

export type ContinuousOpts = {
  config: TrainConfig
  snapshot: TrainSnapshot
  shouldContinue: () => boolean
  onBlock: (snapshot: TrainSnapshot) => void
  /** Yield between blocks (default: setTimeout 0). */
  schedule?: () => Promise<void>
}

function defaultSchedule(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

/**
 * Continuous training: advance BLOCK_EPOCHS, emit, yield, repeat
 * until shouldContinue() is false.
 */
export async function runContinuous(opts: ContinuousOpts): Promise<void> {
  const schedule = opts.schedule ?? defaultSchedule
  let snapshot = opts.snapshot
  while (opts.shouldContinue()) {
    snapshot = runStep(opts.config, snapshot, BLOCK_EPOCHS)
    opts.onBlock(snapshot)
    if (!opts.shouldContinue()) break
    await schedule()
  }
}
