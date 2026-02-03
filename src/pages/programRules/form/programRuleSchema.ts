/**
 * Zod schema and validation for program rule form (including nested programRuleActions).
 * programType on program so form values match fieldFilters and we can branch on tracker vs event.
 */
import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'

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
    program: modelReference.extend({
        displayName: z.string(),
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
                templateUid: z.string().optional(),
                access: z.any().optional(),
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
