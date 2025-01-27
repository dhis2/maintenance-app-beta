import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    DEFAULT_CATEGORY_COMBO,
    getDefaults,
    modelFormSchemas,
} from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'

const {
    withAttributeValues,
    identifiable,
    style,
    referenceCollection,
    modelReference,
} = modelFormSchemas

export const dataSetFormSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        id: z.string().optional(),
        code: z.string().trim().optional(),
        description: z.string().trim().max(2000).optional(),
        style: style.optional(),
        dataSetElements: z
            .array(
                z.object({
                    dataElement: modelReference,
                    categoryCombo: modelReference.optional(),
                })
            )
            .default([]),
        categoryCombo: z
            .object({ id: z.string(), displayName: z.string() })
            .default({ ...DEFAULT_CATEGORY_COMBO }),
        indicators: referenceCollection.default([]),
        periodType: z.string().default('Monthly'),
        openFuturePeriods: z
            .number()
            .int({ message: i18n.t('The number should not have decimals') }),
        expiryDays: z.number(),
        openPeriodsAfterCoEndDate: z
            .number()
            .int({ message: i18n.t('The number should not have decimals') })
            .optional(),
    })

export const initialValues = getDefaults(dataSetFormSchema)

export type DataSetFormValues = typeof initialValues

export const validate = createFormValidate(dataSetFormSchema)
