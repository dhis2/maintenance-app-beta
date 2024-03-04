import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'

export const UpdateSharingButton = () => {
    return <Button>{i18n.t('Update sharing')}</Button>
}
