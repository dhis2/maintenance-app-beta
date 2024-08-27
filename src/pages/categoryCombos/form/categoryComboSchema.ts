import { z } from 'zod'
import { getDefaults } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryComboFormValues } from '../Edit'
import { CategoryCombo } from './../../../types/generated/models'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */

export const categoryComboSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim(),
    code: z.string().trim().optional(),
    dataDimensionType: z
        .nativeEnum(CategoryCombo.dataDimensionType)
        .default(CategoryCombo.dataDimensionType.DISAGGREGATION),
    dataDimension: z.boolean().default(true),
    categories: z
        .array(z.object({ id: z.string() }))
        .min(1, 'At least one category is required')
        .default([]),
})

export const initialValues: Partial<CategoryComboFormValues> =
    getDefaults(categoryComboSchema)

export const validate = createFormValidate(categoryComboSchema)
