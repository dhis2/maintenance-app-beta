import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ConstantSelectionFilter } from './ConstantSelectionFilter'

const constants = {
    'rw------': 'Public can edit',
    'r-------': 'Public can view',
    '--------': 'Public cannot access',
}

export const PublicAccessFilter = () => {
    return (
        <ConstantSelectionFilter
            label={i18n.t('Public access')}
            filterKey="publicAccess"
            constants={constants}
        />
    )
}
