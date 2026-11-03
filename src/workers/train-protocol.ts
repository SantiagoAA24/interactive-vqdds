import type { TrainConfig } from '../lib/dd/adam'

/** Serializable training fields (θ + Adam moments + history). */
export type TrainSnapshot = {
  th: number[]
  m: number[]
  v: number[]
  t: number
  hist: number[]
  gnorm: number | null
}

/** Main thread → worker. */
export type TrainToWorker =
  | { type: 'start'; gen: number; config: TrainConfig; snapshot: TrainSnapshot }
  | { type: 'pause'; gen: number }
  | {
      type: 'step'
      gen: number
      config: TrainConfig
      snapshot: TrainSnapshot
      epochs: number
    }

/** Worker → main thread. */
export type TrainFromWorker =
  | { type: 'block'; gen: number; snapshot: TrainSnapshot }
  | { type: 'idle'; gen: number }

/** Minimal Worker surface for production and injectable fakes. */
export type WorkerLike = {
  postMessage(data: TrainToWorker): void
  terminate(): void
  addEventListener(
    type: 'message',
    listener: (ev: MessageEvent<TrainFromWorker>) => void,
  ): void
  removeEventListener(
    type: 'message',
    listener: (ev: MessageEvent<TrainFromWorker>) => void,
  ): void
}

export type CreateWorker = () => WorkerLike

export const BLOCK_EPOCHS = 8
