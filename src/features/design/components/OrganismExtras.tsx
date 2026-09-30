import { useTranslation } from 'react-i18next'
import {
  AccountMenu,
  AccountPreferences,
  PreferenceSwitches,
  BottomSheet,
} from '@/components/organisms'
import { Button } from '@/components/atoms'
import { InvoiceEditField } from '@/features/documents/components/InvoiceCard'
import { InvoiceEditActions } from '@/features/documents/components/InvoiceEditActions'
import { useDesignEdit } from '../hooks/useDesignEdit'
import { useDesignSheet } from '../hooks/useDesignSheet'
import { DesignSection } from './DesignSection'
import { ListExamples } from './ListExamples'

export function OrganismExtras() {
  const { t } = useTranslation()
  const edit = useDesignEdit()
  const { open, setOpen } = useDesignSheet()
  return (
    <>
      <DesignSection name="AccountMenu">
        <div className="flex flex-wrap gap-4">
          <AccountMenu
            collapsed={false}
            company={t('design.sample')}
            initials="CC"
            timeLeft={null}
            signOut={() => {}}
          />
          <AccountMenu
            collapsed
            company={t('design.sample')}
            initials="CC"
            timeLeft={t('design.sample')}
            signOut={() => {}}
          />
        </div>
      </DesignSection>
      <DesignSection name="Preferences">
        <div className="flex flex-wrap gap-3">
          <PreferenceSwitches />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <AccountPreferences />
        </div>
      </DesignSection>
      <DesignSection name="InvoiceFields">
        <p className="mb-4 text-sm text-muted-foreground">{t('design.featurePatterns')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['doc_type', 'supplier_name', 'supplier_ruc', 'doc_number'] as const).map(
            (name, index) => (
              <div key={name} className="space-y-2">
                <p className="text-sm font-medium">
                  {t(`design.${(['normal', 'changed', 'invalid', 'valid'] as const)[index]!}`)}
                </p>
                <InvoiceEditField name={name} edit={edit} />
              </div>
            ),
          )}
        </div>
      </DesignSection>
      <DesignSection name="YesNo">
        <InvoiceEditField name="prices_include_igv" edit={edit} />
      </DesignSection>
      <DesignSection name="ActionBar">
        <InvoiceEditActions edit={edit} />
        <div className="mt-4">
          <InvoiceEditActions edit={{ ...edit, pending: true }} />
        </div>
      </DesignSection>
      <DesignSection name="BottomSheet">
        <Button onClick={() => setOpen(true)}>{t('design.openSheet')}</Button>
        <BottomSheet
          open={open}
          onOpenChange={setOpen}
          title={t('design.sections.BottomSheet')}
          description={t('design.description')}
          closeLabel={t('detail.cancel')}
        >
          <p>{t('design.sample')}</p>
          <div className="mt-4">
            <InvoiceEditActions edit={edit} />
          </div>
        </BottomSheet>
      </DesignSection>
      <ListExamples />
    </>
  )
}
