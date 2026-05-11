import { z } from 'zod'
import { createFormValidate, modelFormSchemas } from '../../../lib'
import { getDefaults } from '../../../lib/zod/getDefaults'
import {
    AnalyticsTableHook,
    PickWithFieldFilters,
} from '../../../types/generated'
import { fieldFilters } from './fieldFilters'

const { withDefaultListColumns, identifiable } = modelFormSchemas

const analyticsTableHookBaseSchema = z.object({
    sql: z.string(),
    analyticsTableType: z
        .nativeEnum(AnalyticsTableHook.analyticsTableType)
        .optional(),
    phase: z.nativeEnum(AnalyticsTableHook.phase),
    resourceTableType: z
        .nativeEnum(AnalyticsTableHook.resourceTableType)
        .optional(),
})

export const analyticsTableHookFormSchema = identifiable.merge(
    analyticsTableHookBaseSchema
)

export const analyticsTableHookListSchema = analyticsTableHookBaseSchema
    .partial({
        sql: true,
        phase: true,
        analyticsTableType: true,
        resourceTableType: true,
    })
    .merge(withDefaultListColumns)

const validatingAnalyticsTableHookFormSchema =
    analyticsTableHookFormSchema.extend({
        name: z.string().trim().min(1),
        sql: z.string().min(1),
    })

export const initialValues = getDefaults(analyticsTableHookFormSchema)
export const validate = createFormValidate(
    validatingAnalyticsTableHookFormSchema
)

export type AnalyticsTableHookFormValues = PickWithFieldFilters<
    AnalyticsTableHook,
    typeof fieldFilters
>
