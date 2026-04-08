import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { ModelSingleSelectRefreshableFormField } from '../../../components/metadataFormControls/ModelSingleSelect/ModelSingleSelectRefreshableField'

export const OptionSetField = ({ isEdit }: { isEdit: boolean }) => {
    const { input: optionsInput } = useField('options')

    return (
        <ModelSingleSelectRefreshableFormField
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
            refreshResource="optionSets"
        />
    )
}
