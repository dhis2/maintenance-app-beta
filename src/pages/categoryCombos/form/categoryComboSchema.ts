import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { CategoryCombo } from './../../../types/generated/models'

const { identifiable, withAttributeValues, referenceCollection } =
    modelFormSchemas

export const categoryComboSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        code: z.string().trim().optional().default('hello'),
        dataDimensionType: z
            .nativeEnum(CategoryCombo.dataDimensionType)
            .default(CategoryCombo.dataDimensionType.DISAGGREGATION),
        skipTotal: z.boolean().default(false),
        categories: referenceCollection
            .min(1, i18n.t('At least one category is required'))
            .default([]),
    })

export const initialValues = getDefaults(categoryComboSchema)

export const validate = createFormValidate(categoryComboSchema)
