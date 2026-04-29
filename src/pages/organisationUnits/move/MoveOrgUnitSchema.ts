import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { mergeFormSchemaBase } from '../../../components/merge'
import { createFormValidate } from '../../../lib'

const orgUnitSchema = z.object({
    id: z.string(),
    displayName: z.string(),
    path: z.string(),
})

export const moveFormSchema = mergeFormSchemaBase.extend({
    sources: z
        .array(orgUnitSchema)
        .min(1, i18n.t('At least one org unit is required')),
    target: orgUnitSchema.optional(),
})

export type MoveOrgUnitFormValues = z.input<typeof moveFormSchema>

export const moveOrgUnitFormValidate = createFormValidate(moveFormSchema)
