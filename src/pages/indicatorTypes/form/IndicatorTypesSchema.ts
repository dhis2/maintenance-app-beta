import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorSchema = identifiable.extend({
    factor: z.coerce
        .number({ invalid_type_error: 'Please enter a number' })
        .int()
        .max(
            Number.MAX_SAFE_INTEGER,
            `The number is too large. Please enter a valid integer.`
        )
        .refine((value) => value !== 0, {
            message: 'Zero is not a valid value for factor',
        }),
})

export const initialValues = getDefaults(IndicatorSchema)

export const validate = createFormValidate(IndicatorSchema)
