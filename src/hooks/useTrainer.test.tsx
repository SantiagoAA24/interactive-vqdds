import { act, render, waitFor } from '@testing-library/react'
import { useEffect, useRef } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  useTrainer,
  type CreateWorker,
  type UseTrainerResult,
  type WorkerLike,
} from './useTrainer'
import type {
  TrainFromWorker,
  TrainSnapshot,
  TrainToWorker,
} from '../workers/train-protocol'
import { BLOCK_EPOCHS } from '../workers/train-protocol'

type MessageListener = (ev: MessageEvent<TrainFromWorker>) => void

function emptySnapshot(P: number): TrainSnapshot {
  return {
    th: new Array(P).fill(0),
    m: new Array(P).fill(0),
    v: new Array(P).fill(0),
    t: 0,
    hist: [],
    gnorm: null,
  }
}

/** Fake worker: emits synthetic blocks; respects pause/terminate. */
class FakeWorker implements WorkerLike {
  terminated = false
  paused = false
  private listeners = new Set<MessageListener>()
  private blockTimer: ReturnType<typeof setTimeout> | null = null
  private snapshot: TrainSnapshot = emptySnapshot(18)
  lastStartGen: number | null = null
  messages: TrainToWorker[] = []

  addEventListener(
    type: 'message',
    listener: (ev: MessageEvent<TrainFromWorker>) => void,
  ): void {
    if (type === 'message') this.listeners.add(listener)
  }

  removeEventListener(
    type: 'message',
    listener: (ev: MessageEvent<TrainFromWorker>) => void,
  ): void {
    if (type === 'message') this.listeners.delete(listener)
  }

  terminate(): void {
    this.terminated = true
    this.paused = true
    this.clearTimer()
  }

  postMessage(data: TrainToWorker): void {
    this.messages.push(data)
    if (this.terminated) return

    if (data.type === 'pause') {
      this.paused = true
      this.clearTimer()
      return
    }

    if (data.type === 'step') {
      this.paused = true
      this.clearTimer()
      this.snapshot = {
        ...data.snapshot,
        t: data.snapshot.t + data.epochs,
        hist: [
          ...data.snapshot.hist,
          ...Array.from({ length: data.epochs }, (_, i) => 1 / (i + 1)),
        ],
        gnorm: 0.1,
      }
      this.emit({ type: 'block', gen: data.gen, snapshot: this.snapshot })
      this.emit({ type: 'idle', gen: data.gen })
      return
    }

    if (data.type === 'start') {
      this.paused = false
      this.lastStartGen = data.gen
      this.snapshot = { ...data.snapshot, hist: data.snapshot.hist.slice() }
      this.scheduleBlock(data.gen)
    }
  }

  /** Push a late block as if from an old generation (after terminate). */
  emitStaleBlock(gen: number, snapshot: TrainSnapshot): void {
    this.emit({ type: 'block', gen, snapshot })
  }

  private scheduleBlock(gen: number): void {
    this.clearTimer()
    this.blockTimer = setTimeout(() => {
      if (this.terminated || this.paused) return
      this.snapshot = {
        ...this.snapshot,
        t: this.snapshot.t + BLOCK_EPOCHS,
        hist: [...this.snapshot.hist, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01],
        gnorm: 0.2,
        th: this.snapshot.th.map((x) => x + 0.01),
      }
      this.emit({ type: 'block', gen, snapshot: this.snapshot })
      if (!this.terminated && !this.paused) this.scheduleBlock(gen)
    }, 5)
  }

  private clearTimer(): void {
    if (this.blockTimer !== null) {
      clearTimeout(this.blockTimer)
      this.blockTimer = null
    }
  }

  private emit(msg: TrainFromWorker): void {
    const ev = { data: msg } as MessageEvent<TrainFromWorker>
    for (const listener of this.listeners) listener(ev)
  }
}

function TrainerProbe({
  createWorker,
  onReady,
}: {
  createWorker: CreateWorker
  onReady: (api: UseTrainerResult) => void
}) {
  const api = useTrainer({
    createWorker,
    initialConfig: { ham: 'zz', n: 4, lr: 0.05, seed: 1 },
  })
  const onReadyRef = useRef(onReady)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])
  useEffect(() => {
    onReadyRef.current(api)
  })
  return (
    <div data-testid="probe">
      t={api.state.t} hist={api.state.hist.length} running=
      {String(api.state.running)}
    </div>
  )
}

