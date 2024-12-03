import { z } from 'zod'
import { createFormValidate, modelFormSchemas } from '../../../lib'

const { referenceCollection, modelReference } = modelFormSchemas

export const mergeFormSchema = z.object({
    sources: referenceCollection.min(1).default([]),
    target: modelReference, //z.string(),
    deleteSources: z.enum(['keep', 'delete']).default('keep'),
})

export type IndicatorTypeMergeFormValues = z.infer<typeof mergeFormSchema>

export const validate = createFormValidate(mergeFormSchema)
