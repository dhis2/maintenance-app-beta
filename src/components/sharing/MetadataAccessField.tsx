import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import {
    ParsedAccess,
    ParsedAccessPart,
    formatAccessToString,
    parseAccessString,
} from '../../lib'

const defaultParsedAccess: ParsedAccess = {
    metadata: { read: true, write: false },
    data: { read: false, write: false },
}

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
    const parsed = value
        ? parseAccessString(value) || defaultParsedAccess
        : defaultParsedAccess

    // selected is here is metadata access string only (data will always be --)
    const handleChange = ({ selected }: { selected: string }) => {
        const selectedMetadataAccess = parseAccessString(selected)
            ?.metadata as NonNullable<ParsedAccessPart>

        const accessString = formatAccessToString({
            metadata: selectedMetadataAccess,
            data: parsed.data,
        })

        onChange(accessString)
    }

    const valueWithOnlyMetadata = formatAccessToString({
        metadata: parsed.metadata,
        data: defaultParsedAccess.data,
    })

    return (
        <SingleSelect
            dense
            selected={valueWithOnlyMetadata}
            onChange={handleChange}
            dataTest="metadata-access-select"
        >
            <SingleSelectOption
                key={'edit-and-view'}
                value={'rw------'}
                label={i18n.t('Edit and view')}
            />
            <SingleSelectOption
                key={'view-only'}
                value={'r-------'}
                label={i18n.t('View only')}
            />
        </SingleSelect>
    )
}
