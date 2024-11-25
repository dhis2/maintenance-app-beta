import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorSchema = identifiable.extend({
    factor: z.coerce
        .number({ invalid_type_error: 'Please enter a number' })
        .int()
        .min(1, 'Please enter a value above 0')
        .max(
            Number.MAX_SAFE_INTEGER,
            `The number is too large. Please enter a valid integer.`
        ),
})

export const initialValues = getDefaults(IndicatorSchema)

export const validate = createFormValidate(IndicatorSchema)
