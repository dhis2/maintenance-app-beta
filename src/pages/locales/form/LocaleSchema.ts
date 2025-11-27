import { z } from 'zod'
import { getDefaults, createFormValidate } from '../../../lib'

const localeBaseSchema = z.object({
    language: z.string(),
    country: z.string(),
})

export const localeFormSchema = localeBaseSchema
export const localeListSchema = localeBaseSchema.extend({
    lastUpdated: z.coerce.date(),
    created: z.coerce.date(),
    locale: z.string().min(2).max(2),
    id: z.string(),
    displayName: z.string(),
    name: z.string(),
})

export const initialValues = getDefaults(localeFormSchema)

export const validate = createFormValidate(localeFormSchema)
