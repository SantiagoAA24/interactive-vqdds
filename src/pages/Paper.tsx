import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'
import {
  paperComparisonRows,
  paperContributions,
  paperPage,
} from '../content/paper'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ModulePager } from '../layout/ModulePager'
import { PageShell } from '../layout/PageShell'
import './paper.css'

export default function Paper() {
  useDocumentTitle('Acerca del paper · Diagramas de decisión')

  return (
    <PageShell
      footer={
        <ModulePager
          prev={{ to: '/modulo-3', label: paperPage.pagerPrevLabel }}
          next={{ to: '/', label: paperPage.pagerNextLabel }}
          note={paperPage.pagerNote}
        />
      }
    >
      <div className="paper-stack">
        <section className="paper-intro" aria-labelledby="paper-title">
          <p className="eyebrow paper-breadcrumb">
            <Link to="/">{paperPage.breadcrumbHome}</Link>
            {' / '}
            {paperPage.breadcrumbCurrent}
          </p>
          <h1 id="paper-title" className="h1">
            {paperPage.title}
          </h1>
          <p className="lead">{paperPage.lead}</p>
        </section>

        <section className="paper-panels" aria-label="Cita y aportes del paper">
          <Panel accent>
            <h2 className="card-title">{paperPage.citeHeading}</h2>
            <p className="body">
              {paperPage.arxivId}
              <br />
              {paperPage.doi}
            </p>
            <p className="body-sm">{paperPage.authors}</p>
            <div className="paper-cite-actions">
              <Button variant="primary" href={paperPage.arxivUrl}>
                {paperPage.openArxivLabel}
              </Button>
              <Button variant="secondary" href={paperPage.pdfUrl}>
                {paperPage.pdfLabel}
              </Button>
            </div>
          </Panel>

          <Panel>
            <h2 className="card-title">{paperPage.contributesHeading}</h2>
            <ul className="paper-contributions body">
              {paperContributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="paper-comparison" aria-labelledby="paper-comparison-title">
          <h2 id="paper-comparison-title" className="h2">
            {paperPage.comparisonHeading}
          </h2>
          <Panel>
            <div className="paper-table">
              <div className="paper-table-head eyebrow" role="row">
                <span>{paperPage.comparisonColumns.topic}</span>
                <span>{paperPage.comparisonColumns.paper}</span>
                <span>{paperPage.comparisonColumns.demo}</span>
              </div>
              {paperComparisonRows.map((row) => (
                <div key={row.topic} className="paper-table-row body" role="row">
                  <span className="paper-table-topic">{row.topic}</span>
                  <span className="paper-table-paper">{row.paper}</span>
                  <span className="paper-table-demo">{row.demo}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section
          className="dd-band paper-limits"
          aria-labelledby="paper-limits-title"
        >
          <h2 id="paper-limits-title" className="h2-band">
            {paperPage.limitsHeading}
          </h2>
          <p className="body">{paperPage.limitsBody}</p>
        </section>
      </div>
    </PageShell>
  )
}
