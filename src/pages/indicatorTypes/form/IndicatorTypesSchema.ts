import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns } = modelFormSchemas

const IndicatorTypeBaseSchema = z.object({
    factor: z.coerce
        .number({ invalid_type_error: 'Please enter a number' })
        .int(),
})
export const IndicatorTypeFormSchema = identifiable.merge(
    IndicatorTypeBaseSchema
)

export const IndicatorTypeListSchema = IndicatorTypeBaseSchema.merge(
    withDefaultListColumns
)

export const initialValues = getDefaults(IndicatorTypeFormSchema)

export const validate = createFormValidate(IndicatorTypeFormSchema)
