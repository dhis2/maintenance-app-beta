import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorSchema = identifiable.extend({
    factor: z.coerce.number().int(),
})

export const initialValues = getDefaults(IndicatorSchema)

export const validate = createFormValidate(IndicatorSchema)
