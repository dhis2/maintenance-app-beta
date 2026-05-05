import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    DuplicationNoticeBox,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
    TriggerDuplicateValidation,
} from '../../components'
import {
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitNew,
} from '../../lib'
import {
    fieldFilters,
    ProgramRuleVariableFormValues,
} from './form/fieldFilters'
import { ProgramRuleVariableFormDescriptor } from './form/formDescriptor'
import { ProgramRuleVariableFormFields } from './form/ProgramRuleVariableFormFields'
import { validate } from './form/programRuleVariableSchema'

const section = SECTIONS_MAP.programRuleVariable

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const query = {
        resource: 'programRuleVariables',
        id: duplicatedModelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const programRuleVariableQuery = useQuery({
        queryKey: [query],
        queryFn: queryFn<ProgramRuleVariableFormValues>,
    })

    const onSubmit = useOnSubmitNew<Omit<ProgramRuleVariableFormValues, 'id'>>({
        section,
    })

    const initialValues = useMemo(
        () =>
            programRuleVariableQuery.data
                ? omit(programRuleVariableQuery.data, 'id')
                : undefined,
        [programRuleVariableQuery.data]
    )

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            modelName={section.name}
            includeAttributes={false}
            validate={validate}
            fetchError={!!programRuleVariableQuery.error}
            subscription={{}}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={ProgramRuleVariableFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <ProgramRuleVariableFormFields />
                            <TriggerDuplicateValidation />
                            <DefaultFormFooter cancelTo="/programRuleVariables" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
