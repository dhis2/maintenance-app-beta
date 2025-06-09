import { z } from 'zod'
import { getDefaults, modelFormSchemas, createFormValidate } from '../../../lib'

const { identifiable, withAttributeValues } = modelFormSchemas

export const dataElementGroupSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        dataElements: z.array(z.object({ id: z.string() })).default([]),
    })

export const initialValues = getDefaults(dataElementGroupSchema)

export const validate = createFormValidate(dataElementGroupSchema)
