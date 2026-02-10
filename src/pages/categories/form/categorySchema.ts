import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { Category } from '../../../types/generated'

/*  Note that this describes what we send to the server,
    and not what is stored in the form. */
const {
    identifiable,
    referenceCollection,
    withAttributeValues,
    withDefaultListColumns,
} = modelFormSchemas

const categoryBaseSchema = z.object({
    dataDimensionType: z
        .nativeEnum(Category.dataDimensionType)
        .default(Category.dataDimensionType.DISAGGREGATION),
})

export const categoryFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(categoryBaseSchema)
    .extend({
        shortName: z.string().trim(),
        description: z.string().trim().optional(),
        dataDimension: z.boolean().default(true),
        categoryOptions: referenceCollection.default([]),
    })

export const categoryListSchema = categoryBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(categoryFormSchema)

const validatingCategoryFormSchema = categoryFormSchema.extend({
    categoryOptions: referenceCollection
        .min(1, 'At least one category option is required')
        .default([]),
})
export const validate = createFormValidate(validatingCategoryFormSchema)
