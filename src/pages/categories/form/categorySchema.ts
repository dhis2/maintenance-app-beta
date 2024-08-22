import { z } from 'zod'
import { Category, DataElement } from '../../../types/generated'

export const categorySchema = z
    .object({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim(),
        description: z.string().trim(),
        dataDimensionType: z.nativeEnum(Category.dataDimensionType),
        dataDimension: z.boolean().default(true),
        categoryOptions: z.array(z.object({ id: z.string() })),
    })
    .partial()

const defaultValues = categorySchema.parse({})
