import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    StandardFormField,
    StandardFormSection,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    DefaultIdentifiableFields,
    DescriptionField,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'
import { AttributeTypeComponent } from './AttributeTypeComponent'
import { OptionSetField } from './OptionSetField'
import { ValueTypeField } from './ValueTypeField'

export const AttributeFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <>
            <StandardFormSection>
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
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="mandatory"
                        label={i18n.t('Mandatory')}
                        type="checkbox"
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="unique"
                        label={i18n.t('Unique')}
                        type="checkbox"
                    />
                </StandardFormField>
                <StandardFormField>
                    <ValueTypeField />
                </StandardFormField>
                <StandardFormField>
                    <OptionSetField />
                </StandardFormField>
            </StandardFormSection>

            <StandardFormSection>
                <StandardFormSectionTitle>
                    {i18n.t('Attribute type')}
                </StandardFormSectionTitle>

                <StandardFormField>
                    <AttributeTypeComponent />
                </StandardFormField>
            </StandardFormSection>
        </>
    )
}
