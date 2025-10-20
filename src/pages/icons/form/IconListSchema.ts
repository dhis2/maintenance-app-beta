import z from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
const { identifiable, withDefaultListColumns } = modelFormSchemas

const IconBaseSchema = z.object({
    key: z.string().trim(),
    description: z.string().trim().optional(),
    keywords: z.array(z.string().trim()).optional(),
    fileResource: z.object({
        id: z.string(),
    }),
})
export const IconListSchema = identifiable
    .merge(IconBaseSchema)
    .merge(withDefaultListColumns)
export const initialValues = getDefaults(IconBaseSchema)
export const validate = createFormValidate(IconBaseSchema)
