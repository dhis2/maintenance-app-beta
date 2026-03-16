import { z } from 'zod'
import {
    createFormValidate,
    getDefaultsOld,
    modelFormSchemas,
} from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

const { modelReference, withDefaultListColumns, identifiable } =
    modelFormSchemas

const programRuleVariableBaseSchema = z.object({
    program: modelReference,
    programRuleVariableSourceType: z.nativeEnum(
        ProgramRuleVariable.programRuleVariableSourceType
    ),
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

export const programRuleVariableFormSchema =
    programRuleVariableBaseSchema.merge(identifiable)

export const programRuleVariableListSchema = programRuleVariableBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayName: z.string(),
    })

export const initialValues = getDefaultsOld(programRuleVariableFormSchema)

export const validate = createFormValidate(programRuleVariableFormSchema)
