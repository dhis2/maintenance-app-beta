import { z } from 'zod'
import { Category } from '../../../types/generated'
import { getDefaults } from '../../../lib'

export const categorySchema = z.object({
    name: z.string().trim().min(5),
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    dataDimensionType: z
        .nativeEnum(Category.dataDimensionType)
        .default(Category.dataDimensionType.DISAGGREGATION),
    dataDimension: z.boolean().default(true),
    categoryOptions: z.array(z.object({ id: z.string() })).default([]),
    attributeValues: z.array(
        z.object({
            value: z.string().optional(),
            attribute: z.object({
                id: z.string(),
            }),
        })
    ),
})

export const initialValues = getDefaults(categorySchema)
