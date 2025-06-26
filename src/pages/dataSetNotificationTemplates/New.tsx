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
import { DataSetNotificationFormValues, formDescriptor } from './form/getValues'
import { useOnSaveNotifications } from './form/useOnSaveNotifications'

export const Component = () => {
    const onSubmit = useOnSaveNotifications()

    const handleFormSubmit = async (values: DataSetNotificationFormValues) =>
        onSubmit(values)

    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
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
