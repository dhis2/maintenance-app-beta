import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useField } from 'react-final-form'
import { useHref } from 'react-router'
import { EditableFieldWrapper, StandardFormField } from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import { DEFAULT_CATEGORY_OPTION_COMBO } from '../../../lib'

type OutputResponse = {
    id: string
    displayName: string
    categoryCombo: {
        id: string
        isDefault: boolean
    }
}

export const OperatorFields = () => {
    const newDataElement = useHref('/dataElements/new')
    const refreshDataElements = useRefreshModelSingleSelect({
        resource: 'dataElements',
    })
    const { input: outputInput } = useField('output')
    const { input: outputComboInput } = useField('outputCombo')

    return (
        <>
            <StandardFormField>
                <EditableFieldWrapper
                    onRefresh={() => refreshDataElements()}
                    onAddNew={() => window.open(newDataElement, '_blank')}
                >
                    <ModelSingleSelectFormField
                        inputWidth="400px"
                        name="output"
                        label={i18n.t('Output data element (required)')}
                        query={{
                            resource: 'dataElements',
                            params: {
                                fields: 'id,displayName,categoryCombo[id,isDefault]',
                                order: 'displayName:iasc',
                            },
                        }}
                        clearable={false}
                        required={true}
                        dataTest="formfields-output"
                        onChange={(val: OutputResponse | undefined) => {
                            if (
                                val?.categoryCombo?.id &&
                                outputComboInput?.value?.categoryCombo?.id &&
                                val?.categoryCombo?.id !==
                                    outputComboInput?.value?.categoryCombo?.id
                            ) {
                                outputComboInput.onChange(undefined)
                            }
                        }}
                    />
                </EditableFieldWrapper>
            </StandardFormField>
            {outputInput?.value?.categoryCombo &&
                !outputInput?.value?.categoryCombo?.isDefault && (
                    <StandardFormField>
                        <ModelSingleSelectFormField
                            inputWidth="400px"
                            showNoValueOption={{
                                value: DEFAULT_CATEGORY_OPTION_COMBO.id,
                                label: i18n.t(
                                    'Predict according to input category option combo'
                                ),
                            }}
                            name="outputCombo"
                            label={i18n.t('Output category option combo')}
                            query={{
                                resource: 'categoryOptionCombos',
                                params: {
                                    fields: 'id,displayName,categoryCombo[id,isDefault]',
                                    filter: [
                                        `categoryCombo.id:eq:${outputInput?.value?.categoryCombo?.id}`,
                                        `id:neq:${DEFAULT_CATEGORY_OPTION_COMBO.id}`,
                                    ],
                                    order: 'displayName:iasc',
                                },
                            }}
                            placeholder={i18n.t(
                                'Predict according to input category option combo'
                            )}
                            clearable={false}
                            dataTest="formfields-outputCombo"
                        />
                    </StandardFormField>
                )}
        </>
    )
}
