import { useState } from 'react'

export function useDesignSheet() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
