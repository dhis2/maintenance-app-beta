import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { UserSchema } from '../../../lib/form/modelFormSchemas'

const { identifiable, withDefaultListColumns, referenceCollection } =
    modelFormSchemas

const ProgramIndicatorGroupBaseSchema = z.object({
    code: z.string().optional(),
})
export const ProgramIndicatorGroupFormSchema = identifiable
    .merge(ProgramIndicatorGroupBaseSchema)
    .extend({
        name: z.string(),
        programIndicators: referenceCollection.default([]),
    })

export const ProgramIndicatorGroupListSchema =
    ProgramIndicatorGroupBaseSchema.merge(withDefaultListColumns).extend({
        user: UserSchema,
        favorite: z.boolean(),
        name: z.string(),
    })

export const initialValues = getDefaults(ProgramIndicatorGroupFormSchema)

export const validate = createFormValidate(ProgramIndicatorGroupFormSchema)
