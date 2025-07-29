import { z } from 'zod'
import { getDefaults, createFormValidate, modelFormSchemas } from '../../../lib'
import { UserSchema } from '../../../lib/form/modelFormSchemas'

const { identifiable, withDefaultListColumns, referenceCollection } =
    modelFormSchemas

const programIndicatorGroupBaseSchema = z.object({
    code: z.string().optional(),
})
export const programIndicatorGroupFormSchema = identifiable
    .merge(programIndicatorGroupBaseSchema)
    .extend({
        name: z.string(),
        programIndicators: referenceCollection.default([]),
    })

export const programIndicatorGroupListSchema = programIndicatorGroupBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        user: UserSchema,
        favorite: z.boolean(),
        name: z.string(),
    })

export const initialValues = getDefaults(programIndicatorGroupFormSchema)

export const validate = createFormValidate(programIndicatorGroupFormSchema)
