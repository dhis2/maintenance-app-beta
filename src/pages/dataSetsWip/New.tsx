import React from 'react'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { DataSetFormContents } from './form/DataSetFormContents'
import {
    initialValues,
    validate,
    dataSetValueFormatter,
} from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            valueFormatter={dataSetValueFormatter}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={DataSetFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <DataSetFormContents />
                                <DefaultFormFooter />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
