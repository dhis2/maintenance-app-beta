import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultFormFooter,
    DefaultSectionedFormSidebar,
    DrawerRoot,
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
import { PickWithFieldFilters, Program } from '../../types/generated'
import { validate } from './form'
import { ProgramFormDescriptor } from './form/formDescriptor'
import { ProgramFormContents } from './form/ProgramFormContents'

const fieldFilters = [
    'name',
    'shortName',
    'code',
    'description',
    'version',
    'featureType',
    'relatedProgram[id,displayName]',
    'categoryCombo[id,displayName]',
    'lastUpdated',
] as const

export type ProgramsFromFilters = PickWithFieldFilters<
    Program,
    typeof fieldFilters
>

const section = SECTIONS_MAP.program

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string

    const program = useQuery({
        queryFn: queryFn<ProgramsFromFilters>,
        queryKey: [
            {
                resource: 'programs',
                id: modelId,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })

    return (
        <FormBase
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={program.data}
            subscription={{}}
            mutators={{ ...arrayMutators }}
            validate={validate}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={ProgramFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramFormContents />
                                <DefaultFormFooter />
                            </form>
                            <DrawerRoot />
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    </SectionedFormProvider>
                )
            }}
        </FormBase>
    )
}
