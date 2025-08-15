// src/pages/optionGroups/NewOptionGroup.tsx
import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { OptionGroupFormDescriptor } from './form/formDescriptor'
import { OptionGroupFormFields } from './form/OptionGroupFormFields'
import { initialValues, validate } from './form/OptionGroupFormSchema'

const section = SECTIONS_MAP.optionGroup

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            validate={validate}
            includeAttributes={false}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={OptionGroupFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <OptionGroupFormFields />
                            <DefaultFormFooter cancelTo="/optionGroups" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
