import { z } from 'zod'
import { getDefaults } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { Category } from '../../../types/generated'
import { CategoryFormValues } from '../Edit'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */

export const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().trim(),
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    dataDimensionType: z
        .nativeEnum(Category.dataDimensionType)
        .default(Category.dataDimensionType.DISAGGREGATION),
    dataDimension: z.boolean().default(true),
    categoryOptions: z
        .array(z.object({ id: z.string() }))
        .min(1, 'At least one category option is required')
        .default([]),

    attributeValues: z
        .array(
            z.object({
                value: z.string(),
                attribute: z.object({
                    id: z.string(),
                }),
            })
        )
        .default([]),
})

export const initialValues: Partial<CategoryFormValues> =
    getDefaults(categorySchema)

export const validate = createFormValidate(categorySchema)
