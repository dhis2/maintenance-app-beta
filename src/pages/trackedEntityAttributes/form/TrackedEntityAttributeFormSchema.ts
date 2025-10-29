import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns, withAttributeValues, modelReference } =
    modelFormSchemas

const trackedEntityAttributeBaseSchema = z.object({
    name: z.string().trim(),
    shortName: z.string().trim(),
    code: z.string().trim().optional(),
    description: z.string().trim().optional(),
    formName: z.string().trim().optional(),
    style: z
        .object({
            color: z.string().optional(),
            icon: z.string().optional(),
        })
        .default({}),
    valueType: z.string().trim(),
    aggregationType: z.string().trim().optional(),
    optionSet: modelReference.optional(),
    unique: z.boolean().optional(),
    displayInListNoProgram: z.boolean().optional(),
    trigramIndexable: z.boolean().optional(),
    attributeValues: z
        .array(
            z.object({
                value: z.string(),
                attribute: modelReference,
            })
        )
        .default([]),
})

export const trackedEntityAttributeListSchema = trackedEntityAttributeBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
    .extend({
        displayShortName: z.string(),
    })
