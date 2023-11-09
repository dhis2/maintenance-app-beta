import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import type { ModelSchemas } from '../../../lib'

const requiredMessage = i18n.t('Required')
const max50Message = i18n.t('Cannot be longer than {{number}} character', {
    number: 50,
})

export const createDataElementSchema = (schemas: ModelSchemas) =>
    z.object({
        name: z
            .string()
            .min(1, { message: requiredMessage })
            .max(schemas.dataElement.properties.name.length as number, {
                message: max50Message,
            })
            .trim(),
        shortName: z
            .string()
            .min(1, { message: requiredMessage })
            .max(schemas.dataElement.properties.shortName.length as number, {
                message: max50Message,
            })
            .trim(),
        code: z
            .string()
            .max(schemas.dataElement.properties.code.length as number, {
                message: max50Message,
            })
            .trim()
            .optional(),
        description: z
            .string()
            .max(schemas.dataElement.properties.description.length as number, {
                message: i18n.t(
                    'The value is to long. You can use up to 255 characters'
                ),
            })
            .trim()
            .optional(),
        formName: z
            .string()
            .max(schemas.dataElement.properties.formName.length as number, {
                message: i18n.t(
                    'The value is to long. You can use up to 255 characters'
                ),
            })
            .trim()
            .optional(),
        url: z
            .string()
            .max(schemas.dataElement.properties.url.length as number, {
                message: i18n.t(
                    'The value is to long. You can use up to 255 characters'
                ),
            })
            .trim()
            .optional(),
        fieldMask: z
            .string()
            .max(schemas.dataElement.properties.fieldMask.length as number, {
                message: i18n.t(
                    'The value is to long. You can use up to 255 characters'
                ),
            })
            .trim()
            .optional(),
        style: z.object({
            color: z.string().optional(),
            icon: z.string().optional(),
        }),
        domainType: z.union([z.literal('AGGREGATE'), z.literal('TRACKER')]),
        valueType: z
            .union([
                z.literal('TEXT'),
                z.literal('LONG_TEXT'),
                z.literal('MULTI_TEXT'),
                z.literal('LETTER'),
                z.literal('PHONE_NUMBER'),
                z.literal('EMAIL'),
                z.literal('BOOLEAN'),
                z.literal('TRUE_ONLY'),
                z.literal('DATE'),
                z.literal('DATETIME'),
                z.literal('TIME'),
                z.literal('NUMBER'),
                z.literal('UNIT_INTERVAL'),
                z.literal('PERCENTAGE'),
                z.literal('INTEGER'),
                z.literal('INTEGER_POSITIVE'),
                z.literal('INTEGER_NEGATIVE'),
                z.literal('INTEGER_ZERO_OR_POSITIVE'),
                z.literal('TRACKER_ASSOCIATE'),
                z.literal('USERNAME'),
                z.literal('COORDINATE'),
                z.literal('ORGANISATION_UNIT'),
                z.literal('REFERENCE'),
                z.literal('AGE'),
                z.literal('URL'),
                z.literal('FILE_RESOURCE'),
                z.literal('IMAGE'),
                z.literal('GEOJSON'),
            ])
            .refine((v) => !!v, { message: requiredMessage }),
        aggregationType: z
            .union([
                z.literal('SUM'),
                z.literal('AVERAGE'),
                z.literal('AVERAGE_SUM_ORG_UNIT'),
                z.literal('LAST'),
                z.literal('LAST_AVERAGE_ORG_UNIT'),
                z.literal('LAST_LAST_ORG_UNIT'),
                z.literal('LAST_IN_PERIOD'),
                z.literal('LAST_IN_PERIOD_AVERAGE_ORG_UNIT'),
                z.literal('FIRST'),
                z.literal('FIRST_AVERAGE_ORG_UNIT'),
                z.literal('FIRST_FIRST_ORG_UNIT'),
                z.literal('COUNT'),
                z.literal('STDDEV'),
                z.literal('VARIANCE'),
                z.literal('MIN'),
                z.literal('MAX'),
                z.literal('MIN_SUM_ORG_UNIT'),
                z.literal('MAX_SUM_ORG_UNIT'),
                z.literal('NONE'),
                z.literal('CUSTOM'),
                z.literal('DEFAULT'),
            ])
            .refine((v) => !!v, { message: requiredMessage }),
        categoryCombo: z.object({
            id: z.string().min(1, { message: requiredMessage }),
        }),
        optionSet: z.object({
            id: z.string().optional(),
        }),
        commentOptionSet: z.object({
            id: z.string().optional(),
        }),
        legendSets: z.array(
            z.object({
                id: z.string(),
            })
        ),
        aggregationLevels: z.array(z.number()),
        attributeValues: z.array(
            z.object({
                value: z.string(),
                attribute: z.object({
                    id: z.string(),
                }),
            })
        ),
    })
