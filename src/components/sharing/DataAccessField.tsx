import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import {
    PublicAccess,
    PublicAccessPart,
    formatPublicAccess,
    parsePublicAccessString,
} from '../../lib'

const defaultParsedAccess: PublicAccess = {
    metadata: { read: false, write: false },
    data: { read: false, write: false },
}

type DataAccessFieldProps = {
    // value is a full access string, with data-access if applicable
    value?: string | undefined
    // selected is full access string, with updated data access
    onChange: (selected: string) => void
}

export const DataAccessField = ({ onChange, value }: DataAccessFieldProps) => {
    const parsed = value
        ? parsePublicAccessString(value) || defaultParsedAccess
        : defaultParsedAccess

    // selected is here is metadata access string only (data will always be --)
    const handleChange = ({ selected }: { selected: string }) => {
        const selectedDataAccess = parsePublicAccessString(selected)
            ?.data as NonNullable<PublicAccessPart>

        const formatted = formatPublicAccess({
            metadata: parsed.metadata,
            data: selectedDataAccess,
        })

        onChange(formatted)
    }

    const valueWithOnlyData = formatPublicAccess({
        metadata: defaultParsedAccess.metadata,
        data: parsed.data,
    })

    return (
        <SingleSelect
            dense
            selected={valueWithOnlyData}
            onChange={handleChange}
        >
            <SingleSelectOption
                key={value}
                value={'--rw----'}
                label={i18n.t('Can edit and capture')}
            />
            <SingleSelectOption
                key={value}
                value={'--r-----'}
                label={i18n.t('View only')}
            />
            <SingleSelectOption
                key={value}
                value={'--------'}
                label={i18n.t('No access')}
            />
        </SingleSelect>
    )
}
