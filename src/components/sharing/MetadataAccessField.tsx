import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import {
    PublicAccess,
    formatPublicAccess,
    parsePublicAccessString,
} from '../../lib'

const constants = {
    'rw------': i18n.t('Can edit and view'),
    'r-------': i18n.t('Can view only'),
    '--------': i18n.t('Public cannot access'),
}

const defaultParsedAccess: PublicAccess = {
    metadata: { read: true, write: false },
    data: { read: false, write: false },
}

const OPTIONS = Object.entries(constants).map(([value, label]) => (
    <SingleSelectOption key={value} value={value} label={label} />
))

type MetadataAccessFieldProps = {
    // value is a full access string, with data-access if applicable
    value?: string | undefined
    // selected is full access string, with updated metadata access
    onChange: (selected: string) => void
}

export const MetadataAccessField = ({
    onChange,
    value,
}: MetadataAccessFieldProps) => {
    const parsed = value ? parsePublicAccessString(value) : defaultParsedAccess

    // selected is here is metadata access string only (data will always be --)
    const handleChange = ({ selected }: { selected: string }) => {
        const selectedMetadataAccess = parsePublicAccessString(selected)
            ?.metadata as NonNullable<PublicAccess['metadata']>

        const formatted = formatPublicAccess({
            metadata: selectedMetadataAccess,
            data: parsed?.data || defaultParsedAccess.data,
        })

        onChange(formatted)
    }

    const valueWithOnlyMetadata = formatPublicAccess({
        metadata: parsed?.metadata || defaultParsedAccess.metadata,
        data: defaultParsedAccess.data,
    })

    return (
        <SingleSelect
            dense
            selected={valueWithOnlyMetadata}
            onChange={handleChange}
        >
            <SingleSelectOption
                key={value}
                value={'rw------'}
                label={i18n.t('Can edit and view')}
            />
            <SingleSelectOption
                key={value}
                value={'r-------'}
                label={i18n.t('Can view only')}
            />
        </SingleSelect>
    )
}
