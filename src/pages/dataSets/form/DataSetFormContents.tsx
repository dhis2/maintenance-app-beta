import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { useFormState } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import {
    SECTIONS_MAP,
    useSectionedFormDescriptor,
    useSelectedSection,
} from '../../../lib'
import { DataSetFormDescriptor } from './formDescriptor'
import { CategoryComboField } from '../../dataElements/fields'

const section = SECTIONS_MAP.dataSet
export const DataSetFormContents = () => {
    const descriptor =
        useSectionedFormDescriptor<typeof DataSetFormDescriptor>()

    const [selectedSection] = useSelectedSection()
    const form = useFormState()

    console.log({ form })
    return (
        <>
            <SectionedFormSection
                active={selectedSection === descriptor.getSection('setup').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this data set.')}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <DescriptionField schemaSection={section} />
            </SectionedFormSection>
            <SectionedFormSection
                active={selectedSection === descriptor.getSection('data').name}
            >
                <StandardFormSectionTitle>
                    {i18n.t('Configure data elements')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Choose what data is collected for this data set.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelTransferField
                        name={'dataElements'}
                        query={{
                            resource: 'dataElements',
                        }}
                    />
                </StandardFormField>
                <StandardFormField>
                    <CategoryComboField />
                </StandardFormField>
            </SectionedFormSection>
        </>
    )
}
