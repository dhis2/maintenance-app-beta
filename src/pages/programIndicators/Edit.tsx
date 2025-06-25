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
import { fieldFilters, ProgramIndicatorValues } from './form/fieldFilters'
import { ProgramIndicatorFormDescriptor } from './form/formDescriptor'
import { ProgramIndicatorsFormFields } from './form/ProgramIndicatorFormFields'
import { validate } from './form/programIndicatorsFormSchema'

const section = SECTIONS_MAP.programIndicator

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const id = useParams().id
    const programIndicators = useQuery({
        queryFn: queryFn<ProgramIndicatorValues>,
        queryKey: [
            {
                resource: 'programIndicators',
                id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })
    const modelId = useParams().id as string

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={programIndicators.data}
            validate={validate}
            subscription={{}}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramIndicatorFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramIndicatorsFormFields />
                                <DefaultFormFooter cancelTo="/programIndicators" />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
