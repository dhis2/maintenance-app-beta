import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas

export const IndicatorSchema = identifiable.extend({
    code: z.string(),
})
