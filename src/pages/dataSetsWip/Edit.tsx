import { useQuery } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    FormBase,
    SectionedFormLayout,
    DefaultSectionedFormFooter,
    DefaultSectionedFormSidebar,
    SectionedFormErrorNotice,
} from '../../components'
import { SectionedFormProvider, SECTIONS_MAP, useOnSubmitEdit } from '../../lib'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import {
    PickWithFieldFilters,
    DataSet,
    IdentifiableObject,
} from '../../types/generated'
import { DataSetFormContents } from './form/DataSetFormContents'
import { validate, dataSetValueFormatter } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

const fieldFilters = [
    ':owner',
    'dataSetElements[dataElement[id,displayName,categoryCombo[id,displayName]],categoryCombo[id,displayName]]',
    'style[color,icon]',
    'indicators[id,displayName]',
    'categoryCombo[id,displayName]',
    'openFuturePeriods',
    'expiryDays',
    'openPeriodsAfterCoEndDate',
    'formType',
    'displayOptions',
] as const
type DataSetValues = PickWithFieldFilters<DataSet, typeof fieldFilters>

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const id = useParams().id
    const dataSetValues = useQuery({
        queryFn: queryFn<DataSetValues>,
        queryKey: [
            {
                resource: 'dataSets',
                id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })
    const modelId = useParams().id as string

    const initialValues = useMemo(
        () =>
            dataSetValues.data && {
                ...dataSetValues.data,
                displayOptions:
                    dataSetValues.data?.displayOptions &&
                    JSON.parse(dataSetValues.data?.displayOptions),
            },
        [dataSetValues.data]
    )

    return (
        <SectionedFormProvider formDescriptor={DataSetFormDescriptor}>
            <FormBase
                valueFormatter={dataSetValueFormatter}
                onSubmit={useOnSubmitEdit({ section, modelId })}
                initialValues={initialValues}
                validate={validate}
                subscription={{}}
            >
                {({ handleSubmit }) => {
                    return (
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                            footer={<DefaultSectionedFormFooter />}
                        >
                            <form onSubmit={handleSubmit}>
                                <DataSetFormContents />
                            </form>
                            <SectionedFormErrorNotice />
                        </SectionedFormLayout>
                    )
                }}
            </FormBase>
        </SectionedFormProvider>
    )
}
