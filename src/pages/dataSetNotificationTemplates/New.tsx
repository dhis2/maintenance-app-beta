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
    initialValues,
    transformFormValues,
    validate,
} from './form/dataSetNotificationTemplateSchema'
import { formDescriptor } from './form/formDescriptor'

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({
                section: SECTIONS_MAP.dataSetNotificationTemplate,
            })}
            initialValues={initialValues}
            validate={validate}
            valueFormatter={transformFormValues}
            includeAttributes={false}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={formDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DataSetNotificationsFormFields />
                            <SectionedFormErrorNotice />
                        </form>
                        <DefaultFormFooter />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
