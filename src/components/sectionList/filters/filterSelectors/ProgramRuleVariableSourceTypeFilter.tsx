import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { getConstantTranslation, useSectionListFilter } from '../../../../lib'
import { ProgramRuleVariable } from '../../../../types/generated/models'
import css from './Filters.module.css'

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

export const ProgramRuleVariableSourceTypeFilter = () => {
    const [filter, setFilter] = useSectionListFilter(
        'programRuleVariableSourceType'
    )
    const [value, setValue] = useState(filter || '')

    const handleChange = ({ selected }: { selected: string }) => {
        setValue(selected)
        setFilter(selected || undefined)
    }

    useEffect(() => {
        if (!filter) {
            setValue('')
        }
    }, [filter])

    // Only pass selected if value exists in options; otherwise @dhis2/ui SingleSelect throws
    const selectedInOptions =
        value && SOURCE_TYPES.some((o) => o.value === value) ? value : undefined

    return (
        <SingleSelect
            className={css.identifiableSelectionFilter}
            selected={selectedInOptions}
            placeholder={i18n.t('Select source type')}
            onChange={handleChange}
            dense
            dataTest="select-source-type"
        >
            <SingleSelectOption
                key="none"
                label={i18n.t('All source types')}
                value=""
            />
            {SOURCE_TYPES.map(({ value, label }) => (
                <SingleSelectOption key={value} label={label} value={value} />
            ))}
        </SingleSelect>
    )
}
