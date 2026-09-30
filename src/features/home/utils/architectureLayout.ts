import { ARCHITECTURE } from './architectureData'

export const GEOMETRY = {
  width: 1210,
  height: 630,
  half: 2,
  padding: 20,
  heading: 40,
  radius: 12,
  labelY: 27,
  sublabelY: 48,
  font: 14,
  smallFont: 11,
  stroke: 2,
  labelStroke: 6,
  labelOffset: 12,
  dim: 0.2,
  arrow: 8,
} as const

export function boundaryBox(wraps: readonly string[]) {
  const nodes = ARCHITECTURE.components.filter((node) => wraps.includes(node.id))
  const x = Math.min(...nodes.map((node) => node.pos[0])) - GEOMETRY.padding
  const y = Math.min(...nodes.map((node) => node.pos[1])) - GEOMETRY.heading
  return {
    x,
    y,
    width: Math.max(...nodes.map((node) => node.pos[0] + node.size[0])) - x + GEOMETRY.padding,
    height: Math.max(...nodes.map((node) => node.pos[1] + node.size[1])) - y + GEOMETRY.padding,
  }
}

export function connectionLine(connection: {
  from: string
  to: string
  fromSide?: string
  toSide?: string
  labelAt?: readonly [number, number]
}) {
  const from = ARCHITECTURE.components.find((node) => node.id === connection.from)!
  const to = ARCHITECTURE.components.find((node) => node.id === connection.to)!
  const dx = to.pos[0] - from.pos[0]
  const dy = to.pos[1] - from.pos[1]
  const vertical = Math.abs(dy) > Math.abs(dx)
  const x1 =
    from.pos[0] +
    (vertical || connection.fromSide === 'bottom' ? from.size[0] / GEOMETRY.half : from.size[0])
  const y1 =
    from.pos[1] +
    (vertical || connection.fromSide === 'bottom' ? from.size[1] : from.size[1] / GEOMETRY.half)
  const x2 = to.pos[0] + (vertical ? to.size[0] / GEOMETRY.half : 0)
  const y2 = to.pos[1] + (vertical ? 0 : to.size[1] / GEOMETRY.half)
  return {
    x1,
    y1,
    x2,
    y2,
    labelX: connection.labelAt?.[0] ?? (x1 + x2) / GEOMETRY.half,
    labelY: (connection.labelAt?.[1] ?? (y1 + y2) / GEOMETRY.half) - GEOMETRY.labelOffset,
  }
}
