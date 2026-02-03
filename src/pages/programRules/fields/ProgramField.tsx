import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'

type ProgramFieldProps = {
    disabled?: boolean
}

export function ProgramField({ disabled = false }: ProgramFieldProps) {
    return (
        <ModelSingleSelectFormField
            required
            inputWidth="400px"
            dataTest="program-field"
            name="program"
            label={i18n.t('Program (required)')}
            query={{
                resource: 'programs',
                params: {
                    fields: ['id', 'displayName', 'programType'],
                    paging: false,
                },
            }}
            disabled={disabled}
        />
    )
}
