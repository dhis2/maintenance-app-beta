import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../../../components'

export function DataElementGroupsField() {
    return (
        <ModelTransferField
            dataTest="dataElementGroups-transfer"
            name="dataElementGroups"
            query={{
                resource: 'dataElementGroups',
                params: {
                    fields: ['id', 'displayName'],
                },
            }}
            leftHeader={i18n.t('Available data element groups')}
            rightHeader={i18n.t('Selected data element groups')}
            filterPlaceholder={i18n.t('Filter available data element groups')}
            filterPlaceholderPicked={i18n.t('Filter selected element groups')}
            maxSelections={Infinity}
        />
    )
}
