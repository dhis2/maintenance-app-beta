import { z } from 'zod'
import {
    getDefaultsOld,
    createFormValidate,
    modelFormSchemas,
} from '../../../lib'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const { identifiable, referenceCollection, withDefaultListColumns } =
    modelFormSchemas

const indicatorGroupSetBaseSchema = z.object({
    code: z.string().trim().optional(),
})

export const indicatorGroupSetFormSchema = identifiable
    .merge(indicatorGroupSetBaseSchema)
    .extend({
        shortName: z.string().trim(),
        description: z.string().trim().optional(),
        compulsory: z.boolean().optional(),
        indicatorGroups: referenceCollection
            .min(1, 'At least one indicator group is required')
            .default([]),
    })

export const indicatorGroupSetListSchema = indicatorGroupSetBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaultsOld(indicatorGroupSetFormSchema)

export const validate = createFormValidate(indicatorGroupSetFormSchema)
