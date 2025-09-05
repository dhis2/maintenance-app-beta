import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF } from 'react-final-form'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    NameField,
    CodeField,
    ModelTransferField,
} from '../../../components'
import {
    useSchemaSectionHandleOrThrow,
    useSyncSelectedSectionWithScroll,
    getConstantTranslation,
    SECTIONS_MAP,
} from '../../../lib'
import { ValidationRuleContentFields } from './ValidationRuleContentFields'

const notificationTypeOptions = [
    {
        label: getConstantTranslation('COLLECTIVE_SUMMARY'),
        value: 'COLLECTIVE_SUMMARY',
    },
    {
        label: getConstantTranslation('SINGLE_NOTIFICATION'),
        value: 'SINGLE_NOTIFICATION',
    },
]

export const ValidationNotificationTemplateFormFields = ({
    initialValues,
}: {
    initialValues?: Record<string, any>
}) => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    useSyncSelectedSectionWithScroll()
    const section = SECTIONS_MAP.validationNotificationTemplate

    return (
        <SectionedFormSections>
            <SectionedFormSection name="basic">
                <StandardFormSectionTitle>
                    {i18n.t('Basic information')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Set up the basic information for this validation notification.'
                    )}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <NameField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <CodeField schemaSection={schemaSection} />
                </StandardFormField>
                <StandardFormField>
                    <ModelTransferField
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
            </SectionedFormSection>

            <SectionedFormSection name="messageContent">
                <StandardFormSectionTitle>
                    {i18n.t('Message content')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('What should this notification send?')}
                </StandardFormSectionDescription>
                <ValidationRuleContentFields />
            </SectionedFormSection>

            <SectionedFormSection name="recipient">
                <StandardFormSectionTitle>
                    {i18n.t('Recipients')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Choose who recieves the notification.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <ModelTransferField
                        name="recipientUserGroups"
                        query={{
                            resource: 'userGroups',
                        }}
                        leftHeader={i18n.t('Available user groups')}
                        rightHeader={i18n.t('Selected user groups')}
                        filterPlaceholder={i18n.t(
                            'Filter available user groups'
                        )}
                        filterPlaceholderPicked={i18n.t(
                            'Filter selected user groups'
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="500px"
                        dataTest="formfields-notification-type"
                        name="sendStrategy"
                        render={(props) => (
                            <SingleSelectFieldFF
                                {...props}
                                clearable
                                label={i18n.t('Send notification as')}
                                options={notificationTypeOptions}
                            />
                        )}
                    />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF
                        component={CheckboxFieldFF}
                        name="notifyUsersInHierarchyOnly"
                        label={i18n.t('Notify users in hierarchy only')}
                        type="checkbox"
                        dataTest="formfields-notifyUsersInHierarchyOnly"
                    />
                </StandardFormField>
            </SectionedFormSection>
        </SectionedFormSections>
    )
}
