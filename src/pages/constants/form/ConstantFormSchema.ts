import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
const { identifiable, withDefaultListColumns } = modelFormSchemas

const constantBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    value: z.coerce.number(),
})

export const constantFormSchema = identifiable.merge(constantBaseSchema)

export const ConstantsListSchema = constantBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(constantFormSchema)
export const validate = createFormValidate(constantFormSchema)
