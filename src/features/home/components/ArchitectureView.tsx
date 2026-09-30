import { useId } from 'react'
import { usePhoneWidth } from '@/lib/use-phone-width'
import { ArchitectureText } from './ArchitectureText'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms'
import { ARCHITECTURE } from '../architecture-data'
import { boundaryBox, connectionLine, GEOMETRY } from '../architecture-layout'
import { useArchitecture } from '../use-architecture'
import { ArchitectureSummary } from './ArchitectureSummary'

export function ArchitectureView() {
  const { t } = useTranslation()
  const { flow, setFlow, node, setNode, isActive } = useArchitecture()
  const id = useId()
  const isPhone = usePhoneWidth()
  return (
    <div className="space-y-4">
      <ArchitectureSummary />
      {isPhone ? (
        <ArchitectureText />
      ) : (
        <>
          <div
            role="group"
            aria-label={t('home.diagram.flowsLabel')}
            className="flex flex-wrap gap-2"
          >
            {(['overview', ...ARCHITECTURE.meta.views.map((view) => view.id)] as const).map(
              (value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={flow === value ? 'primary' : 'outline'}
                  aria-pressed={flow === value}
                  onClick={() => setFlow(value)}
                >
                  {t(`home.diagram.flows.${value}.label`)}
                </Button>
              ),
            )}
          </div>
          <p>{t(`home.diagram.flows.${flow}.note`)}</p>
          <div
            className="max-w-full overflow-x-auto rounded-xl border border-border"
            role="region"
            aria-label={t('home.architecture')}
          >
            <svg
              viewBox={`0 0 ${GEOMETRY.width} ${GEOMETRY.height}`}
              className="w-full bg-card"
              role="group"
              aria-labelledby={`${id}-title`}
            >
              <title id={`${id}-title`}>{t('home.architectureAlt')}</title>
              <defs>
                <marker
                  id={`${id}-arrow`}
                  markerWidth={GEOMETRY.arrow}
                  markerHeight={GEOMETRY.arrow}
                  refX={GEOMETRY.arrow}
                  refY={GEOMETRY.arrow / GEOMETRY.half}
                  orient="auto"
                >
                  <path
                    d={`M0,0 L${GEOMETRY.arrow},${GEOMETRY.arrow / GEOMETRY.half} L0,${GEOMETRY.arrow}`}
                    fill="none"
                    stroke="var(--muted-foreground)"
                  />
                </marker>
              </defs>
              {ARCHITECTURE.boundaries.map((boundary, index) => (
                <g key={boundary.label}>
                  <rect
                    {...boundaryBox(boundary.wraps)}
                    rx={GEOMETRY.radius}
                    fill="var(--muted)"
                    stroke="var(--border)"
                  />
                  <text
                    x={boundaryBox(boundary.wraps).x + GEOMETRY.padding}
                    y={boundaryBox(boundary.wraps).y + GEOMETRY.labelY}
                    fill="var(--muted-foreground)"
                    fontSize={GEOMETRY.smallFont}
                  >
                    {t('home.diagram.boundaries', { returnObjects: true })[index]}
                  </text>
                </g>
              ))}
              {ARCHITECTURE.connections.map((connection) => (
                <g
                  key={connection.id}
                  data-connection={connection.id}
                  opacity={isActive(connection.from) && isActive(connection.to) ? 1 : GEOMETRY.dim}
                >
                  <line
                    x1={connectionLine(connection).x1}
                    y1={connectionLine(connection).y1}
                    x2={connectionLine(connection).x2}
                    y2={connectionLine(connection).y2}
                    stroke="var(--muted-foreground)"
                    strokeWidth={GEOMETRY.stroke}
                    strokeDasharray={
                      'variant' in connection && connection.variant === 'dashed' ? '6 4' : undefined
                    }
                    markerEnd={`url(#${id}-arrow)`}
                  />
                  <text
                    x={connectionLine(connection).labelX}
                    y={connectionLine(connection).labelY}
                    textAnchor="middle"
                    fill="var(--foreground)"
                    fontSize={GEOMETRY.smallFont}
                    paintOrder="stroke"
                    stroke="var(--card)"
                    strokeWidth={GEOMETRY.labelStroke}
                    strokeLinejoin="round"
                  >
                    {t(`home.diagram.connections.${connection.id}`)}
                  </text>
                </g>
              ))}
              {ARCHITECTURE.components.map((component) => (
                <g
                  key={component.id}
                  data-node={component.id}
                  opacity={isActive(component.id) ? 1 : GEOMETRY.dim}
                >
                  <foreignObject
                    x={component.pos[0]}
                    y={component.pos[1]}
                    width={component.size[0]}
                    height={component.size[1]}
                  >
                    <button
                      type="button"
                      aria-describedby={node === component.id ? `${id}-role` : undefined}
                      title={t(`home.diagram.nodes.${component.id}.role`)}
                      onMouseEnter={() => setNode(component.id)}
                      onFocus={() => setNode(component.id)}
                      onClick={() => setNode(component.id)}
                      className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-primary bg-card px-1 text-card-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      <span className="text-sm font-semibold">
                        {t(`home.diagram.nodes.${component.id}.label`)}
                      </span>
                    </button>
                  </foreignObject>
                </g>
              ))}
            </svg>
          </div>
          <p id={`${id}-role`} aria-live="polite" className="rounded-xl bg-muted p-3 text-sm">
            <strong>{t(`home.diagram.nodes.${node}.label`)}: </strong>
            {t(`home.diagram.nodes.${node}.role`)}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {t(`home.diagram.flows.${flow}.items`, { returnObjects: true }).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <details className="rounded-card border border-border bg-card p-card text-sm">
            <summary className="list-none cursor-pointer rounded-control bg-muted px-3 py-2 font-medium focus-visible:ring-2 focus-visible:ring-ring">
              {t('home.diagram.textAlternative')}
            </summary>
            <ArchitectureText />
          </details>
        </>
      )}
    </div>
  )
}
