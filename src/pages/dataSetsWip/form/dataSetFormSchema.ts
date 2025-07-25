import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    DEFAULT_CATEGORY_COMBO,
    getDefaults,
    modelFormSchemas,
} from '../../../lib'
import { createFormValidate } from '../../../lib/form/validate'
import { DataSet } from '../../../types/generated'

const {
    withAttributeValues,
    identifiable,
    style,
    referenceCollection,
    modelReference,
    withDefaultListColumns,
} = modelFormSchemas

const dataSetBaseSchema = z.object({
    code: z.string().trim().optional(),
    periodType: z
        .nativeEnum(DataSet.periodType)
        .default(DataSet.periodType.MONTHLY),
    formType: z.nativeEnum(DataSet.formType).default(DataSet.formType.DEFAULT),
})
export const dataSetFormSchema = identifiable
    .merge(withAttributeValues)
    .merge(dataSetBaseSchema)
    .extend({
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
        openFuturePeriods: z
            .number()
            .int({ message: i18n.t('The number should not have decimals') })
            .optional(),
        expiryDays: z.number().optional(),
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
        validCompleteOnly: z.boolean().default(false),
        noValueRequiresComment: z.boolean().default(false),
        fieldCombinationRequired: z.boolean().default(false),
        compulsoryFieldsCompleteOnly: z.boolean().default(false),
        workflow: z.object({ id: z.string() }).optional(),
        timelyDays: z.number().optional().default(15),
        compulsoryDataElementOperands: z
            .array(
                z.object({
                    dataElement: modelReference,
                    categoryOptionCombo: modelReference,
                })
            )
            .optional(),
        dataInputPeriods: z
            .array(
                z.object({
                    period: modelReference,
                    openingDate: z.string().optional(),
                    closingDate: z.string().optional(),
                })
            )
            .default([]),
    })

export const dataSetListSchema = withDefaultListColumns
    .merge(dataSetBaseSchema)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(dataSetFormSchema)

export type DataSetFormValues = typeof initialValues

export const validate = createFormValidate(dataSetFormSchema)

export const dataSetValueFormatter = <
    // the reason for the generic is that the type between Edit (with Id) and create (without Id) is different
    TValues extends Partial<DataSetFormValues>
>(
    values: TValues
) => {
    return {
        ...values,
        displayOptions:
            values.displayOptions && JSON.stringify(values.displayOptions),
    }
}
