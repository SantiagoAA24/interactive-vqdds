import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Paper() {
  useDocumentTitle('Paper · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-3', label: '← Módulo 3' }}
          next={{ to: '/', label: 'Inicio →' }}
          note="Marcador de la página del paper."
        />
      }
    >
      <h1 className="h1">Paper</h1>
    </PageShell>
  )
}
