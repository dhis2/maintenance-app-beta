import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'

export const OptionSetField = ({ isEdit }: { isEdit: boolean }) => {
    const newOptionSetLink = useHref('/optionSets/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'optionSets' })
    const { input: optionsInput } = useField('options')

    return (
        <EditableFieldWrapper
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <div style={{ width: '400px' }}>
                <ModelSingleSelectFormField
                    dataTest="formfields-optionSet"
                    name="optionSet"
                    disabled={isEdit}
                    label={i18n.t('Option set')}
                    query={{
                        resource: 'optionSets',
                        params: {
                            fields: ['id', 'displayName'],
                            order: 'displayName:iasc',
                        },
                    }}
                    onChange={() => {
                        optionsInput.onChange([])
                    }}
                />
            </div>
        </EditableFieldWrapper>
    )
}
