import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle('Inicio · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <ModulePager
          next={{ to: '/modulo-1', label: 'Módulo 1 →' }}
          note="Marcador de la página de inicio."
        />
      }
    >
      <h1 className="h1">Inicio</h1>
    </PageShell>
  )
}
