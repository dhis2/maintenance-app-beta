import { z } from 'zod'
import {
    getDefaultsOld,
    modelFormSchemas,
    createFormValidate,
} from '../../../lib'

const { identifiable, withAttributeValues, withDefaultListColumns } =
    modelFormSchemas

const dataElementGroupBaseSchema = z.object({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    dataElements: z.array(z.object({ id: z.string() })).default([]),
})

export const dataElementGroupListSchema = dataElementGroupBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        name: z.string(),
    })

export const dataElementGroupFormSchema = dataElementGroupBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)

export const initialValues = getDefaultsOld(dataElementGroupFormSchema)

export const validate = createFormValidate(dataElementGroupFormSchema)
