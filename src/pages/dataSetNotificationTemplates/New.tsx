import i18n from '@dhis2/d2-i18n'
import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider } from '../../lib'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    initialValues,
    validate,
} from './form/DataSetNotificationTemplateSchema'
import { DataSetNotificationFormValues } from './form/getInitialValuesFromTemplate'
import { useOnSaveNotifications } from './form/useOnSaveNotifications'

const section = {
    name: 'dataSetNotificationsForm',
    label: i18n.t('data_set-notifications_form'),
    sections: [
        {
            name: 'whatToSend',
            label: i18n.t('What to send'),
            fields: [{ name: 'name', label: i18n.t('Name') }],
        },
        {
            name: 'whenToSend',
            label: i18n.t('When to send it'),
            fields: [
                {
                    name: 'dataSetNotificationTrigger',
                    label: i18n.t('Notification triggers'),
                },
            ],
        },
        {
            name: 'whoToSend',
            label: i18n.t('Who to send it to'),
            fields: [
                {
                    name: 'notificationRecipients',
                    label: i18n.t('Notification recipients'),
                },
            ],
        },
    ],
}

export const Component = () => {
    const onSubmit = useOnSaveNotifications()

    const handleFormSubmit = async (values: DataSetNotificationFormValues) =>
        onSubmit(values)

    return (
        <SectionedFormProvider formDescriptor={section}>
            <FormBase
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validate={validate}
                includeAttributes={false}
            >
                {({ handleSubmit }) => (
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                            <SectionedFormErrorNotice />
                        </form>
                        <DefaultFormFooter />
                    </SectionedFormLayout>
                )}
            </FormBase>
        </SectionedFormProvider>
    )
}
