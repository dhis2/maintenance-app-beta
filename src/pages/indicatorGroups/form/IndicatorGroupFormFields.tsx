import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CodeField,
    CustomAttributesSection,
    DescriptionField,
    ModelTransferField,
    NameField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

function IndicatorGroupFormFields() {
    const section = SECTIONS_MAP.indicatorGroup
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this indicator group.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={section} />
                </StandardFormField>
                <StandardFormField>
                    <CodeField schemaSection={section} />
                </StandardFormField>
                <DescriptionField
                    helpText={i18n.t(
                        'Explain the purpose of this indicator group.'
                    )}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'indicators'}>{i18n.t('Indicators')}</label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the indicators to include in this indicator group.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="indicators"
                            query={{
                                resource: 'indicators',
                            }}
                            leftHeader={i18n.t('Available indicators')}
                            rightHeader={i18n.t('Selected indicators')}
                            filterPlaceholder={i18n.t(
                                'Filter available indicators'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected indicators'
                            )}
                            filterUnassignedTo={'indicatorGroups'}
                        />
                    </StandardFormField>
                </StandardFormField>
                <CustomAttributesSection schemaSection={section} />
            </StandardFormSection>
        </>
    )
}

export default IndicatorGroupFormFields
