import type { WorkerLike } from './train-protocol'

/** Vite-bundled training worker (ES module). */
export function createTrainWorker(): WorkerLike {
  return new Worker(new URL('./train.worker.ts', import.meta.url), {
    type: 'module',
  })
}
