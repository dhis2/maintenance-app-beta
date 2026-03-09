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
import { eventProgramInitialValues, eventProgramValidate } from './form'
import { EventProgramFormContents } from './form/eventProgram/EventProgramFormContents'
import { EventProgramFormDescriptor } from './form/eventProgram/eventProgramFormDescriptor'

const section = SECTIONS_MAP.program

export const NewEventProgram = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={eventProgramInitialValues}
            validate={eventProgramValidate}
            subscription={{}}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={EventProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <EventProgramFormContents />
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
