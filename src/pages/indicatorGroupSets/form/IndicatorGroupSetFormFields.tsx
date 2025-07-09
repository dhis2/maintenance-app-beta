import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    DefaultIdentifiableFields,
    DescriptionField,
    ModelTransferField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'

function IndicatorGroupSetFormFields() {
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
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this indicator group set.'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="compulsory"
                        label={i18n.t('Compulsory')}
                        type="checkbox"
                    />
                </StandardFormField>
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
