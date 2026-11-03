import { module3Page } from '../content/module3'

/** SVG viewBox geometry for the log-error chart (shared by ticks and curve). */
export const CHART = {
  plotLeft: 56,
  plotTop: 16,
  plotWidth: 568,
  plotHeight: 268,
  ymin: -6,
  ymax: 1,
  floor: 1e-12,
  maxPoints: 300,
  yTickPowers: [1, 0, -2, -4, -6] as const,
} as const

export const CHART_Y_MIN = CHART.plotTop
export const CHART_Y_MAX = CHART.plotTop + CHART.plotHeight

function formatDecimal(value: number, digits = 3): string {
  return value.toFixed(digits).replace('.', ',')
}

/** Map an energy error to SVG y using a shared log10 scale. */
export function logErrorToY(error: number): number {
  const { plotTop, plotHeight, ymin, ymax, floor } = CHART
  const clamped = Math.max(ymin, Math.min(ymax, Math.log10(Math.max(error, floor))))
  return plotTop + plotHeight * ((ymax - clamped) / (ymax - ymin))
}

export type LogErrorYTick = {
  y: number
  ty: number
  label: string
}

export type LogErrorChart = {
  points: string
  yTicks: LogErrorYTick[]
  xMax: number
}

/** Build polyline points and y-axis ticks with one shared log scale. */
export function buildLogErrorChart(hist: number[]): LogErrorChart {
  const { plotLeft, plotWidth, maxPoints, yTickPowers } = CHART
  const xMax = Math.max(100, hist.length)
  const step = Math.max(1, Math.ceil(hist.length / maxPoints))
  const pts: string[] = []
  for (let i = 0; i < hist.length; i += step) {
    const x = plotLeft + plotWidth * ((i + 1) / xMax)
    pts.push(`${x.toFixed(1)},${logErrorToY(hist[i]!).toFixed(1)}`)
  }
  if (hist.length > 1 && (hist.length - 1) % step !== 0) {
    const last = hist.length - 1
    const x = plotLeft + plotWidth * (hist.length / xMax)
    pts.push(`${x.toFixed(1)},${logErrorToY(hist[last]!).toFixed(1)}`)
  }

  const yTicks = yTickPowers.map((p) => {
    const y = logErrorToY(Math.pow(10, p))
    return {
      y,
      ty: y + 4,
      label: '1e' + (p < 0 ? '−' + -p : String(p)),
    }
  })

  return { points: pts.join(' '), yTicks, xMax }
}

export type TrainerStatusInput = {
  t: number
  err: number
  gnorm: number | null
  running: boolean
}

/** Status copy matching Modulo-3.dc.html evaluation order. */
export function trainerStatusMessage(input: TrainerStatusInput): string {
  const { t, err, gnorm, running } = input
  if (t === 0) return module3Page.statusIdle
  if (err < 1e-3) return module3Page.statusConverged
  if (gnorm !== null && gnorm < 1e-3 && t > 50) {
    return (
      module3Page.statusFlatPrefix +
      formatDecimal(err) +
      module3Page.statusFlatSuffix
    )
  }
  return running ? module3Page.statusRunning : module3Page.statusPaused
}

export function formatEnergy(value: number, digits = 3): string {
  return formatDecimal(value, digits)
}

export function formatError(err: number): string {
  if (err < 1e-4) return '< 0,0001'
  return formatDecimal(err, 4)
}

export function formatGradNorm(gnorm: number | null): string {
  if (gnorm === null) return '—'
  return formatDecimal(gnorm, 4)
}

export function nodesParamsText(n: number, nParams: number): string {
  const nodes = (n / 2) * 3
  return `${nodes} nodos y ${nParams} parámetros (3 por nodo).`
}
