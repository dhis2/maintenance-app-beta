import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    DEFAULT_CATEGORY_COMBO,
    getDefaults,
    modelFormSchemas,
} from '../../../lib'
import { ModelWithAttributeValues } from '../../../lib/form/createJsonPatchOperations'
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
            .int({ message: i18n.t('The number should not have decimals') })
            .optional(),
        expiryDays: z.number().optional(),
        formType: z.enum(['DEFAULT', 'SECTION', 'CUSTOM']).default('DEFAULT'),
        displayOptions: z
            .string()
            .optional()
            .refine(
                (val) => {
                    try {
                        if (val !== undefined) {
                            JSON.parse(val)
                        }
                        return true
                    } catch {
                        return false
                    }
                },
                { message: 'Invalid JSON string' }
            )
            .default('{}'),
        openPeriodsAfterCoEndDate: z
            .number()
            .int({ message: i18n.t('The number should not have decimals') })
            .optional(),
        skipOffline: z.boolean().optional(),
        dataElementDecoration: z.boolean().optional(),
        mobile: z.boolean().optional(),
        legendSets: referenceCollection.default([]),
    })

export const initialValues = getDefaults(dataSetFormSchema)

export type DataSetFormValues = typeof initialValues

export const validate = createFormValidate(dataSetFormSchema)

export const dataSetValueFormatter = (values: DataSetFormValues) => {
    return {
        ...values,
        displayOptions:
            values.displayOptions && JSON.stringify(values.displayOptions),
    }
}
