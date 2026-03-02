import { z } from 'zod'
import { getDefaultsOld, modelFormSchemas } from '../../../../../lib'

const { identifiable } = modelFormSchemas

const renderTypeSchema = z.enum(['LISTING', 'SEQUENTIAL', 'MATRIX'])
export const stageSectionFormSchema = identifiable.extend({
    description: z.string().optional(),
    renderType: z.object({
        MOBILE: z.object({ type: renderTypeSchema.default('LISTING') }),
        DESKTOP: z.object({ type: renderTypeSchema.default('LISTING') }),
    }),
})

export const initialStageSectionValues = getDefaultsOld(stageSectionFormSchema)
