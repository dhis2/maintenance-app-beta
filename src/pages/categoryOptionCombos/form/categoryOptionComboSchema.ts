import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'

const { withAttributeValues, withDefaultListColumns } = modelFormSchemas

const categoryOptionComboBaeSchema = z.object({
    code: z.string().trim().optional(),
})

// categoryCombos should only be able to change the code and attributes
export const categoryOptionComboFormSchema = withAttributeValues
    .merge(categoryOptionComboBaeSchema)
    .extend({
        id: z.string(),
        ignoreApproval: z.boolean().optional().default(false),
    })
export const categoryOptionComboListSchema = categoryOptionComboBaeSchema.merge(
    withDefaultListColumns
)

export const initialValues = getDefaults(categoryOptionComboFormSchema)

export const validate = createFormValidate(categoryOptionComboFormSchema)
