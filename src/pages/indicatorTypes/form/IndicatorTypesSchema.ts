import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorSchema = identifiable.extend({
    name: z.string().min(1, 'Name is required'),
    factor: z
        .string()
        .min(1, 'Factor is required')
        .regex(/^\d+(\.\d+)?$/, 'Factor must be a valid number'),
})

export const initialValues = getDefaults(IndicatorSchema)

export const validate = createFormValidate(IndicatorSchema)
