/**
 * Program rule create page. Same sectioned form as Edit (Basic information, Expression, Actions).
 * arrayMutators required because ProgramRuleActionsFormContents uses useFieldArray('programRuleActions');
 * the Actions section shows "Program rule must be saved before actions can be added" until first save.
 */
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
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { initialValues, validate } from './form/programRuleSchema'

export const Component = () => {
    const section = SECTIONS_MAP.programRule

    return (
        <FormBase
            onSubmit={useOnSubmitNew({ section })}
            initialValues={initialValues}
            modelName={section.name}
            includeAttributes={false}
            subscription={{}}
            validate={validate}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramRuleFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramRuleFormFields />
                                <DefaultFormFooter cancelTo="/programRules" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
