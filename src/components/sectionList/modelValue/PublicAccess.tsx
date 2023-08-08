import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { Sharing } from '../../../types/generated'

export const isSharing = (value: unknown): value is Sharing => {
    return typeof (value as Sharing).public === 'string'
}

const getPublicAccessString = (value: Sharing): string => {
    const publicAccessString = value.public
    const metadata = publicAccessString.substring(0, 2)
    const data = publicAccessString.substring(2, 4)
    const other = publicAccessString.substring(4)

    if (other === '----' && (data === '--' || data === 'r-' || data === 'rw')) {
        if (metadata === 'rw') {
            return i18n.t('Public can edit')
        } else if (metadata === 'r-') {
            return i18n.t('Public can view')
        } else if (metadata === '--') {
            return i18n.t('Public can not access')
        }
    }
    return 'N/A'
}

export const PublicAccessValue = ({ value }: { value: Sharing }) => {
    return <span>{getPublicAccessString(value)}</span>
}
