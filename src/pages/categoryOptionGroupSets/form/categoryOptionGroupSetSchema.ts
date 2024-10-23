import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { CategoryOptionGroupSet } from '../../../types/generated'

const { identifiable, referenceCollection, withAttributeValues } =
    modelFormSchemas

export const categoryOptionGroupSetSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        dataDimensionType: z
            .nativeEnum(CategoryOptionGroupSet.dataDimensionType)
            .default(CategoryOptionGroupSet.dataDimensionType.DISAGGREGATION),
        dataDimension: z.boolean().default(true),
        categoryOptions: referenceCollection
            .min(1, 'At least one category option is required')
            .default([]),
    })

export const initialValues = getDefaults(categoryOptionGroupSetSchema)

export const validate = createFormValidate(categoryOptionGroupSetSchema)
