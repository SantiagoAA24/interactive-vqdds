import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTrainer } from '../hooks/useTrainer'

export default function Module3() {
  useDocumentTitle('Módulo 3 · Diagramas de decisión')
  // Mount trainer so Vite packs train.worker.ts (UI arrives in 8C).
  useTrainer()

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-2', label: '← Módulo 2' }}
          next={{ to: '/paper', label: 'Sobre el paper →' }}
          note="Marcador del módulo 3."
        />
      }
    >
      <h1 className="h1">Módulo 3</h1>
    </PageShell>
  )
}
