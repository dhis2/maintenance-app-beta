import { z } from 'zod'
import { getDefaults, modelFormSchemas, createFormValidate } from '../../../lib'

const { identifiable, withAttributeValues, withDefaultListColumns } =
    modelFormSchemas

const DataElementGroupBaseSchema = z.object({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    dataElements: z.array(z.object({ id: z.string() })).default([]),
})

export const DataElementGroupListSchema = DataElementGroupBaseSchema.merge(
    withDefaultListColumns
)
    .merge(withAttributeValues)
    .extend({
        name: z.string(),
    })

export const DataElementGroupFormSchema =
    DataElementGroupBaseSchema.merge(identifiable).merge(withAttributeValues)

export const initialValues = getDefaults(DataElementGroupFormSchema)

export const validate = createFormValidate(DataElementGroupFormSchema)
