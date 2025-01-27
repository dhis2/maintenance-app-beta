import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    ModelTransferField,
    StandardFormField,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SectionedFormSection } from '../../../components/sectionedForm'
import { CategoryComboField } from './CategoryComboField'
import { DataSetElementsModelTransferField } from './DataSetElementsModelTransferField'

export const DataFormContents = ({ name }: { name: string }) => {
    return (
        <SectionedFormSection name={name}>
            <StandardFormSectionTitle>
                {i18n.t('Configure data elements')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t('Choose what data is collected for this data set.')}
            </StandardFormSectionDescription>
            <StandardFormField>
                <DataSetElementsModelTransferField />
            </StandardFormField>
            <StandardFormSectionTitle>
                {i18n.t('Data set disaggregation')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose an optional category combination to disaggregate the entire data set.'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <CategoryComboField />
            </StandardFormField>
            <StandardFormSectionTitle>
                {i18n.t('Indicators')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Choose indicators to calculate and show in the data entry form.'
                )}
            </StandardFormSectionDescription>
            <StandardFormField>
                <ModelTransferField
                    name={'indicators'}
                    query={{
                        resource: 'indicators',
                    }}
                    leftHeader={i18n.t('Available indicators')}
                    rightHeader={i18n.t('Selected indicators')}
                    filterPlaceholder={i18n.t('Search available indicators')}
                    filterPlaceholderPicked={i18n.t(
                        'Search selected indicators'
                    )}
                />
            </StandardFormField>
        </SectionedFormSection>
    )
}
