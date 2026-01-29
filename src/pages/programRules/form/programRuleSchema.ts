import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'

const { modelReference, withDefaultListColumns, identifiable } =
    modelFormSchemas

const programRuleBaseSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().optional(),
    priority: z.number().optional(),
    condition: z.string().optional(),
    program: modelReference.extend({ displayName: z.string() }),
    programStage: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
})

export const programRuleListSchema = programRuleBaseSchema.merge(
    withDefaultListColumns
)

export const programRuleFormSchema = programRuleBaseSchema.merge(identifiable)

export const initialValues = getDefaults(programRuleFormSchema)
export const validate = createFormValidate(programRuleFormSchema)
