import type { Messages } from './en'
import { ES_COMMON } from './es/common'
import { ES_NAVIGATION } from './es/navigation'
import { ES_HOME } from './es/home'
import { ES_SESSION } from './es/session'
import { ES_DOCUMENTS } from './es/documents'
import { ES_JOBS } from './es/jobs'
import { ES_COSTS } from './es/costs'
import { ES_DESIGN } from './es/design'

export const ES: Messages = {
  ...ES_COMMON,
  ...ES_NAVIGATION,
  ...ES_HOME,
  ...ES_SESSION,
  ...ES_DOCUMENTS,
  ...ES_JOBS,
  ...ES_COSTS,
  ...ES_DESIGN,
}
