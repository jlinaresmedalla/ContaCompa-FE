import { useState } from 'react'

export function useDesignSelect() {
  const [selected, setSelected] = useState('invoice')
  const [multiple, setMultiple] = useState<string[]>(['invoice'])
  return { selected, setSelected, multiple, setMultiple }
}
