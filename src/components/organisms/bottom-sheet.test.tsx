import { useRef, useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test } from 'vitest'
import { BottomSheet } from './bottom-sheet'

function Harness() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>
        Open sheet
      </button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Sheet"
        description="Edit values"
        closeLabel="Close sheet"
        returnFocusRef={trigger}
      >
        <input aria-label="Value" />
      </BottomSheet>
    </>
  )
}

test('focus enters the dialog, Escape closes it and focus returns to its opener', async () => {
  render(<Harness />)
  const trigger = screen.getByRole('button', { name: 'Open sheet' })
  trigger.focus()
  fireEvent.click(trigger)
  const sheet = screen.getByRole('dialog', { name: 'Sheet' })
  expect(sheet).toHaveAccessibleDescription('Edit values')
  await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true))
  trigger.focus()
  await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true))
  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await waitFor(() => expect(trigger).toHaveFocus())
})

test('outside pointer dismissal closes the sheet', async () => {
  render(<Harness />)
  fireEvent.click(screen.getByRole('button', { name: 'Open sheet' }))
  await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
  // Radix registers the document pointer listener after the opening event.
  await new Promise<void>((resolve) => setTimeout(resolve, 0))
  fireEvent.pointerDown(document.body, { pointerType: 'touch' })
  fireEvent.click(document.body)
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})
