import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../../lib'

const { identifiable } = modelFormSchemas

export const sectionFormSchema = identifiable.extend({
    description: z.string().optional(),
    dataElements: z.array(
        z.object({ id: z.string(), displayName: z.string() })
    ),
    indicators: z.array(z.object({ id: z.string(), displayName: z.string() })),
    displayOptions: z
        .string()
        .optional()
        .refine(
            (val) => {
                try {
                    if (val !== undefined) {
                        JSON.parse(val)
                    }
                    return true
                } catch {
                    return false
                }
            },
            { message: 'Invalid JSON string' }
        )
        .default(
            '{"pivotMode":"n/a","pivotedCategory":"GLevLNI9wkl","afterSectionText":"","beforeSectionText":""}'
        ),
})

export const initialSectionValues = getDefaults(sectionFormSchema)
export type SectionFormValues = typeof initialSectionValues
