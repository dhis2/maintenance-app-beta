import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { AccessSchema } from '../../../lib/form/modelFormSchemas'

const { modelReference, withDefaultListColumns, identifiable } =
    modelFormSchemas

const programRuleActionReference = z.object({
    id: z.string(),
    displayName: z.string().optional(),
})

const programRuleBaseSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().optional(),
    priority: z.number().optional(),
    condition: z.string().optional(),
    program: z.object({
        id: z.string(),
        displayName: z.string().optional(),
        programType: z.string().optional(),
    }),
    programStage: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
    programRuleActions: z
        .array(
            z.object({
                id: z.string(),
                programRuleActionType: z.string().optional(),
                content: z.string().optional(),
                data: z.string().optional(),
                location: z.string().optional(),
                dataElement: programRuleActionReference.optional(),
                trackedEntityAttribute: programRuleActionReference.optional(),
                programStage: programRuleActionReference.optional(),
                programStageSection: programRuleActionReference.optional(),
                option: programRuleActionReference.optional(),
                optionGroup: programRuleActionReference.optional(),
                templateUid: programRuleActionReference.optional(),
                priority: z.number().optional(),
                access: AccessSchema.partial().optional(),
                deleted: z.boolean().optional(),
            })
        )
        .default([]),
})

export const programRuleListSchema = programRuleBaseSchema.merge(
    withDefaultListColumns
)

export const programRuleFormSchema = programRuleBaseSchema.merge(identifiable)

export const initialValues = getDefaults(programRuleFormSchema)
export const validate = createFormValidate(programRuleFormSchema)
