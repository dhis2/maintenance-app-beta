import { z } from 'zod'
import { getDefaultsOld, modelFormSchemas } from '../../../../lib'
const { identifiable, withAttributeValues, style } = modelFormSchemas

export const optionBaseSchema = z.object({
    shortName: z.string().optional(),
})

export const optionSchema = identifiable
    .merge(optionBaseSchema)
    .merge(withAttributeValues)
    .merge(style)

export const initialOptionValues = getDefaultsOld(optionSchema)
