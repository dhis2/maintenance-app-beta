import i18n from '@dhis2/d2-i18n'
import React, { ReactElement } from 'react'
import {
    DefaultFormFooter,
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
    FormBaseProps,
} from '../../components'
import { SectionedFormDescriptor, SectionedFormProvider } from '../../lib'
import { ValidationNotificationTemplateFormValues } from './Edit'

type FormBasePropsModifed<TValues, TFormattedValues = TValues> = Omit<
    FormBaseProps<TValues, TFormattedValues>,
    'children'
> & { children: ReactElement; cancelTo?: string }

export const ValidationNotificationTemplateFormDescriptor = {
    name: 'validationNotificationTemplates',
    label: 'Validation Notifications',
    sections: [
        {
            name: 'basic',
            label: i18n.t('Basic information'),
            fields: [
                {
                    name: 'name',
                    label: i18n.t('Name'),
                },
                {
                    name: 'code',
                    label: i18n.t('Code'),
                },
                {
                    name: 'validationRules',
                    label: i18n.t('Validation rules'),
                },
            ],
        },
        {
            name: 'notificationDetails',
            label: i18n.t('Notification details'),
            fields: [
                {
                    name: 'subjectTemplate',
                    label: i18n.t('Subject template'),
                },
                {
                    name: 'messageTemplate',
                    label: 'Message template',
                },
            ],
        },
        {
            name: 'recipient',
            label: i18n.t('Recipients'),
            fields: [
                {
                    name: 'recipientUserGroups',
                    label: i18n.t('Recipient user groups'),
                },
                {
                    name: 'sendStrategy',
                    label: i18n.t('Send notification as'),
                },
                {
                    name: 'notifyUsersInHierarchyOnly',
                    label: i18n.t('Notify users in hiearchy only'),
                },
            ],
        },
    ],
} as const satisfies SectionedFormDescriptor<ValidationNotificationTemplateFormValues>

export const SectionedFormWrapper = ({
    onSubmit,
    initialValues,
    validate,
    children,
    cancelTo,
}: FormBasePropsModifed<ValidationNotificationTemplateFormValues>) => (
    <FormBase
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        includeAttributes={false}
    >
        {({ handleSubmit }) => (
            <SectionedFormProvider
                formDescriptor={ValidationNotificationTemplateFormDescriptor}
            >
                <SectionedFormLayout sidebar={<DefaultSectionedFormSidebar />}>
                    <form onSubmit={handleSubmit}>
                        {children}
                        <SectionedFormErrorNotice />
                    </form>
                    <DefaultFormFooter cancelTo={cancelTo} />
                </SectionedFormLayout>
            </SectionedFormProvider>
        )}
    </FormBase>
)
