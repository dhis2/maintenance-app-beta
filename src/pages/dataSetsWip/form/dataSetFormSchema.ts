import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'

const { withAttributeValues, identifiable, style, referenceCollection } =
    modelFormSchemas

export const dataSetFormSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        id: z.string().optional(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        style,
        dataElements: referenceCollection.default([]),
        // categoryCombo: z.object({ id: z.string() }),
    })

export const initialValues = getDefaults(dataSetFormSchema)

export const validate = createFormValidate(dataSetFormSchema)
