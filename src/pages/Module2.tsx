import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Module2() {
  useDocumentTitle('Módulo 2 · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-1', label: '← Módulo 1' }}
          next={{ to: '/modulo-3', label: 'Módulo 3 →' }}
          note="Marcador del módulo 2."
        />
      }
    >
      <h1 className="h1">Módulo 2</h1>
    </PageShell>
  )
}
