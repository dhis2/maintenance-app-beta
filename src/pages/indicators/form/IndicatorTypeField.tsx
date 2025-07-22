import i18n from '@dhis2/d2-i18n'
import React, { useRef } from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import { ModelSingleSelectFormField } from '../../../components/metadataFormControls/ModelSingleSelect'
import { required } from '../../../lib'

export const IndicatorTypeField = () => {
    const newIndicatorTypeLink = useHref('/indicatorTypes/new')
    const selectRef = useRef<{ refetch: () => void }>({
        refetch: () => {
            throw new Error('Not initialized')
        },
    })

    return (
        <EditableFieldWrapper
            dataTest="formfields-indicatortype"
            onRefresh={() => selectRef.current.refetch()}
            onAddNew={() => window.open(newIndicatorTypeLink, '_blank')}
        >
            <div style={{ width: '400px' }}>
                <ModelSingleSelectFormField
                    name="indicatorType"
                    label={i18n.t('Indicator type')}
                    validate={required}
                    query={{
                        resource: 'indicatorTypes',
                        params: {
                            fields: ['id', 'displayName'],
                            order: 'displayName:iasc',
                        },
                    }}
                />
            </div>
        </EditableFieldWrapper>
    )
}
