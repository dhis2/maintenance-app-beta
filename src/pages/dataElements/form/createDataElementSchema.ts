import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import type { ModelSchemas } from '../../../lib'
import { DataElement } from '../../../types/generated'

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
            .nativeEnum(DataElement.valueType)
            .refine((v) => !!v, { message: requiredMessage }),
        aggregationType: z
            .nativeEnum(DataElement.aggregationType)
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
