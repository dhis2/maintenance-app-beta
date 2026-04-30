import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'
import { SqlView } from '../../../types/generated'

const { withAttributeValues, identifiable, withDefaultListColumns } =
    modelFormSchemas

const sqlViewBaseSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional(),
    cacheStrategy: z
        .nativeEnum(SqlView.cacheStrategy)
        .default(SqlView.cacheStrategy.RESPECT_SYSTEM_SETTING),
    type: z.nativeEnum(SqlView.type),
    sqlQuery: z.string().trim().min(1),
})

export const sqlViewListSchema = sqlViewBaseSchema
    .merge(withAttributeValues)
    .merge(withDefaultListColumns)

export const sqlViewFormSchema = sqlViewBaseSchema
    .merge(identifiable)
    .merge(withAttributeValues)

export const initialValues = getDefaultsOld(sqlViewFormSchema)
export const validate = createFormValidate(sqlViewFormSchema)
