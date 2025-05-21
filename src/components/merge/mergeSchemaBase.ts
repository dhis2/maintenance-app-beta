import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { modelFormSchemas } from '../../lib'

const { referenceCollection, modelReference } = modelFormSchemas

export const mergeFormSchemaBase = z.object({
    // when posting we just need the IDs, however, it is useful to keep the full objects
    // in case we want access to eg. displayNames
    sources: referenceCollection
        .min(1, i18n.t('At least one source is required'))
        .default([])
        .transform((val) => val.map((v) => v.id)),
    target: modelReference.transform((val) => val.id),
    deleteSources: z.boolean().default(true),
})

export type MergeFormValuesBase = Partial<z.input<typeof mergeFormSchemaBase>>
