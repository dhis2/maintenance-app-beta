import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useHref } from 'react-router'
import { EditableFieldWrapper } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'

export function OptionSetCommentField() {
    const newOptionSetLink = useHref('/optionSets/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'optionSets' })

    return (
        <EditableFieldWrapper
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <ModelSingleSelectFormField
                showNoValueOption
                inputWidth="400px"
                dataTest="formfields-commentoptionset"
                name="commentOptionSet"
                label={i18n.t('Option set comment')}
                query={{
                    resource: 'optionSets',
                    params: {
                        fields: ['id', 'displayName'],
                        order: ['displayName'],
                    },
                }}
                helpText={i18n.t(
                    'Choose a set of predefined comments for data entry.'
                )}
            />
        </EditableFieldWrapper>
    )
}
