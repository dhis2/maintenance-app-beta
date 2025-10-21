import { z } from 'zod'
import { getDefaults, modelFormSchemas } from '../../../../lib'

const { identifiable, referenceCollection } = modelFormSchemas

const renderTypeSchema = z.enum(['LISTING', 'SEQUENTIAL', 'MATRIX'])
export const sectionFormSchema = identifiable.extend({
    description: z.string().optional(),
    renderType: z.object({
        MOBILE: z.object({ type: renderTypeSchema.default('LISTING') }),
        DESKTOP: z.object({ type: renderTypeSchema.default('LISTING') }),
    }),
    trackedEntityAttributes: referenceCollection,
})

export const initialSectionValues = getDefaults(sectionFormSchema)
