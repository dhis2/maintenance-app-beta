import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React from 'react'

export const OptionsErrorNotice = () => (
    <NoticeBox error>
        {i18n.t('Something went wrong when loading options')}
    </NoticeBox>
)
