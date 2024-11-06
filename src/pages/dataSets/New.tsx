import React from 'react'
import { FormBase } from '../../components'
import { DefaultSectionedFormSidebar } from '../../components/sectionedForm/DefaultSectionedFormSidebar'
import { DefaultSectionedFormFooter } from '../../components/sectionedForm/SectionedFormFooter'
import { SectionedFormLayout } from '../../components/sectionedForm/SectionedFormLayout'
import {
    SectionedFormDescriptorProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
    useOnSubmitNew,
} from '../../lib'
import { DataSetFormContents } from './form/DataSetFormContents'
import { initialValues, validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet
export const Component = () => {
    return (
        <SectionedFormDescriptorProvider initialValue={DataSetFormDescriptor}>
            <SectionedFormLayout
                sidebar={<DefaultSectionedFormSidebar />}
                footer={<DefaultSectionedFormFooter />}
            >
                <FormBase
                    onSubmit={useOnSubmitNew({ section })}
                    initialValues={initialValues}
                    validate={validate}
                >
                    <DataSetFormContents />
                </FormBase>
            </SectionedFormLayout>
        </SectionedFormDescriptorProvider>
    )
}
