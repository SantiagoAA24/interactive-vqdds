import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { AxeResults } from 'axe-core'
import App from '../App'

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  document.documentElement.lang = 'es'
})

function seriousOrCritical(results: AxeResults): AxeResults {
  return {
    ...results,
    violations: results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    ),
  }
}

async function expectPageAxeClean(path: string) {
  const { container } = render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  const results = await axe(container)
  expect(seriousOrCritical(results)).toHaveNoViolations()
}

describe('page accessibility (axe critical/serious)', () => {
  it('Home `/`', async () => {
    await expectPageAxeClean('/')
  })

  it('Module1 `/modulo-1`', async () => {
    await expectPageAxeClean('/modulo-1')
  })

  it('Module2 `/modulo-2`', async () => {
    await expectPageAxeClean('/modulo-2')
  })

  it('Module3 `/modulo-3`', async () => {
    await expectPageAxeClean('/modulo-3')
  })

  it('Paper `/paper`', async () => {
    await expectPageAxeClean('/paper')
  })
})
