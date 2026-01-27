import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { InputFieldFF } from '@dhis2/ui'
import React, { useCallback, useMemo } from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { PROGRAM_RULE_VARIABLE_CONSTANTS } from '../../../constants/programRuleVariable'
import { required } from '../../../lib/form'
import {
    composeAsyncValidators,
    FormFieldValidator,
} from '../../../lib/form/composeAsyncValidators'

const { NAME_PATTERN, FORBIDDEN_WORDS } = PROGRAM_RULE_VARIABLE_CONSTANTS

type ProgramRuleVariableFormValues = {
    name?: string
    program?: { id: string }
    id?: string
}

const containsForbiddenWord = (value: string): boolean => {
    const words = value.toLowerCase().match(/\b\w+\b/g) || []
    const forbiddenWordsLower = new Set(
        FORBIDDEN_WORDS.map((word) => word.toLowerCase())
    )
    return words.some((word) => forbiddenWordsLower.has(word))
}

const namePatternValidator: FormFieldValidator<string> = (value) => {
    if (!value) {
        return undefined
    }
    if (!NAME_PATTERN.test(value)) {
        return i18n.t(
            'Name can only contain letters, numbers, space, dash, dot and underscore'
        )
    }
    return undefined
}

const forbiddenWordsValidator: FormFieldValidator<string> = (value) => {
    if (!value) {
        return undefined
    }
    if (containsForbiddenWord(value)) {
        return i18n.t(
            'Program rule variable name contains forbidden words: and, or, not.'
        )
    }
    return undefined
}

const DUPLICATE_NAME_WITHIN_PROGRAM_MESSAGE = i18n.t(
    'A variable with this name already exists in this program.'
)

export function ProgramRuleVariableNameField() {
    const engine = useDataEngine()

    const duplicateNameWithinProgramValidator = useCallback<
        FormFieldValidator<string, ProgramRuleVariableFormValues>
    >(
        async (value, formValues) => {
            const programId = formValues?.program?.id
            const currentId = formValues?.id
            if (!value?.trim() || !programId) {
                return undefined
            }
            const filter = [
                `program.id:eq:${programId}`,
                `name:ieq:${value.trim()}`,
            ]
            if (currentId) {
                filter.push(`id:ne:${currentId}`)
            }
            const data = (await engine.query({
                programRuleVariables: {
                    resource: 'programRuleVariables',
                    params: {
                        filter,
                        pageSize: 1,
                        fields: 'id',
                    },
                },
            })) as {
                programRuleVariables: {
                    pager: { total: number }
                }
            }
            const total = data?.programRuleVariables?.pager?.total ?? 0
            if (total > 0) {
                return DUPLICATE_NAME_WITHIN_PROGRAM_MESSAGE
            }
            return undefined
        },
        [engine]
    )

    const validator = useMemo(
        () =>
            composeAsyncValidators<string, ProgramRuleVariableFormValues>([
                required as FormFieldValidator<
                    string,
                    ProgramRuleVariableFormValues
                >,
                forbiddenWordsValidator,
                namePatternValidator,
                duplicateNameWithinProgramValidator,
            ]),
        [duplicateNameWithinProgramValidator]
    )

    return (
        <FieldRFF name="name" validate={validator}>
            {({ input, meta }) => (
                <InputFieldFF
                    input={input}
                    meta={meta}
                    loading={meta.validating}
                    validateFields={[]}
                    dataTest="formfields-name"
                    required
                    inputWidth="400px"
                    label={i18n.t('{{fieldLabel}} (required)', {
                        fieldLabel: i18n.t('Name'),
                    })}
                    helpText={i18n.t(
                        'Variable name cannot contain the words: and, or, not.'
                    )}
                />
            )}
        </FieldRFF>
    )
}
