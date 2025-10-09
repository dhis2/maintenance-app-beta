import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const { identifiable } = modelFormSchemas

export const sectionFormSchema = identifiable.extend({
    description: z.string().optional(),
})

export const initialSectionValues = getDefaults(sectionFormSchema)
