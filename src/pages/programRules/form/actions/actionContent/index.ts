import type { ReactNode } from 'react'

export type ActionFieldsRenderer = (programId: string) => ReactNode

export { assignFields } from './assignFields'
export { createEventFields } from './createEventFields'
export { displayKeyValuePairFields } from './displayKeyValuePairFields'
export { displayTextFields } from './displayTextFields'
export { hideFieldFields } from './hideFieldFields'
export { hideOptionFields } from './hideOptionFields'
export { hideProgramStageFields } from './hideProgramStageFields'
export { hideSectionFields } from './hideSectionFields'
export { messageActionFields } from './messageActionFields'
export { optionGroupFields } from './optionGroupFields'
export { scheduleMessageFields } from './scheduleMessageFields'
export { sendMessageFields } from './sendMessageFields'
export { setMandatoryFieldFields } from './setMandatoryFieldFields'
