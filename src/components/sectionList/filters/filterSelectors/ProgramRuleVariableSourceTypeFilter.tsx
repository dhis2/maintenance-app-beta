import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { useSectionListFilter } from '../../../../lib'
import { ProgramRuleVariable } from '../../../../types/generated/models'
import css from './Filters.module.css'

const SOURCE_TYPES = [
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE,
        label: i18n.t('Data element in newest event in program stage'),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_NEWEST_EVENT_PROGRAM,
        label: i18n.t('Data element in newest event in program'),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_CURRENT_EVENT,
        label: i18n.t('Data element from current event'),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .DATAELEMENT_PREVIOUS_EVENT,
        label: i18n.t('Data element from previous event'),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType
            .CALCULATED_VALUE,
        label: i18n.t('Calculated value'),
    },
    {
        value: ProgramRuleVariable.programRuleVariableSourceType.TEI_ATTRIBUTE,
        label: i18n.t('Tracked entity attribute'),
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

    return (
        <SingleSelect
            className={css.identifiableSelectionFilter}
            selected={value}
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
