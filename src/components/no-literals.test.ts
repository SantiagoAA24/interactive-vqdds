import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const COMPONENTS_DIR = resolve(process.cwd(), 'src/components')

const COLOR_LITERAL =
  /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\brgba?\(|\bhsla?\(/
const SIZE_LITERAL = /\b\d+(?:\.\d+)?(?:px|rem|em)\b/

function componentSourceFiles(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .filter((name) => name.endsWith('.tsx') && !name.includes('.test.'))
    .map((name) => resolve(COMPONENTS_DIR, name))
}

describe('no design literals in components', () => {
  it('has no color or size literals in src/components sources', () => {
    const offenders: string[] = []

    for (const file of componentSourceFiles()) {
      const source = readFileSync(file, 'utf8')
      const lines = source.split('\n')

      lines.forEach((line, index) => {
        if (COLOR_LITERAL.test(line)) {
          offenders.push(`${file}:${index + 1}: color literal → ${line.trim()}`)
        }

        // Allow percentage widths for probability bars (data, matching preview).
        const withoutPercents = line.replace(/['"`]\d+(?:\.\d+)?%['"`]/g, "''")
        if (SIZE_LITERAL.test(withoutPercents)) {
          offenders.push(`${file}:${index + 1}: size literal → ${line.trim()}`)
        }
      })
    }

    expect(offenders).toEqual([])
  })
})
