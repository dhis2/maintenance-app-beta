import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryComboFormValues } from '../Edit'
import { CategoryCombo } from './../../../types/generated/models'

const { identifiable, withAttributeValues, referenceCollection } =
    modelFormSchemas

export const categoryComboSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional(),
        dataDimensionType: z
            .nativeEnum(CategoryCombo.dataDimensionType)
            .default(CategoryCombo.dataDimensionType.DISAGGREGATION),
        skipTotal: z.boolean().default(false),
        categories: referenceCollection
            .min(1, 'At least one category is required')
            .default([]),
    })

export const initialValues: Partial<CategoryComboFormValues> =
    getDefaults(categoryComboSchema)

export const validate = createFormValidate(categoryComboSchema)
