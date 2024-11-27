import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import {
    SectionedFormSection,
    SectionedFormSections,
} from '../../../components/sectionedForm'
import {
    SECTIONS_MAP,
    useSectionedFormContext,
    useSelectedSection,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { DataSetFormDescriptor } from './formDescriptor'

const section = SECTIONS_MAP.dataSet

export const DataSetFormContents = () => {
    const descriptor = useSectionedFormContext<typeof DataSetFormDescriptor>()
    useSyncSelectedSectionWithScroll()
    const [selectedSection] = useSelectedSection()
    return (
        <>
            <SectionedFormSections>
                <SectionedFormSection
                    name={descriptor.getSection('setup').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Basic information')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Set up the basic information for this data set.'
                        )}
                    </StandardFormSectionDescription>
                    <DefaultIdentifiableFields />
                    <DescriptionField schemaSection={section} />
                </SectionedFormSection>
                <SectionedFormSection name={descriptor.getSection('data').name}>
                    <StandardFormSectionTitle>
                        {i18n.t('Configure data elements')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose what data is collected for this data set.'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <ModelTransferField
                            name={'dataElements'}
                            query={{
                                resource: 'dataElements',
                            }}
                        />
                    </StandardFormField>
                </SectionedFormSection>
                <SectionedFormSection
                    name={descriptor.getSection('periods').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Configure data entry periods')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose for what time periods data can be entered for this data set'
                        )}
                    </StandardFormSectionDescription>
                </SectionedFormSection>
                <SectionedFormSection
                    name={descriptor.getSection('validation').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Validation and limitations')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure how data can and must be entered for this data'
                        )}
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <ModelTransferField
                            name={'dataElements'}
                            query={{
                                resource: 'dataElements',
                            }}
                        />
                    </StandardFormField>
                </SectionedFormSection>
                <SectionedFormSection
                    name={descriptor.getSection('organisationUnits').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Organisation units')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Configure which organisation units can collect data for this data set.'
                        )}
                    </StandardFormSectionDescription>
                    <div style={{ height: 300 }} />
                </SectionedFormSection>
                <SectionedFormSection name={descriptor.getSection('form').name}>
                    <StandardFormSectionTitle>
                        {i18n.t('Data entry form')}
                    </StandardFormSectionTitle>
                    <div style={{ height: 300 }} />
                </SectionedFormSection>
                <SectionedFormSection
                    name={descriptor.getSection('advanced').name}
                >
                    <StandardFormSectionTitle>
                        {i18n.t('Advanced options')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'These options are used for advanced data set configurations.'
                        )}
                    </StandardFormSectionDescription>
                    <div style={{ height: 900 }} />
                </SectionedFormSection>
            </SectionedFormSections>
        </>
    )
}
