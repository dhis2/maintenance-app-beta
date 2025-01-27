import React from 'react'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { DataSetFormContents } from './form/DataSetFormContents'
import { initialValues, validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

export const Component = () => {
    return (
        <SectionedFormProvider formDescriptor={DataSetFormDescriptor}>
            <FormBase
                onSubmit={useOnSubmitNew({ section })}
                initialValues={initialValues}
                validate={validate}
                subscription={{}}
            >
                {({ handleSubmit }) => {
                    return (
                        <>
                            <SectionedFormLayout
                                sidebar={<DefaultSectionedFormSidebar />}
                                footer={<DefaultSectionedFormFooter />}
                            >
                                <form onSubmit={handleSubmit}>
                                    <DataSetFormContents />
                                </form>
                                <SectionedFormErrorNotice />
                            </SectionedFormLayout>
                        </>
                    )
                }}
            </FormBase>
        </SectionedFormProvider>
    )
}
