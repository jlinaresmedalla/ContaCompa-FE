import { useTranslation } from 'react-i18next'
import type { AriaLiveMessages, GroupBase } from 'react-select'

import type { AppSelectOption } from './types'

export function useSelectMessages<T extends string>() {
  const { t } = useTranslation()
  const ariaLiveMessages: AriaLiveMessages<
    AppSelectOption<T>,
    boolean,
    GroupBase<AppSelectOption<T>>
  > = {
    guidance: () => t('common.selectGuidance'),
    onChange: ({ labels, label, action }) =>
      t(
        action === 'remove-value' || action === 'pop-value' || action === 'deselect-option'
          ? 'common.selectRemoved'
          : 'common.selectSelected',
        { label: labels?.join(', ') || label || t('common.none') },
      ),
    onFocus: ({ label }) => t('common.selectFocused', { label }),
    onFilter: ({ resultsMessage, inputValue }) =>
      t('common.selectResults', { results: resultsMessage, term: inputValue }),
  }
  return {
    ariaLiveMessages,
    screenReaderStatus: ({ count }: { count: number }) => t('common.selectCount', { count }),
  }
}
