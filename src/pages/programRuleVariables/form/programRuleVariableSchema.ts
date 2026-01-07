import { z } from 'zod'
import { modelFormSchemas } from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

const { modelReference, withDefaultListColumns } = modelFormSchemas

const programRuleVariableBaseSchema = z.object({
    name: z.string(),
    program: modelReference.extend({ displayName: z.string() }).optional(),
    programRuleVariableSourceType: z
        .nativeEnum(ProgramRuleVariable.programRuleVariableSourceType)
        .optional(),
    valueType: z.nativeEnum(ProgramRuleVariable.valueType).optional(),
    dataElement: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
    trackedEntityAttribute: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
    programStage: modelReference
        .extend({ displayName: z.string().optional() })
        .optional(),
    useCodeForOptionSet: z.boolean().optional(),
})

export const programRuleVariableListSchema = programRuleVariableBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayName: z.string(),
    })
