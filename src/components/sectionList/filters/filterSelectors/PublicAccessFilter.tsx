import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { formatAccessToString, parseAccessString } from '../../../../lib'
import { ConstantSelectionFilter } from './ConstantSelectionFilter'

// currently we only care about metadata access
// we may want to revist this and potentially rename to "publicMetadataAccess"
// and have another component for data access
const constants = {
    'rw------': 'Public can edit',
    'r-------': 'Public can view',
    '--------': 'Public cannot access',
}

export const PublicAccessFilter = () => {
    const formatFilter = (filter: string | undefined) => {
        if (!filter) {
            return undefined
        }
        const parsedPublicAccessString = parseAccessString(filter)
        if (!parsedPublicAccessString) {
            return undefined
        }
        const withoutDataAccess = formatAccessToString({
            metadata: parsedPublicAccessString.metadata,
            data: { read: false, write: false },
        })
        return withoutDataAccess
    }

    return (
        <ConstantSelectionFilter
            label={i18n.t('Public access')}
            filterKey="publicAccess"
            constants={constants}
            formatFilter={formatFilter}
        />
    )
}
