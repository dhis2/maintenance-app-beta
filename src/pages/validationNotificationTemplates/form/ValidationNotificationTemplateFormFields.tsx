import i18n from '@dhis2/d2-i18n'
import { CheckboxFieldFF, SingleSelectFieldFF } from '@dhis2/ui'
import React from 'react'
import { Field as FieldRFF, useField } from 'react-final-form'
import {
    SectionedFormSection,
    SectionedFormSections,
    StandardFormField,
    StandardFormSectionTitle,
    StandardFormSectionDescription,
    NameField,
    CodeField,
    ModelTransferField,
    ModelMultiSelectField,
    MessageFields,
    MessageVariables,
} from '../../../components'
import {
    useSchemaSectionHandleOrThrow,
    useSyncSelectedSectionWithScroll,
    getConstantTranslation,
} from '../../../lib'
import styles from './ValidationNotificationTemplateFormFields.module.css'

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

export const VALIDATION_RULE_VARIABLES = {
    rule_name: { label: i18n.t('Rule name'), type: 'VARIABLE' },
    rule_description: { label: i18n.t('Rule description'), type: 'VARIABLE' },
    operator: { label: i18n.t('Operator'), type: 'VARIABLE' },
    importance: { label: i18n.t('Importance'), type: 'VARIABLE' },
    left_side_description: {
        label: i18n.t('Left side description'),
        type: 'VARIABLE',
    },
    right_side_description: {
        label: i18n.t('Right side description'),
        type: 'VARIABLE',
    },
    left_side_value: { label: i18n.t('Left side value'), type: 'VARIABLE' },
    right_side_value: { label: i18n.t('Right side value'), type: 'VARIABLE' },
    org_unit_name: {
        label: i18n.t('Organisation unit name'),
        type: 'VARIABLE',
    },
    period: { label: i18n.t('Period'), type: 'VARIABLE' },
    current_date: { label: i18n.t('Current date'), type: 'VARIABLE' },
} as MessageVariables

const UserGroupSelect = () => {
    const USER_GROUPS_QUERY = {
        resource: 'userGroups',
        params: {
            fields: ['displayName', 'id'],
            order: 'displayName',
        },
    }
    const { input, meta } = useField('recipientUserGroups')
    return (
        <div className={styles.userGroupSelect}>
            <ModelMultiSelectField
                dataTest="formfields-recipientUserGroups"
                input={input}
                meta={meta}
                name="recipientUserGroups"
                label={i18n.t('User group recipients')}
                query={USER_GROUPS_QUERY}
                filterable={true}
            />
        </div>
    )
}

export const ValidationNotificationTemplateFormFields = () => {
    const schemaSection = useSchemaSectionHandleOrThrow()
    useSyncSelectedSectionWithScroll()

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
                <StandardFormSectionTitle>
                    {i18n.t('Validation rules')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Select validation rules to trigger this notification.'
                    )}
                </StandardFormSectionDescription>
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
                        maxSelections={Infinity}
                    />
                </StandardFormField>
            </SectionedFormSection>

            <SectionedFormSection name="notificationDetails">
                <StandardFormSectionTitle>
                    {i18n.t('Notification details')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t(
                        'Configure the templates for the notification message content.'
                    )}
                </StandardFormSectionDescription>
                <MessageFields messageVariables={VALIDATION_RULE_VARIABLES} />
            </SectionedFormSection>

            <SectionedFormSection name="recipient">
                <StandardFormSectionTitle>
                    {i18n.t('Recipients')}
                </StandardFormSectionTitle>
                <StandardFormSectionDescription>
                    {i18n.t('Choose who recieves the notification.')}
                </StandardFormSectionDescription>
                <StandardFormField>
                    <UserGroupSelect />
                </StandardFormField>
                <StandardFormField>
                    <FieldRFF<string | undefined>
                        inputWidth="500px"
                        dataTest="formfields-notificationType"
                        name="sendStrategy"
                        placeholder={i18n.t('Choose notification')}
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
