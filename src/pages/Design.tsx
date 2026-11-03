import tokens from '../../docs/design-system/tokens.json'

const TYPE_STYLES = tokens.type.groups.flatMap((group) =>
  group.styles.map((style) => style.name),
)

function colorValue(token: (typeof tokens.color.tokens)[number]): string {
  return token.value.dark
}

export default function Design() {
  return (
    <main
      style={{
        maxWidth: 'var(--container)',
        marginInline: 'auto',
        padding: 'var(--space-32)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-64)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <p className="eyebrow">Sistema de diseño</p>
        <h1 className="h1">Tokens</h1>
        <p className="lead">
          Colores, tipografía, radios y espaciados del recurso Diagramas de decisión.
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <h2 className="h2">Colores</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, var(--space-96)), 1fr))',
            gap: 'var(--space-16)',
          }}
        >
          {tokens.color.tokens.map((token) => (
            <div
              key={token.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-12)',
                padding: 'var(--space-16)',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  height: 'var(--space-48)',
                  background: `var(--${token.name})`,
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <p className="body-sm">{token.name}</p>
              <p className="value">{colorValue(token)}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <h2 className="h2">Tipografía</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
          {TYPE_STYLES.map((name) => (
            <div
              key={name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-8)',
                padding: 'var(--space-20)',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <p className="eyebrow">{name}</p>
              <p className={name}>
                {name === 'eyebrow'
                  ? 'Etiqueta de sección'
                  : name === 'value'
                    ? '−4,533'
                    : `Texto de ejemplo · ${name}`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <h2 className="h2">Radios</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, var(--space-96)), 1fr))',
            gap: 'var(--space-16)',
          }}
        >
          {tokens.radius.tokens.map((token) => (
            <div
              key={token.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-12)',
                padding: 'var(--space-16)',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  height: 'var(--space-64)',
                  background: 'var(--accent)',
                  borderRadius: `var(--${token.name})`,
                }}
              />
              <p className="body-sm">{token.name}</p>
              <p className="value">{token.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        <h2 className="h2">Espaciados</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
          {tokens.spacing.tokens.map((token) => (
            <div
              key={token.name}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--space-16)',
                padding: 'var(--space-16)',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: `var(--${token.name})`,
                  height: 'var(--space-24)',
                  maxWidth: '100%',
                  background: 'var(--accent)',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <p className="body-sm">{token.name}</p>
              <p className="value">{token.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
