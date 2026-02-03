import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'

const PROGRAM_QUERY = {
    resource: 'programs',
    params: {
        fields: ['id', 'displayName', 'programType'],
        paging: false,
    },
}

type ProgramFieldProps = {
    disabled?: boolean
}

export function ProgramField({ disabled = false }: ProgramFieldProps) {
    const programNewHref = useHref('/program/new')
    const refreshPrograms = useRefreshModelSingleSelect(PROGRAM_QUERY)

    const select = (
        <ModelSingleSelectFormField
            required
            inputWidth="400px"
            dataTest="program-field"
            name="program"
            label={i18n.t('Program (required)')}
            query={PROGRAM_QUERY}
            disabled={disabled}
        />
    )

    if (disabled) {
        return select
    }

    return (
        <EditableFieldWrapper
            onRefresh={() => refreshPrograms()}
            onAddNew={() => window.open(programNewHref, '_blank')}
        >
            {select}
        </EditableFieldWrapper>
    )
}
