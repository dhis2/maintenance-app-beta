import i18n from '@dhis2/d2-i18n'
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
    DEFAULT_FIELD_FILTERS,
    SectionedFormProvider,
    SECTIONS_MAP,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
} from '../../lib'
import { PickWithFieldFilters, ProgramIndicator } from '../../types/generated'
import { validate } from '../dataSetsWip/form/dataSetFormSchema'
import { ProgramIndicatorsFormFields } from './form/ProgramIndicatorFormFields'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'shortName',
    'code',
    'style[color,icon]',
    'description',
    'program[id,programType, programTrackedEntityAttributes]',
    'analyticsType',
    'displayInForm',
    'legendSets[id, displayName]',
    'aggregateExportCategoryOptionCombo',
    'aggregateExportAttributeOptionCombo',
    'expression',
] as const

const section = SECTIONS_MAP.programIndicator

export type ProgramIndicatorValues = PickWithFieldFilters<
    ProgramIndicator,
    typeof fieldFilters
>
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
        <SectionedFormProvider
            formDescriptor={{
                name: 'ProgramIndicatorsForm',
                label: i18n.t('Program Indicators Form'),
                sections: [
                    {
                        name: 'setup',
                        label: i18n.t('Setup'),
                        fields: [],
                    },
                    {
                        name: 'editExpression',
                        label: i18n.t('Edit expression'),
                        fields: [],
                    },
                    {
                        name: 'editFilter',
                        label: i18n.t('Edit filter'),
                        fields: [],
                    },
                ],
            }}
        >
            <FormBase
                onSubmit={useOnSubmitEdit({ section, modelId })}
                initialValues={programIndicators.data}
                validate={validate}
                subscription={{}}
            >
                {({ handleSubmit }) => {
                    return (
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <ProgramIndicatorsFormFields />
                                <DefaultFormFooter />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    )
                }}
            </FormBase>
        </SectionedFormProvider>
    )
}
