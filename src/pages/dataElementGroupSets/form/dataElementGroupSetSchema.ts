import { z } from 'zod'
import {
    modelFormSchemas,
    getDefaultsOld,
    createFormValidate,
} from '../../../lib'

const { identifiable, withAttributeValues } = modelFormSchemas
export const dataElementGroupSetSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        dataElements: z.array(z.object({ id: z.string() })).default([]),
        compulsory: z.boolean().default(false),
        dataDimension: z.boolean().default(false),
        dataElementGroups: z.array(z.object({ id: z.string() })).default([]),
    })

export const initialValues = getDefaultsOld(dataElementGroupSetSchema)

export const validate = createFormValidate(dataElementGroupSetSchema)
