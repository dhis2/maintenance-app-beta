import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { withDefaultListColumns } = modelFormSchemas

export const IndicatorSchema = withDefaultListColumns.extend({
    code: z.string(),
})
