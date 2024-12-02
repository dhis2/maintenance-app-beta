import { z } from 'zod'
import { createFormValidate, modelFormSchemas } from '../../../lib'

const { referenceCollection } = modelFormSchemas

export const mergeFormSchema = z.object({
    sources: referenceCollection.default([]),
    target: referenceCollection.length(1).default([]),
    deleteSources: z.enum(['keep', 'delete']).default('keep'),
})

export const validate = createFormValidate(mergeFormSchema)
