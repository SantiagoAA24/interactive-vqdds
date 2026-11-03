import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type TokenList = { name: string }[]

type TokensJson = {
  color: { tokens: TokenList }
  spacing: { tokens: TokenList }
}

describe('design tokens css', () => {
  it('defines a css variable for every color and spacing token', () => {
    const root = resolve(process.cwd())
    const tokensJson = JSON.parse(
      readFileSync(resolve(root, 'docs/design-system/tokens.json'), 'utf8'),
    ) as TokensJson
    const tokensCss = readFileSync(resolve(root, 'src/styles/tokens.css'), 'utf8')

    for (const token of tokensJson.color.tokens) {
      expect(tokensCss).toMatch(new RegExp(`--${token.name}\\s*:`))
    }

    for (const token of tokensJson.spacing.tokens) {
      expect(tokensCss).toMatch(new RegExp(`--${token.name}\\s*:`))
    }
  })
})
