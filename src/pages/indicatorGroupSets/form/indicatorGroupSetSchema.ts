import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const { identifiable, referenceCollection } = modelFormSchemas

export const indicatorGroupSetSchema = identifiable.extend({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    compulsory: z.boolean().optional(),
    indicatorGroups: referenceCollection
        .min(1, 'At least one indicator group is required')
        .default([]),
})

export const initialValues = getDefaults(indicatorGroupSetSchema)

export const validate = createFormValidate(indicatorGroupSetSchema)
