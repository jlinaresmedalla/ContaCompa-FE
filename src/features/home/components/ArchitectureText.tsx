import { useTranslation } from 'react-i18next'
import { ARCHITECTURE } from '../architecture-data'

export function ArchitectureText() {
  const { t } = useTranslation()
  return (
    <ul className="mt-3 space-y-2">
      {ARCHITECTURE.boundaries.map((boundary, index) => (
        <li key={boundary.label}>
          {t('home.diagram.boundaries', { returnObjects: true })[index]}:{' '}
          {boundary.wraps.map((node) => t(`home.diagram.nodes.${node}.label`)).join(', ')}
        </li>
      ))}
      {ARCHITECTURE.components.map((component) => (
        <li key={component.id}>
          <strong>{t(`home.diagram.nodes.${component.id}.label`)}: </strong>
          {t(`home.diagram.nodes.${component.id}.role`)}
        </li>
      ))}
      {ARCHITECTURE.connections.map((connection) => (
        <li key={connection.id}>
          {t(`home.diagram.nodes.${connection.from}.label`)} →{' '}
          {t(`home.diagram.nodes.${connection.to}.label`)}:{' '}
          {t(`home.diagram.connections.${connection.id}`)}
        </li>
      ))}
    </ul>
  )
}
