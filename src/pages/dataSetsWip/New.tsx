import arrayMutators from 'final-form-arrays'
import { omit } from 'lodash'
import React from 'react'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { DataSetValues } from './Edit'
import { DataSetFormContents } from './form/DataSetFormContents'
import { initialValues, validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

export const dataSetValueFormatter = <
    // the reason for the generic is that the type between Edit (with Id) and create (without Id) is different
    TValues extends Partial<DataSetValues>
>(
    values: TValues
) => {
    const withoutSections = omit(values, 'sections')
    return {
        ...withoutSections,
        displayOptions:
            values.displayOptions && JSON.stringify(values.displayOptions),
    }
}

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            valueFormatter={dataSetValueFormatter}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
            mutators={{ ...arrayMutators }}
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
