import { z } from 'zod'

export const dataElementGroupSetSchema = z
    .object({
        name: z.string().trim(),
        shortName: z.string().trim(),
        code: z.string().trim(),
        description: z.string().trim(),
        dataElements: z.array(z.object({ id: z.string() })),
    })
    .partial()
