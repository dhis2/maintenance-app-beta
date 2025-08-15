import i18n from '@dhis2/d2-i18n'
import React, { useState, useEffect } from 'react'
import { useField } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { useSectionedFormContext } from '../../../lib'
import { ColorAndIconField } from '../../dataElements/fields'
import { OptionGroupFormDescriptor } from './formDescriptor'
import { OptionSetField } from './OptionSetField'

export const OptionGroupFormFields = () => {
    const descriptor =
        useSectionedFormContext<typeof OptionGroupFormDescriptor>()
    const { input: optionSetField } = useField<{ id: string } | null>(
        'optionSet'
    )
    const [selectedOptionSetId, setSelectedOptionSetId] = useState<
        string | null
    >(optionSetField.value?.id ?? null)

    useEffect(() => {
        if (optionSetField.value?.id) {
            setSelectedOptionSetId(optionSetField.value.id)
        }
    }, [optionSetField.value])

    return (
        <SectionedFormSections>
            <SectionedFormSection
                name={descriptor.getSection('basicInformation').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this option group.'
                    )}
                </StandardFormSectionDescription>

                <DefaultIdentifiableFields />

                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this option group.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>
                <StandardFormField>
                    <OptionSetField
                        onChange={(id) => setSelectedOptionSetId(id)}
                    />
                </StandardFormField>
            </SectionedFormSection>

            {selectedOptionSetId && (
                <SectionedFormSection
                    name={descriptor.getSection('options').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Options')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Select the options that belong to this group.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <ModelTransferField
                            key={selectedOptionSetId}
                            dataTest="options-field"
                            name="options"
                            query={{
                                resource: 'options',
                                params: {
                                    filter: [
                                        `optionSet.id:eq:${selectedOptionSetId}`,
                                    ],
                                    fields: 'id,displayName',
                                },
                            }}
                            leftHeader={i18n.t('Available options')}
                            rightHeader={i18n.t('Selected options')}
                            filterPlaceholder={i18n.t(
                                'Filter available options'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected options'
                            )}
                        />
                    </StandardFormField>
                </SectionedFormSection>
            )}
        </SectionedFormSections>
    )
}
