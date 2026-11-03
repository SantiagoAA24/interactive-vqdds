import { useCallback, useEffect, useRef, useState } from 'react'
import {
  initTrainState,
  type TrainConfig,
  type TrainState,
} from '../lib/dd/adam'
import { createTrainWorker } from '../workers/createTrainWorker'
import { stateToSnapshot } from '../workers/train-loop'
import type {
  CreateWorker,
  TrainFromWorker,
  WorkerLike,
} from '../workers/train-protocol'

export type { CreateWorker, WorkerLike }

export type TrainerState = TrainState & { running: boolean }

const DEFAULT_CONFIG: TrainConfig = {
  ham: 'tfim1',
  n: 4,
  lr: 0.05,
  seed: 1,
}

function toTrainerState(st: TrainState, running: boolean): TrainerState {
  return { ...st, running }
}

export type UseTrainerOptions = {
  createWorker?: CreateWorker
  initialConfig?: TrainConfig
}

export type UseTrainerResult = {
  state: TrainerState
  start: () => void
  pause: () => void
  step: (epochs: number) => void
  setConfig: (patch: Partial<TrainConfig>) => void
}

export function useTrainer(options?: UseTrainerOptions): UseTrainerResult {
  const createWorker = options?.createWorker ?? createTrainWorker
  const createWorkerRef = useRef(createWorker)
  useEffect(() => {
    createWorkerRef.current = createWorker
  }, [createWorker])

  const [state, setState] = useState<TrainerState>(() =>
    toTrainerState(
      initTrainState(options?.initialConfig ?? DEFAULT_CONFIG),
      false,
    ),
  )

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const genRef = useRef(0)
  const workerRef = useRef<WorkerLike | null>(null)
  const listenerRef = useRef<
    ((ev: MessageEvent<TrainFromWorker>) => void) | null
  >(null)

  const killWorker = useCallback(() => {
    const w = workerRef.current
    const listener = listenerRef.current
    workerRef.current = null
    listenerRef.current = null
    if (w && listener) w.removeEventListener('message', listener)
    if (w) w.terminate()
  }, [])

  const bumpGen = useCallback(() => {
    genRef.current += 1
  }, [])

  const ensureWorker = useCallback((): WorkerLike => {
    if (workerRef.current) return workerRef.current
    const w = createWorkerRef.current()
    const onMessage = (ev: MessageEvent<TrainFromWorker>) => {
      const msg = ev.data
      if (msg.gen !== genRef.current) return
      if (msg.type === 'block') {
        setState((prev) =>
          toTrainerState(
            {
              ham: prev.ham,
              n: prev.n,
              lr: prev.lr,
              seed: prev.seed,
              ...msg.snapshot,
            },
            prev.running,
          ),
        )
      }
    }
    listenerRef.current = onMessage
    w.addEventListener('message', onMessage)
    workerRef.current = w
    return w
  }, [])

  useEffect(() => {
    return () => {
      bumpGen()
      killWorker()
    }
  }, [bumpGen, killWorker])

  const pause = useCallback(() => {
    const w = workerRef.current
    if (w) {
      w.postMessage({ type: 'pause', gen: genRef.current })
    }
    setState((prev) => ({ ...prev, running: false }))
  }, [])

  const start = useCallback(() => {
    const cur = stateRef.current
    setState((prev) => ({ ...prev, running: true }))
    const w = ensureWorker()
    w.postMessage({
      type: 'start',
      gen: genRef.current,
      config: {
        ham: cur.ham,
        n: cur.n,
        lr: cur.lr,
        seed: cur.seed,
      },
      snapshot: stateToSnapshot(cur),
    })
  }, [ensureWorker])

  const step = useCallback(
    (epochs: number) => {
      const cur = stateRef.current
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'pause', gen: genRef.current })
      }
      setState((prev) => ({ ...prev, running: false }))
      const w = ensureWorker()
      w.postMessage({
        type: 'step',
        gen: genRef.current,
        config: {
          ham: cur.ham,
          n: cur.n,
          lr: cur.lr,
          seed: cur.seed,
        },
        snapshot: stateToSnapshot(cur),
        epochs,
      })
    },
    [ensureWorker],
  )

  const setConfig = useCallback(
    (patch: Partial<TrainConfig>) => {
      const resetsIdentity =
        patch.ham !== undefined ||
        patch.n !== undefined ||
        patch.seed !== undefined

      if (resetsIdentity) {
        bumpGen()
        killWorker()
        const cur = stateRef.current
        const nextConfig: TrainConfig = {
          ham: patch.ham ?? cur.ham,
          n: patch.n ?? cur.n,
          lr: patch.lr ?? cur.lr,
          seed: patch.seed ?? cur.seed,
        }
        setState(toTrainerState(initTrainState(nextConfig), false))
        return
      }

      if (patch.lr !== undefined) {
        setState((prev) => ({ ...prev, lr: patch.lr! }))
      }
    },
    [bumpGen, killWorker],
  )

  return { state, start, pause, step, setConfig }
}