describe('useTrainer', () => {
  it('start accumulates history from worker blocks', async () => {
    const fake = new FakeWorker()
    let api!: UseTrainerResult
    render(
      <TrainerProbe
        createWorker={() => fake}
        onReady={(a) => {
          api = a
        }}
      />,
    )

    expect(api.state.hist).toHaveLength(0)
    act(() => {
      api.start()
    })
    expect(api.state.running).toBe(true)

    await waitFor(() => {
      expect(api.state.hist.length).toBeGreaterThanOrEqual(8)
      expect(api.state.t).toBeGreaterThanOrEqual(8)
    })

    act(() => {
      api.pause()
    })
  })

  it('pause stops applying further blocks', async () => {
    const fake = new FakeWorker()
    let api!: UseTrainerResult
    render(
      <TrainerProbe
        createWorker={() => fake}
        onReady={(a) => {
          api = a
        }}
      />,
    )

    act(() => {
      api.start()
    })

    await waitFor(() => {
      expect(api.state.t).toBeGreaterThanOrEqual(8)
    })

    act(() => {
      api.pause()
    })
    const tAfterPause = api.state.t
    const histLen = api.state.hist.length

    await new Promise((r) => setTimeout(r, 40))

    expect(api.state.running).toBe(false)
    expect(api.state.t).toBe(tAfterPause)
    expect(api.state.hist).toHaveLength(histLen)
  })

  it('changing ham/n/seed terminates worker and discards stale blocks', async () => {
    const fake = new FakeWorker()
    const terminateSpy = vi.spyOn(fake, 'terminate')
    let api!: UseTrainerResult
    render(
      <TrainerProbe
        createWorker={() => fake}
        onReady={(a) => {
          api = a
        }}
      />,
    )

    act(() => {
      api.start()
    })
    await waitFor(() => {
      expect(api.state.t).toBeGreaterThanOrEqual(8)
    })

    const liveGen = fake.lastStartGen!
    const thBeforeStale = api.state.th.slice()
    const tBeforeStale = api.state.t

    // Wrong generation while listener is still attached → ignored.
    act(() => {
      fake.emitStaleBlock(liveGen - 1, {
        th: thBeforeStale.map(() => 99),
        m: thBeforeStale.map(() => 1),
        v: thBeforeStale.map(() => 1),
        t: 999,
        hist: [1, 2, 3],
        gnorm: 7,
      })
    })
    expect(api.state.t).toBe(tBeforeStale)
    expect(api.state.th).toEqual(thBeforeStale)

    act(() => {
      api.setConfig({ ham: 'heis' })
    })

    expect(terminateSpy).toHaveBeenCalled()
    expect(fake.terminated).toBe(true)
    expect(api.state.running).toBe(false)
    expect(api.state.ham).toBe('heis')
    expect(api.state.t).toBe(0)
    expect(api.state.hist).toHaveLength(0)

    const freshTh = api.state.th.slice()
    // Late message with the pre-reconfig generation must not apply.
    act(() => {
      fake.emitStaleBlock(liveGen, {
        th: freshTh.map(() => 99),
        m: freshTh.map(() => 1),
        v: freshTh.map(() => 1),
        t: 999,
        hist: [1, 2, 3],
        gnorm: 7,
      })
    })

    expect(api.state.t).toBe(0)
    expect(api.state.hist).toHaveLength(0)
    expect(api.state.th).toEqual(freshTh)
  })

  it('changing n or seed also cancels and resets', async () => {
    const fake = new FakeWorker()
    let api!: UseTrainerResult
    render(
      <TrainerProbe
        createWorker={() => fake}
        onReady={(a) => {
          api = a
        }}
      />,
    )

    act(() => {
      api.start()
    })
    await waitFor(() => expect(api.state.t).toBeGreaterThanOrEqual(8))

    act(() => {
      api.setConfig({ n: 6 })
    })
    expect(fake.terminated).toBe(true)
    expect(api.state.n).toBe(6)
    expect(api.state.t).toBe(0)

    const fake2 = new FakeWorker()
    let api2!: UseTrainerResult
    render(
      <TrainerProbe
        createWorker={() => fake2}
        onReady={(a) => {
          api2 = a
        }}
      />,
    )
    act(() => {
      api2.start()
    })
    await waitFor(() => expect(api2.state.t).toBeGreaterThanOrEqual(8))
    act(() => {
      api2.setConfig({ seed: 99 })
    })
    expect(fake2.terminated).toBe(true)
    expect(api2.state.seed).toBe(99)
    expect(api2.state.t).toBe(0)
  })

  it('unmount terminates the worker', async () => {
    const fake = new FakeWorker()
    const terminateSpy = vi.spyOn(fake, 'terminate')
    let api!: UseTrainerResult
    const { unmount } = render(
      <TrainerProbe
        createWorker={() => fake}
        onReady={(a) => {
          api = a
        }}
      />,
    )

    act(() => {
      api.start()
    })
    await waitFor(() => expect(api.state.t).toBeGreaterThanOrEqual(8))

    unmount()
    expect(terminateSpy).toHaveBeenCalled()
    expect(fake.terminated).toBe(true)
  })
})
