import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import {
    createFormValidate,
    getDefaults,
    isValidUid,
    modelFormSchemas,
} from '../../../lib'

const { identifiable, withAttributeValues, withDefaultListColumns } =
    modelFormSchemas

const indicatorBaseSchema = z.object({
    code: z.string().trim().optional(),
    shortName: z.string().trim(),
    name: z.string().trim(),
    description: z.string().trim().optional(),
    numerator: z.string().min(1, i18n.t('Numerator is required')),
    denominator: z.string().min(1, i18n.t('Denominator is required')),
    numeratorDescription: z.string().optional(),
    denominatorDescription: z.string().optional(),
    annualized: z.boolean().default(false),
    decimals: z.number().int().lte(5).gte(0).optional(),
    url: z
        .string()
        .trim()
        .url({ message: i18n.t('Must be a valid URL') })
        .optional(),
    aggregateExportCategoryOptionCombo: z.string().optional(),
    aggregateExportAttributeOptionCombo: z.string().optional(),
    indicatorType: z.object({
        id: z.string().refine((val) => isValidUid(val)),
    }),
    legendSets: z.array(z.object({ id: z.string() })),
    style: z.object({
        color: z.string().optional(),
        icon: z.string().optional(),
    }),
    attributeValues: z.array(
        z.object({
            value: z.string().optional(),
            attribute: z.object({
                id: z.string(),
            }),
        })
    ),
})

export const indicatorFormSchema = identifiable
    .merge(indicatorBaseSchema)
    .merge(withAttributeValues)

export const indicatorListSchema = indicatorBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayShortName: z.string(),
    })

export const initialValues = getDefaults(indicatorFormSchema)
export const validate = createFormValidate(indicatorFormSchema)
