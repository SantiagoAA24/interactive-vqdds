import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { useMemo, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  module3Page,
  module3PredictFeedback,
  module3PredictOptions,
} from '../content/module3'
import { initTrainState } from '../lib/dd/adam'
import type { TrainerState, UseTrainerResult } from '../hooks/useTrainer'
import Module3 from './Module3'

afterEach(() => {
  cleanup()
})

const BASE_CONFIG = { ham: 'tfim1' as const, n: 4, lr: 0.05, seed: 1 }

function toTrainerState(
  patch: Partial<TrainerState> & { running?: boolean },
): TrainerState {
  const base = initTrainState(BASE_CONFIG)
  return {
    ...base,
    ...patch,
    running: patch.running ?? false,
  }
}

type FakeProps = {
  initial?: Partial<TrainerState> & { running?: boolean }
  onStart?: () => void
  onPause?: () => void
  onStep?: (epochs: number) => void
  onSetConfig?: (patch: Parameters<UseTrainerResult['setConfig']>[0]) => void
}

function FakeModule3({
  initial,
  onStart,
  onPause,
  onStep,
  onSetConfig,
}: FakeProps) {
  const [state, setState] = useState(() => toTrainerState(initial ?? {}))

  const trainer = useMemo<UseTrainerResult>(
    () => ({
      state,
      start: () => {
        onStart?.()
        setState((s) => ({ ...s, running: true }))
      },
      pause: () => {
        onPause?.()
        setState((s) => ({ ...s, running: false }))
      },
      step: (epochs) => {
        onStep?.(epochs)
        setState((s) => ({
          ...s,
          running: false,
          t: s.t + epochs,
          hist: [
            ...s.hist,
            ...Array.from({ length: epochs }, () => 0.5),
          ],
          gnorm: 0.1,
        }))
      },
      setConfig: (patch) => {
        onSetConfig?.(patch)
        setState((s) => {
          const resets =
            patch.ham !== undefined ||
            patch.n !== undefined ||
            patch.seed !== undefined
          if (resets) {
            return toTrainerState({
              ...initTrainState({
                ham: patch.ham ?? s.ham,
                n: patch.n ?? s.n,
                lr: patch.lr ?? s.lr,
                seed: patch.seed ?? s.seed,
              }),
              running: false,
            })
          }
          if (patch.lr !== undefined) {
            return { ...s, lr: patch.lr }
          }
          return s
        })
      },
    }),
    [state, onStart, onPause, onStep, onSetConfig],
  )

  return (
    <MemoryRouter>
      <Module3 trainer={trainer} />
    </MemoryRouter>
  )
}

function statusEl() {
  return screen.getByTestId('m3-status')
}

describe('Module3 page', () => {
  it('shows idle status when not trained', () => {
    render(<FakeModule3 />)
    expect(statusEl().textContent).toBe(module3Page.statusIdle)
  })

  it('shows running status while training', () => {
    render(
      <FakeModule3
        initial={{ t: 10, hist: [0.5], gnorm: 0.1, running: true }}
      />,
    )
    expect(statusEl().textContent).toBe(module3Page.statusRunning)
  })

  it('shows paused status when paused with progress', () => {
    render(
      <FakeModule3
        initial={{ t: 10, hist: [0.5], gnorm: 0.1, running: false }}
      />,
    )
    expect(statusEl().textContent).toBe(module3Page.statusPaused)
  })

  it('shows converged status when error is below 0.001', () => {
    render(
      <FakeModule3
        initial={{ t: 40, hist: [5e-4], gnorm: 0.01, running: true }}
      />,
    )
    expect(statusEl().textContent).toBe(module3Page.statusConverged)
  })

  it('shows flat-gradient status when gradient is near zero with high error', () => {
    render(
      <FakeModule3
        initial={{ t: 51, hist: [0.42], gnorm: 5e-4, running: false }}
      />,
    )
    const text = statusEl().textContent ?? ''
    expect(text).toContain(module3Page.statusFlatPrefix)
    expect(text).toContain('0,420')
    expect(text).toContain(module3Page.statusFlatSuffix)
  })

  it('resets curve and metrics when Hamiltonian changes', () => {
    const onSetConfig = vi.fn()
    render(
      <FakeModule3
        initial={{ t: 80, hist: [0.3, 0.2, 0.1], gnorm: 0.05, running: false }}
        onSetConfig={onSetConfig}
      />,
    )

    expect(screen.getByText(module3Page.statEpoch).parentElement?.textContent).toContain(
      '80',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Z₁Z₂' }))
    expect(onSetConfig).toHaveBeenCalledWith({ ham: 'zz' })
    expect(statusEl().textContent).toBe(module3Page.statusIdle)
    expect(screen.getByText(module3Page.statEpoch).parentElement?.textContent).toContain(
      '0',
    )
  })

  it('toggles the train button between Entrenar and Pausar', () => {
    const onStart = vi.fn()
    const onPause = vi.fn()
    render(<FakeModule3 onStart={onStart} onPause={onPause} />)

    const trainBtn = screen.getByRole('button', { name: module3Page.trainLabel })
    fireEvent.click(trainBtn)
    expect(onStart).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('button', { name: module3Page.pauseLabel }),
    ).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: module3Page.pauseLabel }))
    expect(onPause).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('button', { name: module3Page.trainLabel }),
    ).toBeTruthy()
  })

  it('advances 50 epochs with +50 épocas', () => {
    const onStep = vi.fn()
    render(
      <FakeModule3
        initial={{ t: 10, hist: [0.5], gnorm: 0.1 }}
        onStep={onStep}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: module3Page.step50Label }))
    expect(onStep).toHaveBeenCalledWith(50)
    expect(screen.getByText(module3Page.statEpoch).parentElement?.textContent).toContain(
      '60',
    )
  })

  it('shows the correct Predict verdict with aria-live polite', () => {
    render(<FakeModule3 />)

    const correct = module3PredictOptions.find(
      (o) => o.id === module3Page.predictCorrectId,
    )!
    fireEvent.click(screen.getByRole('button', { name: correct.label }))

    const verdict = module3PredictFeedback.c.verdict
    const live = screen.getByText(verdict).closest('[aria-live]')
    expect(live).toBeTruthy()
    expect(live?.getAttribute('aria-live')).toBe('polite')
    expect(live?.textContent).toContain(module3PredictFeedback.c.detail)
  })

  it('announces training status with aria-live polite', () => {
    render(<FakeModule3 />)
    expect(statusEl().getAttribute('aria-live')).toBe('polite')
  })

  it('gives every interactive control an accessible name', () => {
    render(<FakeModule3 />)

    expect(
      screen.getByRole('slider', { name: new RegExp(module3Page.lrLabel) }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: module3Page.trainLabel })).toBeTruthy()
    expect(screen.getByRole('button', { name: module3Page.step50Label })).toBeTruthy()
    expect(screen.getByRole('button', { name: module3Page.newSeedLabel })).toBeTruthy()

    for (const opt of module3PredictOptions) {
      expect(screen.getByRole('button', { name: opt.label })).toBeTruthy()
    }

    expect(screen.getByRole('button', { name: 'Z₁Z₂' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '4' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '6' })).toBeTruthy()

    const hamGroup = screen.getByRole('group', { name: module3Page.hamLabel })
    expect(within(hamGroup).getAllByRole('button').length).toBeGreaterThanOrEqual(5)

    const nGroup = screen.getByRole('group', { name: module3Page.nLabel })
    expect(within(nGroup).getAllByRole('button').length).toBe(2)
  })
})
