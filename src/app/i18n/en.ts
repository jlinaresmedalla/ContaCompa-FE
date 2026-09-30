import { EN_COMMON } from './en/common'
import { EN_NAVIGATION } from './en/navigation'
import { EN_HOME } from './en/home'
import { EN_SESSION } from './en/session'
import { EN_DOCUMENTS } from './en/documents'
import { EN_JOBS } from './en/jobs'
import { EN_COSTS } from './en/costs'
import { EN_DESIGN } from './en/design'

export const EN = {
  ...EN_COMMON,
  ...EN_NAVIGATION,
  ...EN_HOME,
  ...EN_SESSION,
  ...EN_DOCUMENTS,
  ...EN_JOBS,
  ...EN_COSTS,
  ...EN_DESIGN,
}

export type Messages = typeof EN
