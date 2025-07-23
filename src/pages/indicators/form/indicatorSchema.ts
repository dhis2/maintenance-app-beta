import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns } = modelFormSchemas

export const indicatorSchema = withDefaultListColumns.extend({
    code: z.string(),
})
