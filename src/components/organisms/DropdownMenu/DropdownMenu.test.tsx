import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '.'

test('regular, active link and radio items retain the semantic focus ring', async () => {
  render(
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="/extraction/purchase-docs"
            aria-current="page"
            className="aria-[current=page]:bg-muted"
          >
            Current page
          </a>
        </DropdownMenuItem>
        <DropdownMenuRadioGroup value="en">
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>,
  )
  fireEvent.keyDown(screen.getByRole('button', { name: 'Open' }), { key: 'Enter' })
  await screen.findByRole('menuitem', { name: 'Sign out' })
  for (const item of [
    ...screen.getAllByRole('menuitem'),
    ...screen.getAllByRole('menuitemradio'),
  ]) {
    expect(item).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-inset',
    )
  }
  expect(screen.getByRole('menuitem', { name: 'Current page' })).toHaveClass(
    'aria-[current=page]:bg-muted',
  )
})
