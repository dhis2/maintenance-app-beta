import React from 'react'
import { useQuery } from 'react-query'
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
import { PickWithFieldFilters, DataSet } from '../../types/generated'
import { DataSetFormContents } from './form/DataSetFormContents'
import { validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'

const section = SECTIONS_MAP.dataSet

const fieldFilters = [
    ':owner',
    'dataSetElements[dataElement[id,displayName,categoryCombo[id,displayName]],categoryCombo[id,displayName]]',
    'style[color,icon]',
    'indicators[id,displayName]',
    'compulsoryDataElementOperands[id,displayName,dataElement[id,displayName],categoryOptionCombo[id,displayName]]',
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

    return (
        <SectionedFormProvider formDescriptor={DataSetFormDescriptor}>
            <FormBase
                onSubmit={useOnSubmitEdit({ section, modelId })}
                initialValues={dataSetValues.data}
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
