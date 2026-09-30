import { AppLayout } from '@/components/templates'
import { useAccountMenu } from './use-account-menu'

export function PrivateLayout() {
  const account = useAccountMenu()
  return <AppLayout account={account} />
}
