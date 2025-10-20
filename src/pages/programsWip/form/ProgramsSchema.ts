import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns, modelReference } =
    modelFormSchemas

const programBaseSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
    version: z.coerce
        .number()
        .int(i18n.t('Only integers are allowed'))
        .optional(),
    featureType: z.enum(['NONE', 'POINT', 'POLYGON']).optional(),
    relatedProgram: modelReference.optional(),
    categoryCombo: modelReference,
})

export const programFormSchema = identifiable.merge(programBaseSchema).extend({
    name: z.string(),
    shortName: z.string(),
    programType: z.enum(['WITH_REGISTRATION']).default('WITH_REGISTRATION'),
})

export const programListSchema = programBaseSchema.merge(withDefaultListColumns)

export const initialValues = getDefaults(programFormSchema)

export const validate = createFormValidate(programFormSchema)
