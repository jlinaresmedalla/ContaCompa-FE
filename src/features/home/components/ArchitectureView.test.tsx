import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { i18n } from '@/app/i18n'
import { ARCHITECTURE } from '../architecture-data'
import { GEOMETRY } from '../architecture-layout'
import { ArchitectureView } from './ArchitectureView'

beforeEach(async () => {
  await i18n.changeLanguage('en')
})

test('selecting a flow dims unrelated nodes and connections and shows its explanation', () => {
  const { container } = render(<ArchitectureView />)
  fireEvent.click(screen.getByRole('button', { name: 'Sign-in and keys' }))
  const focus: readonly string[] = ARCHITECTURE.meta.views[0].focus
  for (const node of ARCHITECTURE.components) {
    expect(container.querySelector(`[data-node="${node.id}"]`)).toHaveAttribute(
      'opacity',
      String(focus.includes(node.id) ? 1 : GEOMETRY.dim),
    )
  }
  for (const connection of ARCHITECTURE.connections) {
    expect(container.querySelector(`[data-connection="${connection.id}"]`)).toHaveAttribute(
      'opacity',
      String(focus.includes(connection.from) && focus.includes(connection.to) ? 1 : GEOMETRY.dim),
    )
  }
  expect(screen.getByRole('button', { name: 'Sign-in and keys' })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  expect(
    screen.getByText('Only a SHA-256 hash is stored; keys never appear in logs.'),
  ).toBeVisible()
})

test('Overview restores every node and connection after each flow', () => {
  const { container } = render(<ArchitectureView />)
  for (const name of ['Sign-in and keys', 'Upload path', 'Extraction job', 'Pure core']) {
    fireEvent.click(screen.getByRole('button', { name }))
    fireEvent.click(screen.getByRole('button', { name: 'Overview' }))
    for (const element of container.querySelectorAll('[data-node], [data-connection]')) {
      expect(element).toHaveAttribute('opacity', '1')
    }
  }
})

test('nodes reveal roles on hover, focus and tap and provide a text alternative', () => {
  render(<ArchitectureView />)
  const worker = screen.getByRole('button', { name: 'Worker' })
  const api = screen.getByRole('button', { name: 'HTTP API' })
  const domain = screen.getByRole('button', { name: 'Domain' })
  const role = document.querySelector('[aria-live="polite"]')
  fireEvent.mouseEnter(worker)
  expect(role).toHaveTextContent('Claims queued jobs and pauses during provider outages.')
  fireEvent.focus(api)
  expect(role).toHaveTextContent('Guards requests with the company key')
  fireEvent.click(domain)
  expect(role).toHaveTextContent('Pure rules, schemas and IGV checks')
  expect(domain).toHaveAttribute('type', 'button')
  expect(screen.getByText('Read the architecture as text')).toBeVisible()
})

test('flow labels and node roles use native Spanish copy', async () => {
  await i18n.changeLanguage('es')
  render(<ArchitectureView />)
  fireEvent.click(screen.getByRole('button', { name: 'Carga de archivos' }))
  fireEvent.click(screen.getByRole('button', { name: 'Procesador' }))
  expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(
    'Toma procesamientos de la cola',
  )
  expect(
    screen.getByText('El comprobante y su procesamiento se registran en una sola transacción.'),
  ).toBeVisible()
})
