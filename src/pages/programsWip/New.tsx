import arrayMutators from 'final-form-arrays'
import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { initialValues, validate } from './form'
import { ProgramFormDescriptor } from './form/formDescriptor'
import { ProgramFormContents } from './form/ProgramFormContents'

const section = SECTIONS_MAP.program

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramFormContents />
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
