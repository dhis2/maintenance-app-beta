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
import {
    initialValues,
    validate,
    dataSetValueFormatter,
} from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'
import { createPortalToFooter } from '../../app/layout'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'

const section = SECTIONS_MAP.dataSet

export const Component = () => {
    return (
        <SectionedFormProvider formDescriptor={DataSetFormDescriptor}>
            <FormBase
                onSubmit={useOnSubmitNew({ section })}
                valueFormatter={dataSetValueFormatter}
                initialValues={initialValues}
                validate={validate}
                subscription={{}}
            >
                {({ handleSubmit }) => {
                    return (
                        <>
                            <SectionedFormLayout
                                sidebar={<DefaultSectionedFormSidebar />}
                            >
                                <form onSubmit={handleSubmit}>
                                    <DataSetFormContents />
                                    <DefaultFormFooter />
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
