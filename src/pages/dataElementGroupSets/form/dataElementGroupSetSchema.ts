import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'

const { identifiable } = modelFormSchemas
export const dataElementGroupSetSchema = identifiable.merge(
    z
        .object({
            name: z.string().trim(),
            shortName: z.string().trim(),
            code: z.string().trim(),
            description: z.string().trim(),
            dataElements: z.array(z.object({ id: z.string() })),
        })
        .partial()
)
