import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import {
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import { fieldFilters, ProgramRuleFormValues } from './form/fieldFilters'
import { ProgramRuleFormDescriptor } from './form/formDescriptor'
import { ProgramRuleFormFields } from './form/ProgramRuleFormFields'
import { validate } from './form/programRuleSchema'

export const Component = () => {
    const modelId = useParams().id as string
    const section = SECTIONS_MAP.programRule
    const queryFn = useBoundResourceQueryFn()

    const query = {
        resource: 'programRules',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }

    const programRuleQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleFormValues>,
    })

    const initialValues = programRuleQuery.data

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            modelName={section.name}
            includeAttributes={false}
            validate={validate}
            subscription={{}}
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
