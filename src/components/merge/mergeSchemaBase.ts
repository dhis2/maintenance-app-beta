import { z } from 'zod'
import { modelFormSchemas } from '../../lib'

const { referenceCollection, modelReference } = modelFormSchemas

export const mergeFormSchemaBase = z.object({
    // when posting we just need the IDs, however, it is useful to keep the full objects
    // in case we want access to eg. displayNames
    sources: referenceCollection
        .default([])
        .transform((val) => val.map((v) => v.id)),
    target: modelReference.transform((val) => val.id),
    deleteSources: z.boolean().default(false),
})

export type MergeFormValuesBase = Partial<z.input<typeof mergeFormSchemaBase>>
