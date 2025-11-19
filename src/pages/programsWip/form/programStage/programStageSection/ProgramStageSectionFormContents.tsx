import i18n from '@dhis2/d2-i18n'
import { SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    DescriptionField,
    NameField,
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../../../components'
import { stageSectionSchemaSection } from './ProgramStageSectionForm'

const displayOptions = [
    {
        label: i18n.t('Listing'),
        value: 'LISTING',
    },
    {
        label: i18n.t('Sequential'),
        value: 'SEQUENTIAL',
    },
    {
        label: i18n.t('Matrix'),
        value: 'MATRIX',
    },
]

export const ProgramStageSectionFormContents = () => {
    return (
        <SectionedFormSections>
            <SectionedFormSection name="setup">
                <StandardFormSectionTitle>
                    {i18n.t('Section setup')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Setup the basic information for this section.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={stageSectionSchemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this section.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="500px"
                        name="renderType.DESKTOP.type"
                        render={(props) => (
                            <SingleSelectFieldFF
                                {...props}
                                label={i18n.t('Desktop display')}
                                options={displayOptions}
                            />
                        )}
                        required
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="500px"
                        name="renderType.MOBILE.type"
                        render={(props) => (
                            <SingleSelectFieldFF
                                {...props}
                                label={i18n.t('Mobile display')}
                                options={displayOptions}
                            />
                        )}
                        required
                    />
                </StandardFormField>
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
