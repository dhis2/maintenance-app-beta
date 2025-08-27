import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'

export const OptionSetField = () => {
    const newOptionSetLink = useHref('/optionSets/new')
    const refreshOptionSet = useRefreshModelSingleSelect({
        resource: 'optionSets',
    })
    return (
        <EditableFieldWrapper
            onRefresh={() => refreshOptionSet()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <ModelSingleSelectFormField
                inputWidth="400px"
                name="optionSet"
                label={i18n.t('Option set')}
                query={{
                    resource: 'optionSets',
                    params: {
                        fields: 'id,displayName,valueType',
                        order: 'displayName:iasc',
                    },
                }}
                helpText={i18n.t(
                    'Choose from a predefined list of option sets. The option set will automatically define the value type.'
                )}
                clearable={true}
                clearText={i18n.t('Remove option set')}
            />
        </EditableFieldWrapper>
    )
}
