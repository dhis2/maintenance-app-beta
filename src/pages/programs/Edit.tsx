import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, Program } from '../../types/generated'
import { TrackerProgramFormDescriptor } from './form/tracker/formDescriptor'
import { TrackerProgramFormContents } from './form/tracker'

const section = SECTIONS_MAP.dataSet

const fieldFilters = [':owner', 'programType'] as const
type ProgramValues = PickWithFieldFilters<Program, typeof fieldFilters>
const proram = {} as ProgramValues

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const id = useParams().id
    const programValues = useQuery({
        queryFn: queryFn<ProgramValues>,
        queryKey: [
            {
                resource: 'programs',
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
            initialValues={programValues.data}
            subscription={{}}
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
