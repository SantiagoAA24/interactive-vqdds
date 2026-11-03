import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { paperComparisonRows, paperPage } from '../content/paper'
import App from '../App'

afterEach(() => {
  cleanup()
})

function renderPaper() {
  return render(
    <MemoryRouter initialEntries={['/paper']}>
      <App />
    </MemoryRouter>,
  )
}

describe('Paper page', () => {
  it('renders the paper-vs-didactic table with every row', () => {
    renderPaper()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: paperPage.comparisonHeading,
      }),
    ).toBeTruthy()

    expect(screen.getByRole('table')).toBeTruthy()
    expect(
      screen.getByRole('columnheader', { name: paperPage.comparisonColumns.topic }),
    ).toBeTruthy()

    for (const row of paperComparisonRows) {
      expect(screen.getByRole('rowheader', { name: row.topic })).toBeTruthy()
      expect(screen.getByText(row.paper)).toBeTruthy()
      expect(screen.getByText(row.demo)).toBeTruthy()
    }
  })


  it('opens external arXiv links in a new tab with rel=noopener', () => {
    renderPaper()

    const arxiv = screen.getByRole('link', { name: paperPage.openArxivLabel })
    expect(arxiv.getAttribute('href')).toBe(paperPage.arxivUrl)
    expect(arxiv.getAttribute('target')).toBe('_blank')
    expect(arxiv.getAttribute('rel')).toBe('noopener')

    const pdf = screen.getByRole('link', { name: paperPage.pdfLabel })
    expect(pdf.getAttribute('href')).toBe(paperPage.pdfUrl)
    expect(pdf.getAttribute('target')).toBe('_blank')
    expect(pdf.getAttribute('rel')).toBe('noopener')
  })

  it('links the pager to module 3 and home', () => {
    renderPaper()

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: paperPage.pagerPrevLabel }).getAttribute('href')).toBe(
      '/modulo-3',
    )
    expect(within(footer).getByRole('link', { name: paperPage.pagerNextLabel }).getAttribute('href')).toBe(
      '/',
    )
  })
})
