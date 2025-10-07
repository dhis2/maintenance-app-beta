import { z } from 'zod'
import { modelFormSchemas, getDefaults } from '../../../lib'

const { withDefaultListColumns, withAttributeValues } = modelFormSchemas

const analyticsTableHookSchema = z.object({
    name: z.string().trim(),
    displayName: z.string().trim(),
    sql: z.string().trim(),
    phase: z.enum(['RESOURCE_TABLE_POPULATED', 'ANALYTICS_TABLE_POPULATED']),
    analyticsTableType: z.string(),
    resourceTableType: z.string().trim(),
})

export const analyticsTableHookListSchema = analyticsTableHookSchema
    .merge(withDefaultListColumns)
    .merge(withAttributeValues)

export const initialValues = getDefaults(analyticsTableHookSchema)
