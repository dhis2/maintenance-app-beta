import i18n from '@dhis2/d2-i18n'
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
    analyticsTableType: z
        .nativeEnum(AnalyticsTableHook.analyticsTableType)
        .optional(),
    phase: z.nativeEnum(AnalyticsTableHook.phase),
    resourceTableType: z
        .nativeEnum(AnalyticsTableHook.resourceTableType)
        .optional(),
})

export const analyticsTableHookFormSchema = identifiable
    .merge(analyticsTableHookBaseSchema)
    .refine(
        (data) =>
            (data.phase === AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED &&
                !!data.resourceTableType) ||
            (data.phase ===
                AnalyticsTableHook.phase.ANALYTICS_TABLE_POPULATED &&
                !!data.analyticsTableType),
        (data) => ({
            message: i18n.t('Required'),
            path: [
                data.phase === AnalyticsTableHook.phase.RESOURCE_TABLE_POPULATED
                    ? 'resourceTableType'
                    : 'analyticsTableType',
            ],
        })
    )

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
