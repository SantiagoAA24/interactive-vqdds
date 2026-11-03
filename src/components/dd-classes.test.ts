import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const COMPONENTS_DIR = resolve(process.cwd(), 'src/components')
const COMPONENTS_CSS = resolve(process.cwd(), 'src/styles/components.css')

function componentSourceFiles(): string[] {
  return readdirSync(COMPONENTS_DIR)
    .filter((name) => name.endsWith('.tsx') && !name.includes('.test.'))
    .map((name) => resolve(COMPONENTS_DIR, name))
}

describe('dd-* class coverage', () => {
  it('every dd-* class used in src/components exists in components.css', () => {
    const css = readFileSync(COMPONENTS_CSS, 'utf8')
    const used = new Set<string>()

    for (const file of componentSourceFiles()) {
      const source = readFileSync(file, 'utf8')
      for (const match of source.matchAll(/\bdd-[a-z0-9-]+\b/g)) {
        used.add(match[0])
      }
    }

    expect(used.size).toBeGreaterThan(0)

    for (const className of [...used].sort()) {
      expect(css, `missing .${className} in components.css`).toMatch(
        new RegExp(`\\.${className.replace(/-/g, '\\-')}(?:\\b|[\\[.:])`),
      )
    }
  })
})
