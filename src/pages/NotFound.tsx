import { Link } from 'react-router-dom'
import { PageShell } from '../layout/PageShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Página no encontrada · Diagramas de decisión')

  return (
    <PageShell>
      <h1 className="h1">Página no encontrada</h1>
      <p className="body">
        <Link to="/" className="dd-link">
          Volver al inicio
        </Link>
      </p>
    </PageShell>
  )
}
