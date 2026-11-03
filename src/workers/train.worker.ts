/// <reference lib="webworker" />
import { runContinuous, runStep } from './train-loop'
import type { TrainFromWorker, TrainToWorker } from './train-protocol'

declare const self: DedicatedWorkerGlobalScope

let running = false
let activeGen = -1

function post(msg: TrainFromWorker): void {
  self.postMessage(msg)
}

self.onmessage = (ev: MessageEvent<TrainToWorker>) => {
  const msg = ev.data

  if (msg.type === 'pause') {
    if (msg.gen === activeGen) running = false
    return
  }

  if (msg.type === 'step') {
    running = false
    activeGen = msg.gen
    const snapshot = runStep(msg.config, msg.snapshot, msg.epochs)
    post({ type: 'block', gen: msg.gen, snapshot })
    post({ type: 'idle', gen: msg.gen })
    return
  }

  if (msg.type === 'start') {
    running = true
    activeGen = msg.gen
    const gen = msg.gen
    const config = msg.config
    void runContinuous({
      config,
      snapshot: msg.snapshot,
      shouldContinue: () => running && activeGen === gen,
      onBlock: (snapshot) => {
        if (running && activeGen === gen) {
          post({ type: 'block', gen, snapshot })
        }
      },
    }).then(() => {
      if (activeGen === gen) post({ type: 'idle', gen })
    })
  }
}
