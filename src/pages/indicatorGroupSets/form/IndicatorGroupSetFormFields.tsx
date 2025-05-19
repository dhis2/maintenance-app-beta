import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { SECTIONS_MAP } from '../../../lib'

function IndicatorGroupSetFormFields() {
    const section = SECTIONS_MAP.indicatorGroupSet
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this indicator group set.'
                    )}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields />
                <DescriptionField
                    helpText={i18n.t(
                        'Explain the purpose of this indicator group set.'
                    )}
                />
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    <label htmlFor={'indicators'}>
                        {i18n.t('Indicator groups')}
                    </label>
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Choose the indicators to include in this indicator group.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <StandardFormField>
                        <ModelTransferField
                            name="indicatorGroups"
                            query={{
                                resource: 'indicatorGroups',
                            }}
                            leftHeader={i18n.t('Available indicator groups')}
                            rightHeader={i18n.t('Selected indicator groups')}
                            filterPlaceholder={i18n.t(
                                'Filter available indicator groups'
                            )}
                            filterPlaceholderPicked={i18n.t(
                                'Filter selected indicator groups'
                            )}
                        />
                    </StandardFormField>
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}

export default IndicatorGroupSetFormFields
