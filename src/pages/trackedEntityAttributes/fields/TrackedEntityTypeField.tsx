import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'

export function TrackedEntityTypeField() {
    return (
        <div style={{ width: '400px' }}>
            <ModelSingleSelectFormField
                dataTest="formfields-trackedEntityType"
                name="trackedEntityType"
                label={i18n.t('Tracked entity')}
                query={{
                    resource: 'trackedEntityTypes',
                    params: {
                        fields: ['id', 'displayName'],
                        order: 'displayName:iasc',
                    },
                }}
                clearable
                clearText={i18n.t('<No value>')}
            />
        </div>
    )
}
