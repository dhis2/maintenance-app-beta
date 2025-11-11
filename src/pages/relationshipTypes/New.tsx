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
    initialRelationshipTypeValues,
    validateRelationshipType,
    RelationshipTypeFormDescriptor,
    RelationshipTypeFormFields,
} from './form'

const section = SECTIONS_MAP.relationshipType

export const Component = () => {
    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialRelationshipTypeValues}
            validate={validateRelationshipType}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={RelationshipTypeFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <RelationshipTypeFormFields />
                                <DefaultFormFooter cancelTo="/relationshipTypes" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
