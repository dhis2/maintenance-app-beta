import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryCombo } from './../../../types/generated/models'

const { identifiable, withAttributeValues, modelReference } = modelFormSchemas

const GENERATED_COC_LIMIT = 50000

export const categoryComboSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional(),
        dataDimensionType: z
            .nativeEnum(CategoryCombo.dataDimensionType)
            .default(CategoryCombo.dataDimensionType.DISAGGREGATION),
        skipTotal: z.boolean().default(false),
        categories: z
            .array(
                modelReference.extend({
                    displayName: z.string(),
                    categoryOptionsSize: z.number(),
                })
            )
            .refine(
                (categories) => {
                    const generatedCocsCount = categories.reduce(
                        (acc, category) => acc * category.categoryOptionsSize,
                        1
                    )
                    return generatedCocsCount < GENERATED_COC_LIMIT
                },
                {
                    message: i18n.t(
                        'The number of generated category option combinations exceeds the limit of {{limit}}',
                        { limit: GENERATED_COC_LIMIT }
                    ),
                }
            )
            .default([]),
    })

export const initialValues = getDefaults(categoryComboSchema)

export type CategoryComboFormValues = typeof initialValues

export const validate = createFormValidate(categoryComboSchema)
