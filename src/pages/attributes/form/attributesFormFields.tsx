import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components'
import {
    useSchemaSectionHandleOrThrow,
    useSyncSelectedSectionWithScroll,
} from '../../../lib'
import { AttributeTypeComponent } from './AttributeTypeComponent'
import { OptionSetField } from './OptionSetField'
import { SortOrderField } from './SortOrderField'
import { ValueTypeField } from './ValueTypeField'

export const AttributeFormFields = ({
    initialValues,
}: {
    initialValues?: Record<string, any>
}) => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    useSyncSelectedSectionWithScroll()

    return (
        <SectionedFormSections>
            <SectionedFormSection name="basic">
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Set up the basic information for this attribute.')}
                </StandardFormSectionDescription>
                <DefaultIdentifiableFields shortNameIsRequired={false} />
                <StandardFormField>
                    <DescriptionField
                        helpText={i18n.t(
                            'Explain the purpose of this attribute.'
                        )}
                    />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name="data">
                <StandardFormSectionTitle>
                    {i18n.t('Data and options')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure how this attribute wil be collected, analyzed, and stored.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <OptionSetField />
                </StandardFormField>
                <StandardFormField>
                    <ValueTypeField />
                </StandardFormField>
                <StandardFormField>
                    <SortOrderField />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="mandatory"
                        label={i18n.t('Make this a mandatory attribute')}
                        type="checkbox"
                        dataTest="formfields-mandatory"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="unique"
                        label={i18n.t('No duplicate values allowed')}
                        type="checkbox"
                        dataTest="formfields-unique"
                    />
                </StandardFormField>
                <StandardFormField>
                    <AttributeTypeComponent initialValues={initialValues} />
                </StandardFormField>
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
