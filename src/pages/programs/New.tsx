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
import { trackerProgramInitialValues, trackerProgramValidate } from './form'
import { TrackerProgramFormContents } from './form/TrackerProgramFormContents'
import { TrackerProgramFormDescriptor } from './form/trackerProgramFormDescriptor'

const section = SECTIONS_MAP.program

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={trackerProgramInitialValues}
            validate={trackerProgramValidate}
            subscription={{}}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={TrackerProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <TrackerProgramFormContents />
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
