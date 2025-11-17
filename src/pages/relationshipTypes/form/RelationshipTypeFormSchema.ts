import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns, withAttributeValues } = modelFormSchemas

const relationshipTypeBaseSchema = z.object({
    fromToName: z.string(),
    toFromName: z.string().optional(),
    displayFromToName: z.string(),
    displayToFromName: z.string(),
    bidirectional: z.boolean().default(false),
    referral: z.boolean().default(false),
})

export const relationshipTypeListSchema = relationshipTypeBaseSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)
