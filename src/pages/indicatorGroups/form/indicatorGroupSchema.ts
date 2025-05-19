import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const indicatorGroupSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        indicators: referenceCollection
            .min(1, 'At least one indicator is required')
            .default([]),
    })

export const initialValues = getDefaults(indicatorGroupSchema)

export const validate = createFormValidate(indicatorGroupSchema)
