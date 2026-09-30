import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Avatar,
  Button,
  Input,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/atoms'
import { DesignSection } from './DesignSection'

export function AtomExtras() {
  const { t } = useTranslation()
  return (
    <>
      <DesignSection name="Avatar">
        <div className="flex gap-4">
          <Avatar initials="CC" />
          <Avatar initials="C" dense />
        </div>
      </DesignSection>
      <DesignSection name="Input">
        <div className="space-y-3">
          <Input aria-label={t('design.normal')} placeholder={t('design.normal')} />
          <Input aria-label={t('design.invalid')} aria-invalid defaultValue="123" />
          <Input aria-label={t('design.disabled')} disabled />
        </div>
      </DesignSection>
      <DesignSection name="Toggle">
        <div className="flex flex-wrap gap-3">
          <Toggle aria-label={t('design.normal')}>
            <Check aria-hidden />
          </Toggle>
          <Toggle aria-label={t('design.valid')} defaultPressed>
            <Check aria-hidden />
          </Toggle>
          <Toggle aria-label={t('design.disabled')} disabled>
            <X aria-hidden />
          </Toggle>
        </div>
      </DesignSection>
      <DesignSection name="ToggleGroup">
        <ToggleGroup type="single" defaultValue="yes" aria-label={t('design.yesNo')}>
          <ToggleGroupItem value="yes" aria-label={t('detail.igv.true')}>
            <Check aria-hidden />
          </ToggleGroupItem>
          <ToggleGroupItem value="no" aria-label={t('detail.igv.false')}>
            <X aria-hidden />
          </ToggleGroupItem>
        </ToggleGroup>
      </DesignSection>
      <DesignSection name="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">{t('design.hover')}</Button>
            </TooltipTrigger>
            <TooltipContent>{t('design.sample')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DesignSection>
      <DesignSection name="Table">
        <Table>
          <TableCaption>{t('design.sample')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('documents.columns.number')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>F001-0042</TableCell>
            </TableRow>
            <TableRow data-state="selected">
              <TableCell>B001-0017</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{t('design.sample')}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </DesignSection>
      <DesignSection name="CardParts">
        <Card>
          <CardHeader>
            <CardTitle>{t('design.sample')}</CardTitle>
            <CardDescription>{t('design.description')}</CardDescription>
            <CardAction>
              <Button>{t('design.action')}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>{t('design.normal')}</CardContent>
          <CardFooter>{t('design.sample')}</CardFooter>
        </Card>
      </DesignSection>
    </>
  )
}
