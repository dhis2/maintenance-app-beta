import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'

export function OptionSetField() {
    return (
        <div style={{ width: '400px' }}>
            <ModelSingleSelectFormField
                dataTest="formfields-optionSet"
                name="optionSet"
                label={i18n.t('Option set')}
                helpText={i18n.t(
                    'Limit data entry to a predefined list of options. Overrides value type selection to match the option set.'
                )}
                query={{
                    resource: 'optionSets',
                    params: {
                        fields: ['id', 'displayName', 'valueType'],
                        order: 'displayName:iasc',
                    },
                }}
                clearable
                clearText={i18n.t('Clear')}
            />
        </div>
    )
}
