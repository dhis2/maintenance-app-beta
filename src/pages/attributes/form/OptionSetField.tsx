import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { CheckboxConfirmationWrapper } from './CheckboxConfirmationWrapper'

export const OptionSetField = () => {
    const newOptionSetLink = useHref('/optionSets/new')
    const refreshOptionSet = useRefreshModelSingleSelect({
        resource: 'optionSets',
    })
    return (
        <CheckboxConfirmationWrapper
            fieldToReset="optionSet"
            defaultValue={undefined}
            label={i18n.t('Restrict attribute values using an option set')}
        >
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
                        },
                    }}
                    helpText={i18n.t(
                        'Select an option set that users can choose from when filling out this attribute'
                    )}
                />
            </EditableFieldWrapper>
        </CheckboxConfirmationWrapper>
    )
}
