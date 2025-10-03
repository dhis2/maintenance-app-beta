import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import {
    EditableFieldWrapper,
    ConfirmationModalWrapper,
} from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { getConstantTranslation } from '../../../lib'

export function OptionSetField() {
    const newOptionSetLink = useHref('/optionSets/new')
    const refresh = useRefreshModelSingleSelect({ resource: 'optionSets' })
    const { input } = useField('optionSet')
    const { input: valueTypeInput } = useField('valueType')

    const renderComponent = ({
        onChange,
    }: {
        onChange: (event: any) => void
    }) => (
        <EditableFieldWrapper
            onRefresh={() => refresh()}
            onAddNew={() => window.open(newOptionSetLink, '_blank')}
        >
            <ModelSingleSelectFormField
                fullyOverrideOnChange={true}
                onChange={onChange}
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

    return (
        <ConfirmationModalWrapper
            onChange={(selected) => {
                input.onChange(selected)
                input.onBlur()
            }}
            renderComponent={renderComponent}
            skipConfirmationLogic={(selection) => {
                return (
                    !selection || selection?.valueType === valueTypeInput?.value
                )
            }}
            modalTitle={i18n.t('Option set update will change value type')}
            modalMessage={i18n.t(
                'Updating the option set will change the value type which may cause problems when generating analytics tables if there is existing data for this data element.'
            )}
            modalMessageSelectionSpecificConfirmation={(selection) =>
                i18n.t(
                    'Are you sure you want to change the option set to {{optionSet}} which will change the value type from {{currentValueType}} to {{newValueType}}?',
                    {
                        optionSet:
                            selection?.displayName ?? i18n.t('this option set'),
                        currentValueType: getConstantTranslation(
                            valueTypeInput.value
                        ),
                        newValueType: getConstantTranslation(
                            selection.valueType
                        ),
                    }
                )
            }
        />
    )
}
