import { AppLayout } from '@/components/templates'
import { useAccountMenu } from './useAccountMenu'

export function PrivateLayout() {
  const account = useAccountMenu()
  return <AppLayout account={account} />
}
