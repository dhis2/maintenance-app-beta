import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { useSectionedFormContext } from '../../../lib'
import { CategoryComboField } from './CategoryComboField'
import { DataSetFormDescriptor } from './formDescriptor'

export const DataFormContents = ({ name }: { name: string }) => {
    const descriptor = useSectionedFormContext<typeof DataSetFormDescriptor>()
    return (
        <SectionedFormSection name={name}>
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
            <div style={{ height: 24 }} />
            <StandardFormSectionTitle>
                {i18n.t('Data set disaggregation')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose an optional category combination to disaggregate the entire data set.'
                )}
            </StandardFormSectionDescription>
            <CategoryComboField />
        </SectionedFormSection>
    )
}
