import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    CodeField,
    DescriptionField,
    ModelTransferField,
    NameField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
} from '../../../components'
import { useSchemaSectionHandleOrThrow } from '../../../lib'

function ValidationRuleGroupsFormFields() {
    const schemaSection = useSchemaSectionHandleOrThrow()

    return (
        <StandardFormSection>
            <StandardFormSectionTitle>
                {i18n.t('Basic information')}
            </StandardFormSectionTitle>
            <StandardFormSectionDescription>
                {i18n.t(
                    'Set up the basic information for this validation rule group.'
                )}
            </StandardFormSectionDescription>

            <StandardFormField>
                <NameField schemaSection={schemaSection} />
            </StandardFormField>
            <StandardFormField>
                <CodeField schemaSection={schemaSection} />
            </StandardFormField>
            <StandardFormField>
                <DescriptionField
                    helpText={i18n.t(
                        'Explain the purpose of this validation rule group.'
                    )}
                />
            </StandardFormField>

            <StandardFormField>
                <ModelTransferField
                    dataTest="validationRules-transfer"
                    name="validationRules"
                    query={{
                        resource: 'validationRules',
                    }}
                    leftHeader={i18n.t('Available validation rules')}
                    rightHeader={i18n.t('Selected validation rules')}
                    filterPlaceholder={i18n.t(
                        'Filter available validation rules'
                    )}
                    filterPlaceholderPicked={i18n.t(
                        'Filter selected validation rules'
                    )}
                />
            </StandardFormField>
        </StandardFormSection>
    )
}

export default ValidationRuleGroupsFormFields
