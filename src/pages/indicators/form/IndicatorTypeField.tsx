import i18n from '@dhis2/d2-i18n'
import { useIsFetching } from '@tanstack/react-query'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { required } from '../../../lib'

type IndicatorTypeFieldsProps = {
    helpText?: string
}

export const IndicatorTypeField = ({ helpText }: IndicatorTypeFieldsProps) => {
    const newIndicatorTypeLink = useHref('/indicatorTypes/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'indicatorTypes' })

    // Check if the indicatorTypes query is currently fetching
    const isFetching = useIsFetching({
        queryKey: [{ resource: 'indicatorTypes' }],
    })

    return (
        <EditableFieldWrapper
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newIndicatorTypeLink, '_blank')}
            isRefreshing={isFetching > 0}
        >
            <div style={{ width: '400px' }}>
                <ModelSingleSelectFormField
                    required
                    dataTest="formfields-indicatortype"
                    name="indicatorType"
                    helpText={helpText}
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
