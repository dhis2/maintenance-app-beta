import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'
import {
    AnalyticsTableHook,
    PickWithFieldFilters,
} from '../../../types/generated'
import { fieldFilters } from './fieldFilters'

const { withDefaultListColumns, identifiable } = modelFormSchemas

const analyticsTableHookBaseSchema = z.object({
    name: z.string(),
    code: z.string().optional(),
    sql: z.string(),
    analyticsTableType: z.nativeEnum(AnalyticsTableHook.analyticsTableType),
    phase: z.nativeEnum(AnalyticsTableHook.phase),
    resourceTableType: z
        .nativeEnum(AnalyticsTableHook.resourceTableType)
        .optional(),
})

export const analyticsTableHookFormSchema = identifiable
    .merge(analyticsTableHookBaseSchema)
    .superRefine((value, context) => {
        if (
            value.phase === AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED &&
            !value.resourceTableType
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['resourceTableType'],
                message: 'Required',
            })
        }
        if (
            value.phase ===
                AnalyticsTableHook.phase.ANALYTICS_TABLE_POPULATED &&
            !value.analyticsTableType
        ) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['analyticsTableType'],
                message: 'Required',
            })
        }
    })

export const analyticsTableHookListSchema = analyticsTableHookBaseSchema
    .partial({
        sql: true,
        analyticsTableType: true,
        resourceTableType: true,
    })
    .merge(withDefaultListColumns)

export const initialValues = getDefaultsOld(analyticsTableHookFormSchema)
export const validate = createFormValidate(analyticsTableHookFormSchema)

export type AnalyticsTableHookFormValues = PickWithFieldFilters<
    AnalyticsTableHook,
    typeof fieldFilters
>
