import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { SectionedFormProvider } from '../../lib'
import { Form } from 'react-final-form'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
} from '../../components'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'

export const Component = () => {
    return (
        <SectionedFormProvider
            formDescriptor={{
                name: 'dataSetNotificationsForm',
                label: i18n.t('data_set-notifications_form'),
                sections: [
                    {
                        name: 'whatToSend',
                        label: i18n.t('What to send'),
                        fields: [
                            {
                                name: 'name',
                                label: i18n.t('Name'),
                            },
                        ],
                    },
                    {
                        name: 'whenToSend',
                        label: i18n.t('When to send it'),
                        fields: [
                            {
                                name: 'notificationTriggers',
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
            }}
        >
            <Form
                onSubmit={(values) => {
                    console.log('Form submitted with values:', values)
                }}
                initialValues={{}}
            >
                {({ handleSubmit, submitting }) => {
                    return (
                        <>
                            <SectionedFormLayout
                                sidebar={<DefaultSectionedFormSidebar />}
                            >
                                <form onSubmit={handleSubmit}>
                                    <DataSetNotificationsFormFields />
                                    <DefaultFormFooter />
                                </form>
                            </SectionedFormLayout>
                        </>
                    )
                }}
            </Form>
        </SectionedFormProvider>
    )
}
