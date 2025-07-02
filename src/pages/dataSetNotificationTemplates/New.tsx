import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { DataSetNotificationsFormFields } from './form/DataSetNotificationsFormFields'
import {
    DataSetNotificationFormValues,
    initialValues,
    validate,
} from './form/DataSetNotificationTemplateSchema'
import { transformFormValues, formDescriptor } from './form/getValues'

export const Component = () => {
    const onSubmit = useOnSubmitNew<DataSetNotificationFormValues>({
        section: SECTIONS_MAP.dataSetNotificationTemplate,
    })

    return (
        <SectionedFormProvider formDescriptor={formDescriptor}>
            <FormBase<DataSetNotificationFormValues>
                onSubmit={onSubmit}
                initialValues={initialValues as DataSetNotificationFormValues}
                validate={validate}
                valueFormatter={transformFormValues}
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
