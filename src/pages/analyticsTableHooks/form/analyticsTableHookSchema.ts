import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { AnalyticsTableHook } from '../../../types/generated'

const { withDefaultListColumns } = modelFormSchemas

const analyticsTableHookBaseSchema = z.object({
    name: z.string(),
    code: z.string().optional(),
    sql: z.string().optional(),
    analyticsTableType: z.nativeEnum(AnalyticsTableHook.analyticsTableType),
    phase: z.nativeEnum(AnalyticsTableHook.phase),
    resourceTableType: z
        .nativeEnum(AnalyticsTableHook.resourceTableType)
        .optional(),
})

export const analyticsTableHookListSchema = analyticsTableHookBaseSchema.merge(
    withDefaultListColumns
)
