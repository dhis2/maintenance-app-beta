import i18n from '@dhis2/d2-i18n'
import React, { useRef } from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'

export function OptionSetField() {
    const newOptionSetLink = useHref('/optionSets/new')
    const optionSetHandle = useRef({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            onRefresh={() => optionSetHandle.current.refetch()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <ModelSingleSelectFormField
                showNoValueOption
                inputWidth="400px"
                dataTest="formfields-optionset"
                name="optionSet"
                label={i18n.t('Option set')}
                query={{
                    resource: 'optionSets',
                    params: {
                        fields: ['id', 'displayName', 'valueType'],
                        order: ['displayName'],
                    },
                }}
                helpText={i18n.t(
                    'Choose a set of predefined options for data entry.'
                )}
            />
        </EditableFieldWrapper>
    )
}
