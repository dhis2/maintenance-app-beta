import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'

export const OptionSetField = ({
    onChange,
}: {
    onChange: (id: string | null) => void
}) => {
    const newOptionSetLink = useHref('/optionSets/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'optionSets' })

    return (
        <EditableFieldWrapper
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <div style={{ width: '400px' }}>
                <ModelSingleSelectFormField
                    dataTest="formfields-optionSet"
                    name="optionSet"
                    label={i18n.t('Option set')}
                    query={{
                        resource: 'optionSets',
                        params: {
                            fields: ['id', 'displayName'],
                            order: 'displayName:iasc',
                        },
                    }}
                    onChange={(value) => onChange(value?.id ?? null)}
                />
            </div>
        </EditableFieldWrapper>
    )
}
