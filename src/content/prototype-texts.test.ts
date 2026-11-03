import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { homeFooter } from './home'
import { module1Page } from './module1'
import { paperPage } from './paper'

const ROOT = resolve(process.cwd())

/** Nav anclas del Main.dc.html sustituidas por la Nav global del paso 4.
 *  q1–q3: etiquetas SVG del prototipo no expuestas por la API de NodeDiagram. */
const INTENTIONAL_OMISSIONS = new Set(['Módulos', 'Cómo usar', 'Glosario', 'q1', 'q2', 'q3'])

function readUtf8(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf8')
}

function extractVisibleTexts(html: string): string[] {
  const xdcMatch = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/i)
  if (!xdcMatch) return []

  const withoutChrome = xdcMatch[1]
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<helmet\b[\s\S]*?<\/helmet>/gi, ' ')

  const withBreaks = withoutChrome
    .replace(/\{\{[^}]+\}\}/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(
      /<\/(p|h[1-6]|div|li|tr|article|section|header|footer|a|span|nav|ul|button|i)\s*>/gi,
      '\n',
    )
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')

  const texts = new Set<string>()
  for (const rawLine of withBreaks.split(/\n+/)) {
    const line = rawLine.replace(/\s+/g, ' ').trim()
    if (line.length < 2) continue
    if (INTENTIONAL_OMISSIONS.has(line)) continue
    texts.add(line)
  }
  return [...texts]
}

function collectCorpus(): string {
  const parts: string[] = []

  const contentDir = resolve(ROOT, 'src/content')
  for (const name of readdirSync(contentDir)) {
    if (!name.endsWith('.ts') || name.endsWith('.test.ts')) continue
    parts.push(readUtf8(`src/content/${name}`))
  }

  for (const path of [
    'src/pages/Home.tsx',
    'src/pages/Paper.tsx',
    'src/pages/Module1.tsx',
    'src/layout/Nav.tsx',
    'src/layout/ModulePager.tsx',
  ]) {
    parts.push(readUtf8(path))
  }

  // Frases compuestas que en el prototipo viven en un solo nodo de texto.
  parts.push(
    `${homeFooter.citationBefore}${homeFooter.citationTitle}${homeFooter.citationAfter}${homeFooter.arxivLabel}`,
    `${homeFooter.citationBefore}${homeFooter.citationTitle} , ${homeFooter.arxivLabel}`,
    ` / ${paperPage.breadcrumbCurrent}`,
    `/${paperPage.breadcrumbCurrent}`,
    ` / ${module1Page.breadcrumbCurrent}`,
    'Amplitud de | ⟩ = producto del camino',
    'módulo = → probabilidad =',
    'módulo · fase',
    '| ⟩',
    'q1 =',
    'q2 =',
    'q3 =',
  )

  return parts.join('\n')
}

describe('prototype visible texts', () => {
  const corpus = collectCorpus()

  it.each([
    ['docs/prototypes/Main.dc.html'],
    ['docs/prototypes/Paper.dc.html'],
    ['docs/prototypes/Modulo-1.dc.html'],
  ] as const)('keeps every visible text from %s in content or pages', (prototypePath) => {
    const html = readUtf8(prototypePath)
    const texts = extractVisibleTexts(html)
    expect(texts.length).toBeGreaterThan(10)

    const missing = texts.filter((text) => !corpus.includes(text))
    expect(missing).toEqual([])
  })
})
