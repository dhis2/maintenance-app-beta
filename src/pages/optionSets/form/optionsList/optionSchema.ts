import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'
const { identifiable, withAttributeValues, style, withDefaultListColumns } =
    modelFormSchemas

export const optionBaseSchema = z.object({
    shortName: z.string().optional(),
})

export const optionSchema = identifiable
    .merge(optionBaseSchema)
    .merge(withAttributeValues)
    .merge(style)

export const initialOptionValues = getDefaults(optionSchema)
