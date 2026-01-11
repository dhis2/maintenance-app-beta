import i18n from '@dhis2/d2-i18n'
import { z } from 'zod'
import { createFormValidate, getDefaults, modelFormSchemas } from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

const { modelReference, withDefaultListColumns, identifiable } =
    modelFormSchemas

const NAME_PATTERN = /^[a-zA-Z0-9\s\-._]+$/

const programRuleVariableBaseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, i18n.t('Name is required'))
        .regex(NAME_PATTERN, {
            message: i18n.t(
                'Name can only contain letters, numbers, space, dash, dot and underscore'
            ),
        }),
    program: modelReference.extend({ displayName: z.string() }),
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

export const programRuleVariableFormSchema =
    programRuleVariableBaseSchema.merge(identifiable)

export const programRuleVariableListSchema = programRuleVariableBaseSchema
    .merge(withDefaultListColumns)
    .extend({
        displayName: z.string(),
    })

export const initialValues = getDefaults(programRuleVariableFormSchema)

export const validate = createFormValidate(programRuleVariableFormSchema)
