import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { Category } from '../../../types/generated'
import { CategoryFormValues } from '../Edit'

/*  Note that this describes what we send to the server, 
    and not what is stored in the form. */
const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const categorySchema = identifiable.merge(withAttributeValues).extend({
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    dataDimensionType: z
        .nativeEnum(Category.dataDimensionType)
        .default(Category.dataDimensionType.DISAGGREGATION),
    dataDimension: z.boolean().default(true),
    categoryOptions: referenceCollection
        .min(1, 'At least one category option is required')
        .default([]),
})

export const initialValues: Partial<CategoryFormValues> =
    getDefaults(categorySchema)

export const validate = createFormValidate(categorySchema)
