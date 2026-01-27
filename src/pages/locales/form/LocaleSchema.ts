import { z } from 'zod'
import { getDefaults, createFormValidate } from '../../../lib'

const localeBaseSchema = z.object({
    language: z.string(),
    country: z.string().optional(),
    script: z
        .string()
        .length(4, 'Script must be exactly 4 characters')
        .regex(
            /^[A-Z][a-z]{3}$/,
            'Script must be title case (e.g., Latn, Cyrl)'
        )
        .optional(),
})

export const localeFormSchema = localeBaseSchema.refine(
    (data) => {
        // If script is provided, country must also be provided
        if (data.script && !data.country) {
            return false
        }
        return true
    },
    {
        message: 'Country is required when Script is provided',
        path: ['country'], // This will attach the error to the country field
    }
)

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
