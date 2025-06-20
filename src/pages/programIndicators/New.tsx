import React from 'react'
import {
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { ProgramIndicatorFormDescriptor } from './form/formDescriptor'
import { ProgramIndicatorsFormFields } from './form/ProgramIndicatorFormFields'
import { initialValues, validate } from './form/programIndicatorsFormSchema'

const section = SECTIONS_MAP.programIndicator

export const Component = () => {
    return (
        <SectionedFormProvider formDescriptor={ProgramIndicatorFormDescriptor}>
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
                            >
                                <form onSubmit={handleSubmit}>
                                    <ProgramIndicatorsFormFields />
                                    <DefaultFormFooter cancelTo="/programIndicators" />
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
