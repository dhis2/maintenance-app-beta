import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { OptionSetFormDescriptor } from './form/formDescriptor'
import { OptionSetFormContents } from './form/OptionSetFormContents'
import { initialValues, validate } from './form/optionSetSchema'

const section = SECTIONS_MAP.optionSet

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider formDescriptor={OptionSetFormDescriptor}>
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <OptionSetFormContents />
                            <DefaultFormFooter cancelTo="/optionSets" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
