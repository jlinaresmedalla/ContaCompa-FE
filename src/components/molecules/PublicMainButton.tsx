import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/atoms'
export function PublicMainButton({ destination }: { destination: string }) {
  const { t } = useTranslation()
  return (
    <Button asChild>
      <Link to={destination}>{t('publicLayout.goToApp')}</Link>
    </Button>
  )
}
