import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { parsePublicAccessString } from '../../../lib'
import { Sharing } from '../../../types/generated'

export const isSharing = (value: unknown): value is Sharing => {
    return typeof (value as Sharing).public === 'string'
}

const getPublicAccessString = (value: Sharing): string => {
    const publicAccess = parsePublicAccessString(value.public)

    if (!publicAccess) {
        throw new Error('Invalid public access string')
    }

    const { metadata } = publicAccess

    if (metadata.write) {
        return i18n.t('Public can edit')
    } else if (metadata.read) {
        return i18n.t('Public can view')
    }

    return i18n.t('Public cannot access')
}

export const PublicAccessValue = ({ value }: { value: Sharing }) => {
    return <span>{getPublicAccessString(value)}</span>
}
