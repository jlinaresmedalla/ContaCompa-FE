import { useState } from 'react'
import { ARCHITECTURE } from '../../utils/architectureData'

export type ArchitectureFlow = 'overview' | (typeof ARCHITECTURE.meta.views)[number]['id']
export type ArchitectureNode = (typeof ARCHITECTURE.components)[number]['id']

export function useArchitecture() {
  const [flow, setFlow] = useState<ArchitectureFlow>('overview')
  const [node, setNode] = useState<ArchitectureNode>('dashboard')
  const view = ARCHITECTURE.meta.views.find((item) => item.id === flow)
  const isActive = (id: string) => !view || (view.focus as readonly string[]).includes(id)
  return { flow, setFlow, node, setNode, isActive }
}
