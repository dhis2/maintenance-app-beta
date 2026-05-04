import { useQuery } from '@tanstack/react-query'
import { omit } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-final-form'
import { useSearchParams } from 'react-router-dom'
import {
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { DuplicationNoticeBox } from '../../components/form/DuplicationNoticeBox'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitNew } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { fieldFilters, ProgramIndicatorValues } from './form/fieldFilters'
import { ProgramIndicatorFormDescriptor } from './form/formDescriptor'
import { ProgramIndicatorsFormFields } from './form/ProgramIndicatorFormFields'
import { validate } from './form/programIndicatorsFormSchema'

const section = SECTIONS_MAP.programIndicator

const TriggerDuplicateValidation = () => {
    const form = useForm()
    useEffect(() => {
        form.getRegisteredFields().forEach((field) => {
            form.focus(field)
            form.blur(field)
        })
    }, [form])
    return null
}

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const [searchParams] = useSearchParams()
    const duplicatedModelId = searchParams.get('duplicatedId') as string

    const programIndicators = useQuery({
        queryFn: queryFn<ProgramIndicatorValues>,
        queryKey: [
            {
                resource: 'programIndicators',
                id: duplicatedModelId,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })

    const onSubmit = useOnSubmitNew<Omit<ProgramIndicatorValues, 'id'>>({
        section,
    })

    const initialValues = useMemo(() => {
        return programIndicators.data
            ? omit(programIndicators.data, 'id')
            : undefined
    }, [programIndicators.data])

    if (!initialValues) {
        return null
    }

    return (
        <FormBase
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
            fetchError={!!programIndicators.error}
        >
            {({ handleSubmit }) => (
                <SectionedFormProvider
                    formDescriptor={ProgramIndicatorFormDescriptor}
                >
                    <SectionedFormLayout
                        sidebar={<DefaultSectionedFormSidebar />}
                    >
                        <form onSubmit={handleSubmit}>
                            <DuplicationNoticeBox section={section} />
                            <ProgramIndicatorsFormFields />
                            <TriggerDuplicateValidation />
                            <DefaultFormFooter cancelTo="/programIndicators" />
                        </form>
                        <SectionedFormErrorNotice />
                    </SectionedFormLayout>
                </SectionedFormProvider>
            )}
        </FormBase>
    )
}
