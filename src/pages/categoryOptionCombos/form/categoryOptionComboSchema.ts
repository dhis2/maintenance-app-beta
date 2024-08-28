import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryOptionComboFormValues } from '../Edit'

const { withAttributeValues } = modelFormSchemas

// categoryCombos should only be able to change the code and attributes
export const categoryOptionComboSchema = withAttributeValues.extend({
    id: z.string(),
    code: z.string().trim().optional(),
})

export const initialValues: Partial<CategoryOptionComboFormValues> =
    getDefaults(categoryOptionComboSchema)

export const validate = createFormValidate(categoryOptionComboSchema)
