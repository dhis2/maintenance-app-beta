import React from 'react'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormFooter,
    DefaultSectionedFormSidebar,
} from '../../components'
import {
    SectionedFormDescriptorProvider,
    SECTIONS_MAP,
    useOnSubmitNew,
} from '../../lib'
import { DataSetFormContents } from './form/DataSetFormContents'
import { initialValues, validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

export const Component = () => {
    return (
        <SectionedFormDescriptorProvider formDescriptor={DataSetFormDescriptor}>
            <FormBase
                onSubmit={useOnSubmitNew({ section })}
                initialValues={initialValues}
                validate={validate}
                subscription={{}}
            >
                {({ handleSubmit }) => {
                    return (
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                            footer={<DefaultSectionedFormFooter />}
                        >
                            <form onSubmit={handleSubmit}>
                                <DataSetFormContents />
                            </form>
                        </SectionedFormLayout>
                    )
                }}
            </FormBase>
        </SectionedFormDescriptorProvider>
    )
}
