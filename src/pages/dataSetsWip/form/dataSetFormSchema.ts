import i18n from '@dhis2/d2-i18n'
import { omit } from 'lodash'
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

const formTypeSchema = z
    .enum(['DEFAULT', 'SECTION', 'CUSTOM'])
    .default('DEFAULT')
export type FormType = z.infer<typeof formTypeSchema>

const dataSetBaseSchema = z.object({
    code: z.string().trim().optional(),
    periodType: z
        .nativeEnum(DataSet.periodType)
        .default(DataSet.periodType.MONTHLY),
    formType: z.nativeEnum(DataSet.formType).default(DataSet.formType.DEFAULT),
})

export const sectionFormSchema = identifiable.extend({
    description: z.string().optional(),
    dataElements: z.array(z.object({ id: z.string() })),
    indicators: z.array(z.object({ id: z.string() })),
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
                    dataElement: modelReference.extend({
                        displayName: z.string(),
                    }),
                    categoryCombo: modelReference.optional(),
                    dataSet: modelReference.optional(),
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
        // periodType: z.string().default('Monthly'),
        openFuturePeriods: z
            .number()
            .int({ message: i18n.t('The number should not have decimals') })
            .optional(),
        expiryDays: z.number().optional(),
        // formType: formTypeSchema,
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
        sections: z.array(sectionFormSchema).default([]),
        compulsoryDataElementOperands: z
            .array(
                z.object({
                    dataElement: modelReference.extend({
                        displayName: z.string(),
                    }),
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

export const dataSetListSchema = withDefaultListColumns
    .merge(dataSetBaseSchema)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(dataSetFormSchema)
export const initialSectionValues = getDefaults(sectionFormSchema)

export type DataSetFormValues = typeof initialValues

export const validate = createFormValidate(dataSetFormSchema)

export const dataSetValueFormatter = (values: DataSetFormValues) => {
    const withoutSections = omit(values, 'sections')
    return {
        ...withoutSections,
        displayOptions:
            values.displayOptions && JSON.stringify(values.displayOptions),
    }
}
