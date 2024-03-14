import { z } from 'zod'
import { DataElement } from '../../../types/generated'

export const dataElementSchema = z
    .object({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim(),
        description: z.string().trim(),
        formName: z.string().trim(),
        url: z.string().trim(),
        fieldMask: z.string().trim(),
        style: z.object({
            color: z.string().optional(),
            icon: z.string().optional(),
        }),
        domainType: z.union([z.literal('AGGREGATE'), z.literal('TRACKER')]),
        valueType: z.string(),
        aggregationType: z.string(),
        optionSet: z.object({ id: z.string() }),
        commentOptionSet: z.object({ id: z.string() }),
        legendSets: z.array(z.object({ id: z.string() })),
        aggregationLevels: z.array(z.number()),
        attributeValues: z.array(
            z.object({
                value: z.string().optional(),
                attribute: z.object({
                    id: z.string(),
                }),
            })
        ),
    })
    .partial()
