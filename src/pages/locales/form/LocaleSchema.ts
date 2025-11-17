import { z } from 'zod'
import { getDefaults, createFormValidate } from '../../../lib'

const localeBaseSchema = z.object({
    language: z.string(),
    country: z.string(),
})

export const localeFormSchema = localeBaseSchema

export const initialValues = getDefaults(localeFormSchema)

export const validate = createFormValidate(localeFormSchema)
