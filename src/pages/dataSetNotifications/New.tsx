import i18n from '@dhis2/d2-i18n'
import { CircularLoader } from '@dhis2/ui'
import React from 'react'
import { Form } from 'react-final-form'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider } from '../../lib'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
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
}

export const Component = () => {
    const onSubmit = useOnSaveNotifications()

    return (
        <SectionedFormProvider formDescriptor={section}>
            <Form onSubmit={onSubmit} initialValues={{}}>
                {({ handleSubmit, submitting }) => (
                    <>
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <DataSetNotificationsFormFields />
                            </form>
                            <DefaultFormFooter />
                        </SectionedFormLayout>
                        {submitting && (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <CircularLoader />
                            </div>
                        )}
                    </>
                )}
            </Form>
        </SectionedFormProvider>
    )
}
