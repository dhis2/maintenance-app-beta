import React from 'react'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import {
    initialTrackedEntityTypeValues,
    validateTrackedEntityType,
    TrackedEntityTypeFormDescriptor,
    TrackedEntityTypeFormFields,
} from './form'

const section = SECTIONS_MAP.trackedEntityType

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialTrackedEntityTypeValues}
            validate={validateTrackedEntityType}
            subscription={{}}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={TrackedEntityTypeFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <TrackedEntityTypeFormFields />
                                <DefaultFormFooter cancelTo="/trackedEntityTypes" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
