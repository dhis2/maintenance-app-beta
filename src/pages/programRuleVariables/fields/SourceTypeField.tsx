import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { getConstantTranslation } from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

const SOURCE_TYPES = [
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType
                .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE
        ),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_NEWEST_EVENT_PROGRAM,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType
                .DATAELEMENT_NEWEST_EVENT_PROGRAM
        ),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_CURRENT_EVENT,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType
                .DATAELEMENT_CURRENT_EVENT
        ),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_PREVIOUS_EVENT,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType
                .DATAELEMENT_PREVIOUS_EVENT
        ),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .CALCULATED_VALUE,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType.CALCULATED_VALUE
        ),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType.TEI_ATTRIBUTE,
        label: getConstantTranslation(
            ProgramRuleVariable.programRuleVariableSourceType.TEI_ATTRIBUTE
        ),
    },
]
export function SourceTypeField({
    onChange,
}: Readonly<{ onChange?: () => void }>) {
    return (
        <FieldRFF
            name="programRuleVariableSourceType"
            render={({ input, meta }) => (
                <SingleSelectFieldFF
                    input={{
                        ...input,
                        onChange: (value) => {
                            input.onChange(value)
                            onChange?.()
                        },
                    }}
                    meta={meta}
                    inputWidth="400px"
                    label={i18n.t('Source type')}
                    options={SOURCE_TYPES}
                    placeholder={i18n.t('Select source type')}
                />
            )}
        />
    )
}
