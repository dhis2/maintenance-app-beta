import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelTransferField } from '../../../components'

export function LegendSetField() {
    return (
        <ModelTransferField
            dataTest="legendset-transfer"
            name="legendSets"
            query={{
                resource: 'legendSets',
                params: {
                    filter: ['name:ne:default'],
                    fields: ['id', 'displayName'],
                },
            }}
            leftHeader={i18n.t('Available legends')}
            rightHeader={i18n.t('Selected legends')}
            filterPlaceholder={i18n.t('Filter available legends')}
            filterPlaceholderPicked={i18n.t('Filter selected legends')}
            maxSelections={Infinity}
        />
    )
}
