import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable, withDefaultListColumns } = modelFormSchemas

const indicatorTypeBaseSchema = z.object({
    factor: z.coerce
        .number({ invalid_type_error: 'Please enter a number' })
        .int(),
})
export const indicatorTypeFormSchema = identifiable.merge(
    indicatorTypeBaseSchema
)

export const indicatorTypeListSchema = indicatorTypeBaseSchema
    .merge(withDefaultListColumns)
    .extend({ name: z.string() })

export const initialValues = getDefaults(indicatorTypeFormSchema)

export const validate = createFormValidate(indicatorTypeFormSchema)
