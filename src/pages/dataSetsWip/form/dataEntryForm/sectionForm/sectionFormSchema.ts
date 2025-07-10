import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../../lib'

const { identifiable } = modelFormSchemas

export const sectionFormSchema = identifiable.extend({
    description: z.string().optional(),
    dataElements: z.array(
        z.object({ id: z.string(), displayName: z.string() })
    ),
    indicators: z.array(z.object({ id: z.string(), displayName: z.string() })),
})

export const initialSectionValues = getDefaults(sectionFormSchema)
export type SectionFormValues = typeof initialSectionValues
