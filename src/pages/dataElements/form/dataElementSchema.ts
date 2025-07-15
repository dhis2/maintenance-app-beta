import { z } from 'zod'
import {
    createFormValidate,
    DEFAULT_CATEGORY_COMBO,
    getDefaults,
    modelFormSchemas,
} from '../../../lib'

const { identifiable, withAttributeValues } = modelFormSchemas

export const dataElementSchema = identifiable
    .merge(withAttributeValues)
    .extend({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim().optional(),
        description: z.string().trim().optional(),
        formName: z.string().trim().optional(),
        url: z.string().trim().optional(),
        fieldMask: z.string().trim().optional(),
        style: z
            .object({
                color: z.string().optional(),
                icon: z.string().optional(),
            })
            .default({}),
        domainType: z
            .union([z.literal('AGGREGATE'), z.literal('TRACKER')])
            .default('AGGREGATE'),
        valueType: z.string().default('TEXT'),
        aggregationType: z.string().optional().default('NONE'),
        categoryCombo: z
            .object({ id: z.string() })
            .default(DEFAULT_CATEGORY_COMBO),
        optionSet: z.object({ id: z.string() }).default({ id: '' }),
        commentOptionSet: z.object({ id: z.string() }).default({ id: '' }),
        legendSets: z.array(z.object({ id: z.string() })).default([]),
        aggregationLevels: z.array(z.number()).default([]),
        attributeValues: z
            .array(
                z.object({
                    value: z.string(),
                    attribute: z.object({
                        id: z.string(),
                    }),
                })
            )
            .default([]),
        zeroIsSignificant: z.boolean().default(false),
    })

export const initialValues = getDefaults(dataElementSchema)

export type DataElementFormValues = typeof initialValues

export const validate = createFormValidate(dataElementSchema)

export const dataElementValueFormatter = (values: DataElementFormValues) => ({
    ...values,
    attributeValues: values.attributeValues.filter(({ value }) => !!value),
    categoryCombo: values.categoryCombo.id ? values.categoryCombo : undefined,
    commentOptionSet: values.commentOptionSet?.id
        ? values.commentOptionSet
        : undefined,
    optionSet: values.optionSet?.id ? values.optionSet : undefined,
})
