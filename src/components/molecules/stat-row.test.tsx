import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { StatRow } from './stat-row'
import { Stat } from './stat-card'

test('renders every stat in a single equal-share row', () => {
  const { container } = render(
    <StatRow>
      <Stat label="Documents" value="1" />
      <Stat label="Jobs" value="2" />
      <Stat label="Costs" value="3" />
    </StatRow>,
  )
  for (const label of ['Documents', 'Jobs', 'Costs']) expect(screen.getByText(label)).toBeVisible()
  expect(container.firstChild).toHaveClass('grid-flow-col', 'auto-cols-fr', 'overflow-x-auto')
})

test('renders nothing without cards', () => {
  const { container } = render(<StatRow />)
  expect(container).toBeEmptyDOMElement()
})
