import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../../../components'

export function DataElementsField() {
    return (
        <ModelTransferField
            dataTest="dataElements-transfer"
            name="dataElements"
            query={{
                resource: 'dataElements',
                params: {
                    fields: ['id', 'displayName'],
                },
            }}
            leftHeader={i18n.t('Available data elements')}
            rightHeader={i18n.t('Selected data elements')}
            filterPlaceholder={i18n.t('Filter available data elements')}
            filterPlaceholderPicked={i18n.t('Filter selected elements')}
            maxSelections={Infinity}
        />
    )
}
