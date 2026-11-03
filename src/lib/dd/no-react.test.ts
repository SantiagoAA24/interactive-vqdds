import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const LIB_ROOT = join(process.cwd(), 'src/lib')
const REACT_IMPORT = /from\s+['"]react(?:\/[^'"]*)?['"]/

function listFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const name of entries) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      files.push(...listFiles(full))
    } else if (/\.(ts|tsx|js|jsx)$/.test(name) && !name.endsWith('.test.ts') && !name.endsWith('.test.tsx')) {
      files.push(full)
    }
  }
  return files
}

describe('src/lib has no React imports', () => {
  it('does not import react from any production file under src/lib', () => {
    const offenders: string[] = []
    for (const file of listFiles(LIB_ROOT)) {
      const source = readFileSync(file, 'utf8')
      if (REACT_IMPORT.test(source)) {
        offenders.push(relative(process.cwd(), file))
      }
    }
    expect(offenders).toEqual([])
  })
})
