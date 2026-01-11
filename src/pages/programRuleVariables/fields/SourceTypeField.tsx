import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import { PROGRAM_RULE_VARIABLE_SOURCE_TYPE } from '../../../lib'
import { ProgramRuleVariable } from '../../../types/generated'

const {
    DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
    DATAELEMENT_NEWEST_EVENT_PROGRAM,
    DATAELEMENT_CURRENT_EVENT,
    DATAELEMENT_PREVIOUS_EVENT,
    CALCULATED_VALUE,
    TEI_ATTRIBUTE,
} = ProgramRuleVariable.programRuleVariableSourceType

const SOURCE_TYPE_OPTIONS = [
    {
        value: DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
    },
    {
        value: DATAELEMENT_NEWEST_EVENT_PROGRAM,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.DATAELEMENT_NEWEST_EVENT_PROGRAM,
    },
    {
        value: DATAELEMENT_CURRENT_EVENT,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.DATAELEMENT_CURRENT_EVENT,
    },
    {
        value: DATAELEMENT_PREVIOUS_EVENT,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.DATAELEMENT_PREVIOUS_EVENT,
    },
    {
        value: CALCULATED_VALUE,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.CALCULATED_VALUE,
    },
    {
        value: TEI_ATTRIBUTE,
        label: PROGRAM_RULE_VARIABLE_SOURCE_TYPE.TEI_ATTRIBUTE,
    },
]

export function SourceTypeField({ onChange }: { onChange?: () => void }) {
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
                    options={SOURCE_TYPE_OPTIONS}
                    placeholder={i18n.t('Select source type')}
                />
            )}
        />
    )
}
