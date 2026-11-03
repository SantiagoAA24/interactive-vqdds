import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Module1() {
  useDocumentTitle('Módulo 1 · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/', label: '← Inicio' }}
          next={{ to: '/modulo-2', label: 'Módulo 2 →' }}
          note="Marcador del módulo 1."
        />
      }
    >
      <h1 className="h1">Módulo 1</h1>
    </PageShell>
  )
}
