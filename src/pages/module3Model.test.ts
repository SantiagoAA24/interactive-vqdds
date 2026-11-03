import { describe, expect, it } from 'vitest'
import { module3Page } from '../content/module3'
import {
  buildLogErrorChart,
  CHART_Y_MAX,
  CHART_Y_MIN,
  logErrorToY,
  trainerStatusMessage,
} from './module3Model'

describe('logErrorToY', () => {
  it('maps errors from 1 to 1e-6 inside the plot area and preserves order', () => {
    const errors = [1, 1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6]
    const ys = errors.map(logErrorToY)

    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(CHART_Y_MIN)
      expect(y).toBeLessThanOrEqual(CHART_Y_MAX)
    }

    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]!).toBeGreaterThan(ys[i - 1]!)
    }
  })

  it('uses the same scale for ticks and curve points', () => {
    const chart = buildLogErrorChart([1, 1e-2, 1e-4, 1e-6])
    const tickAt1 = chart.yTicks.find((t) => t.label === '1e0')
    expect(tickAt1).toBeTruthy()
    expect(tickAt1!.y).toBeCloseTo(logErrorToY(1), 5)

    const firstPointY = Number(chart.points.split(' ')[0]!.split(',')[1])
    expect(firstPointY).toBeCloseTo(logErrorToY(1), 1)
  })
})

describe('trainerStatusMessage', () => {
  it('shows idle when not trained', () => {
    expect(
      trainerStatusMessage({ t: 0, err: 1, gnorm: null, running: false }),
    ).toBe(module3Page.statusIdle)
  })

  it('shows converged when error is below 0.001', () => {
    expect(
      trainerStatusMessage({ t: 20, err: 5e-4, gnorm: 0.01, running: true }),
    ).toBe(module3Page.statusConverged)
  })

  it('shows flat gradient with high error', () => {
    const msg = trainerStatusMessage({
      t: 51,
      err: 0.42,
      gnorm: 5e-4,
      running: false,
    })
    expect(msg).toContain(module3Page.statusFlatPrefix)
    expect(msg).toContain('0,420')
    expect(msg).toContain(module3Page.statusFlatSuffix)
  })

  it('shows running when training', () => {
    expect(
      trainerStatusMessage({ t: 10, err: 0.5, gnorm: 0.1, running: true }),
    ).toBe(module3Page.statusRunning)
  })

  it('shows paused otherwise', () => {
    expect(
      trainerStatusMessage({ t: 10, err: 0.5, gnorm: 0.1, running: false }),
    ).toBe(module3Page.statusPaused)
  })
})
