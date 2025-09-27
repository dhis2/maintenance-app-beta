import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, NoticeBox } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import { useHref } from 'react-router'
import { useParams } from 'react-router-dom'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    EditableFieldWrapper,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import {
    ModelSingleSelectFormField,
    useRefreshModelSingleSelect,
} from '../../../components/metadataFormControls/ModelSingleSelect'
import styles from './OptionGroupSetFormFields.module.css'

function OptionGroupSetFormFields() {
    const { input: optionSetInput } = useField('optionSet')
    const optionSetId = optionSetInput?.value?.id
    const { input: optionGroupsInput } = useField('optionGroups')
    const optionGroupSetId = useParams().id
    const isEdit = !!optionGroupSetId
    const newOptionSetLink = useHref('/optionSets/new')
    const refreshOptionSet = useRefreshModelSingleSelect({
        resource: 'optionSets',
    })

    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this option group set.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields shortNameIsRequired={false} />
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this option group set.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="dataDimension"
                        label={i18n.t('Data dimension')}
                        type="checkbox"
                        dataTest="formfields-dataDimension"
                    />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'optionGroups'}>
                        {i18n.t('Option groups')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the option groups to include in this option group set.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <EditableFieldWrapper
                        onRefresh={() => refreshOptionSet()}
                        onAddNew={() => window.open(newOptionSetLink, '_blank')}
                    >
                        <ModelSingleSelectFormField
                            disabled={isEdit}
                            inputWidth="400px"
                            name="optionSet"
                            label={i18n.t('Option set')}
                            query={{
                                resource: 'optionSets',
                                params: {
                                    fields: 'id,displayName',
                                },
                            }}
                            onChange={() => {
                                optionGroupsInput.onChange([])
                                // option groups are cleared when option set is changed
                            }}
                            dataTest="formfields-optionSet"
                        />
                    </EditableFieldWrapper>
                </StandardFormField>

                {optionSetId ? (
                    <StandardFormField>
                        <ModelTransferField
                            dataTest="optionGroups-transfer"
                            disabled={!optionSetId}
                            name="optionGroups"
                            query={{
                                resource: 'optionGroups',
                                params: {
                                    filter: [
                                        'name:neq:default',
                                        `optionSet.id:eq:${optionSetId}`,
                                    ],
                                },
                            }}
                            leftHeader={i18n.t('Available option groups')}
                            rightHeader={i18n.t('Selected option groups')}
                            filterPlaceholder={i18n.t(
                                'Filter available option groups'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected option groups'
                            )}
                        />
                    </StandardFormField>
                ) : (
                    <NoticeBox className={styles.noOptionSetWarning}>
                        {i18n.t(
                            'You must select an option set before you can select options.'
                        )}
                    </NoticeBox>
                )}
            </StandardFormSection>
        </>
    )
}

export default OptionGroupSetFormFields
