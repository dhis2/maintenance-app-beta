import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF, TextAreaFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    StandardFormField,
} from '../../../components'
import { CustomAttributes } from './CustomAttributes'
import {
    AggregationTypeField,
    AggregationLevelsField,
    CategoryComboField,
    ColorAndIconField,
    DomainField,
    LegendSetField,
    OptionSetField,
    OptionSetCommentField,
    ValueTypeField,
} from './customFields'

export function DataElementFormFields() {
    return (
        <>
            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the information for this data element')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        dataTest="dataelementsformfields-name"
                        required
                        inputWidth="400px"
                        label={i18n.t('{{fieldLabel}} (required)', {
                            fieldLabel: i18n.t('Name'),
                        })}
                        name="name"
                        helpText={i18n.t(
                            'A data element name should be concise and easy to recognize.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        required
                        component={InputFieldFF}
                        dataTest="dataelementsformfields-shortname"
                        inputWidth="400px"
                        name="shortName"
                        label={i18n.t('{{fieldLabel}} (required)', {
                            fieldLabel: i18n.t('Short name'),
                        })}
                        helpText={i18n.t(
                            'Often used in reports where space is limited'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        dataTest="dataelementsformfields-code"
                        inputWidth="150px"
                        name="code"
                        label={i18n.t('Code')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={TextAreaFieldFF}
                        dataTest="dataelementsformfields-description"
                        inputWidth="400px"
                        name="description"
                        label={i18n.t('Description')}
                        helpText={i18n.t(
                            "Explain the purpose of this data element and how it's measured."
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        dataTest="dataelementsformfields-url"
                        inputWidth="400px"
                        name="url"
                        label={i18n.t('Url')}
                        helpText={i18n.t(
                            'A web link that provides extra information'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <ColorAndIconField />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        inputWidth="400px"
                        dataTest="dataelementsformfields-fieldmask"
                        name="fieldMask"
                        label={i18n.t('Field mask')}
                        helpText={i18n.t(
                            'Use a pattern to limit what information can be entered.'
                        )}
                        placeholder={i18n.t('e.g. 999-000-0000')}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={InputFieldFF}
                        dataTest="dataelementsformfields-formname"
                        inputWidth="400px"
                        name="formName"
                        label={i18n.t('StandardForm name')}
                        helpText={i18n.t(
                            'An alternative name used in section or automatic data entry forms.'
                        )}
                    />
                </StandardFormField>

                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        dataTest="dataelementsformfields-zeroissignificant"
                        name="zeroIsSignificant"
                        label={i18n.t('Store zero data values')}
                        type="checkbox"
                    />
                </StandardFormField>

                <StandardFormField>
                    <DomainField />
                </StandardFormField>

                <StandardFormField>
                    <ValueTypeField />
                </StandardFormField>

                <StandardFormField>
                    <AggregationTypeField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Disaggregation and Option sets')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up disaggregation and predefined options.')}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <CategoryComboField />
                </StandardFormField>

                <StandardFormField>
                    <OptionSetField />
                </StandardFormField>

                <StandardFormField>
                    <OptionSetCommentField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('LegendSet')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Visualize values for this data element in Analytics app. Multiple legendSet can be applied.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <LegendSetField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Aggregation levels')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'By default, the aggregation will start at the lowest assigned organisation unit. If you for example select "Chiefdom", it means that "Chiefdom", "District" and "National" aggregates use "Chiefdom" (the highest aggregation level available) as the data source, and PHU data will not be included. PHU will still be available for the PHU level, but not included in the aggregations to the levels above.'
                    )}
                </StandardFormSectionDescription>

                <StandardFormField>
                    <AggregationLevelsField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Custom attributes')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Custom fields for your DHIS2 instance')}
                </StandardFormSectionDescription>

                <CustomAttributes />
            </StandardFormSection>
        </>
    )
}
