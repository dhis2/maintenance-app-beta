import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
} from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const {
    identifiable,
    referenceCollection,
    withAttributeValues,
    withDefaultListColumns,
} = modelFormSchemas

const indicatorGroupBaseSchema = z.object({
    code: z.string().trim().optional(),
})

export const indicatorGroupFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(indicatorGroupBaseSchema)
    .extend({
        description: z.string().trim().optional(),
        indicators: referenceCollection
            .min(1, 'At least one indicator is required')
            .default([]),
    })

export const indicatorGroupListSchema = indicatorGroupBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaultsOld(indicatorGroupFormSchema)

export const validate = createFormValidate(indicatorGroupFormSchema)
