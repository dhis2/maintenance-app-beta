import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    SectionedFormSectionRouter,
} from '../../../components'
import {
    SectionedFormSection,
    SectionedFormSections,
} from '../../../components/sectionedForm'
import { SECTIONS_MAP, useSectionedFormContext } from '../../../lib'
import { DataSetFormDescriptor } from './formDescriptor'

const section = SECTIONS_MAP.dataSet

export const DataSetFormContents = () => {
    const descriptor = useSectionedFormContext<typeof DataSetFormDescriptor>()

    return (
        <SectionedFormSections>
            <SectionedFormSectionRouter>
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
                        {i18n.t('Configure data entry periods')}
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        {i18n.t(
                            'Choose for what time periods data can be entered for this data set'
                        )}
                    </StandardFormSectionDescription>
                </SectionedFormSection>
            </SectionedFormSectionRouter>
        </SectionedFormSections>
    )
}
