import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryOptionFormValues } from '../Edit'

const { withAttributeValues, identifiable, referenceCollection } =
    modelFormSchemas

export const categoryOptionSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional(),
        shortName: z.string().trim(),
        formName: z.string().trim().optional(),
        description: z.string().trim().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        organisationUnits: referenceCollection.optional(),
    })

export const initialValues: Partial<CategoryOptionFormValues> =
    getDefaults(categoryOptionSchema)

export const validate = createFormValidate(categoryOptionSchema)
