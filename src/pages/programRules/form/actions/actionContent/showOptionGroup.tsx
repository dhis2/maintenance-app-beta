import i18n from '@dhis2/d2-i18n'
import { optionGroupFields } from './common/optionGroup'

export const showOptionGroup = (programId: string) =>
    optionGroupFields(programId, i18n.t('Option group to show'))
