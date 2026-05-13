import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../../../components'

export function IndicatorGroupsField() {
    return (
        <ModelTransferField
            dataTest="formfields-indicatorGroups"
            name="indicatorGroups"
            query={{
                resource: 'indicatorGroups',
                params: {
                    fields: ['id', 'displayName'],
                },
            }}
            leftHeader={i18n.t('Available groups')}
            rightHeader={i18n.t('Selected groups')}
            filterPlaceholder={i18n.t('Filter available groups')}
            filterPlaceholderPicked={i18n.t('Filter selected groups')}
        />
    )
}
