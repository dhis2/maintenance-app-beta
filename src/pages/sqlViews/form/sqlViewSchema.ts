import { z } from 'zod'
import {
    getDefaultsOld,
    modelFormSchemas,
    createFormValidate,
} from '../../../lib'
import { SqlView } from '../../../types/generated'

const { identifiable, withAttributeValues, withDefaultListColumns } =
    modelFormSchemas

const sqlViewBaseSchema = z
    .object({
        type: z.nativeEnum(SqlView.type).default(SqlView.type.VIEW),
        cacheStrategy: z
            .nativeEnum(SqlView.cacheStrategy)
            .default(SqlView.cacheStrategy.RESPECT_SYSTEM_SETTING),
        sqlQuery: z.string(),
        description: z.string().trim().optional(),
    })
    .merge(identifiable)

export const sqlViewListSchema = sqlViewBaseSchema.merge(withDefaultListColumns)

export const sqlViewFormSchema = sqlViewBaseSchema.merge(withAttributeValues)

export const initialValues = getDefaultsOld(sqlViewFormSchema)

export const validate = createFormValidate(sqlViewFormSchema)
