#!/usr/bin/env node
/**
 * WCAG 2.1 relative-luminance contrast ratios for UI token pairs.
 * Thresholds: 4.5:1 normal text; 3:1 large text / UI borders & focus.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = JSON.parse(
  readFileSync(join(root, 'docs/design-system/tokens.json'), 'utf8'),
)

/** @type {Record<string, string>} */
const colors = {}
for (const token of tokens.color.tokens) {
  const raw = token.value.dark
  colors[token.name] = typeof raw === 'string' ? raw : String(raw)
}

function resolveColor(name) {
  let value = colors[name]
  if (!value) throw new Error(`Unknown color token: ${name}`)
  const ref = value.match(/^\{([a-z0-9-]+)\}$/i)
  if (ref) value = resolveColor(ref[1])
  return value
}

function hexToRgb(hex) {
  const h = hex.replace('#', '').toLowerCase()
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = Number.parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function channel(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrastRatio(fgName, bgName) {
  const L1 = luminance(resolveColor(fgName))
  const L2 = luminance(resolveColor(bgName))
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** @type {Array<{fg: string, bg: string, min: number, kind: string}>} */
const pairs = [
  { fg: 'ink', bg: 'bg', min: 4.5, kind: 'text' },
  { fg: 'ink', bg: 'surface', min: 4.5, kind: 'text' },
  { fg: 'ink', bg: 'surface-deep', min: 4.5, kind: 'text' },
  { fg: 'ink', bg: 'surface-selected', min: 4.5, kind: 'text' },
  { fg: 'ink', bg: 'band', min: 4.5, kind: 'text' },
  { fg: 'ink', bg: 'option', min: 4.5, kind: 'text' },
  { fg: 'ink-muted', bg: 'bg', min: 4.5, kind: 'text' },
  { fg: 'ink-muted', bg: 'surface', min: 4.5, kind: 'text' },
  { fg: 'band-ink-muted', bg: 'band', min: 4.5, kind: 'text' },
  { fg: 'accent', bg: 'bg', min: 4.5, kind: 'text' },
  { fg: 'accent', bg: 'surface', min: 4.5, kind: 'text' },
  { fg: 'accent', bg: 'surface-deep', min: 4.5, kind: 'text' },
  { fg: 'on-accent', bg: 'accent', min: 4.5, kind: 'text' },
  { fg: 'violet', bg: 'bg', min: 4.5, kind: 'text' },
  { fg: 'violet', bg: 'surface', min: 4.5, kind: 'text' },
  { fg: 'accent', bg: 'bg', min: 3, kind: 'focus' },
  { fg: 'accent', bg: 'surface', min: 3, kind: 'focus' },
  { fg: 'accent', bg: 'band', min: 3, kind: 'focus' },
  { fg: 'border', bg: 'surface', min: 3, kind: 'ui' },
  { fg: 'border', bg: 'bg', min: 3, kind: 'ui' },
]

let failed = 0
const rows = []
for (const pair of pairs) {
  const ratio = contrastRatio(pair.fg, pair.bg)
  const ok = ratio + 1e-9 >= pair.min
  if (!ok) failed += 1
  rows.push({
    pair: `${pair.fg} / ${pair.bg}`,
    kind: pair.kind,
    ratio: ratio.toFixed(2),
    min: pair.min.toFixed(1),
    ok: ok ? 'PASS' : 'FAIL',
  })
}

console.log('Contraste WCAG — pares de tokens.json\n')
console.table(rows)
if (failed > 0) {
  console.error(`\n${failed} par(es) por debajo del umbral.`)
  process.exit(1)
}
console.log('\nTodos los pares cumplen el umbral.')
