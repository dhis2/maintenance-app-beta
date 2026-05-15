import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { SqlView } from '../../../types/generated'

const { withDefaultListColumns } = modelFormSchemas

const sqlViewBaseSchema = z.object({
    type: z.nativeEnum(SqlView.type),
    cacheStrategy: z.nativeEnum(SqlView.cacheStrategy),
    sqlQuery: z.string(),
})
export const sqlViewListSchema = sqlViewBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        code: z.string().optional(),
    })
