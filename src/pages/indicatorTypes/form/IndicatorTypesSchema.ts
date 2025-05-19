import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorTypeSchema = identifiable.extend({
    factor: z.coerce
        .number({ invalid_type_error: 'Please enter a number' })
        .int(),
})

export const initialValues = getDefaults(IndicatorTypeSchema)

export const validate = createFormValidate(IndicatorTypeSchema)
