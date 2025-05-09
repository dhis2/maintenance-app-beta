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

const formTypeSchema = z
    .enum(['DEFAULT', 'SECTION', 'CUSTOM'])
    .default('DEFAULT')
export type FormType = z.infer<typeof formTypeSchema>

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
        dataEntryForm: identifiable.extend({
            htmlCode: z.string().optional(),
            format: z.number().int().optional(),
        }),
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
        formType: formTypeSchema,
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
        sections: z.array(
            identifiable.extend({
                displayName: z.string().optional(),
                description: z.string().optional(),
                dataSet: identifiable,
            })
        ),
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
                    perid: modelReference,
                    openingDate: z.string().optional(),
                    closingDate: z.string().optional(),
                })
            )
            .default([]),
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
