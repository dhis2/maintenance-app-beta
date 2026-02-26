import { z } from 'zod'
import { modelFormSchemas, getDefaultsOld } from '../../../lib'

const { identifiable, withDefaultListColumns, withAttributeValues } =
    modelFormSchemas

export const legendSetBaseSchema = z.object({
    name: z.string().trim(),
    code: z.string().trim().optional(),
    symbolizer: z.string().optional(),
    legends: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                startValue: z.number(),
                endValue: z.number(),
                color: z.string(),
            })
        )
        .optional(),
})

export const legendSetListSchema = identifiable
    .merge(legendSetBaseSchema)
    .merge(withAttributeValues)
    .merge(withDefaultListColumns)

export const initialValues = getDefaultsOld(legendSetBaseSchema)
