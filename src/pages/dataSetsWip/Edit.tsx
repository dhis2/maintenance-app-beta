import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
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
import { PickWithFieldFilters, DataSet } from '../../types/generated'
import { DataSetFormContents } from './form/DataSetFormContents'
import { validate, dataSetValueFormatter } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'
import { DrawerRoot } from '../../components/drawer/Drawer'
const section = SECTIONS_MAP.dataSet

const fieldFilters = [
    ':owner',
    'organisationUnits[id,displayName,path]',
    'dataSetElements[dataElement[id,displayName,categoryCombo[id,displayName]],categoryCombo[id,displayName]]',
    'style[color,icon]',
    'indicators[id,displayName]',
    'compulsoryDataElementOperands[id,displayName,dataElement[id,displayName],categoryOptionCombo[id,displayName]]',
    'categoryCombo[id,displayName]',
    'openFuturePeriods',
    'expiryDays',
    'openPeriodsAfterCoEndDate',
    'formType',
    'displayOptions',
    'legendSets[id,displayName]',
    'dataEntryForm',
    'sections[id,displayName]',
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
        <FormBase
            valueFormatter={dataSetValueFormatter}
            onSubmit={useOnSubmitEdit({ section, modelId })}
            initialValues={initialValues}
            validate={validate}
            subscription={{}}
            mutators={{ ...arrayMutators }}
        >
            {({ handleSubmit }) => {
                return (
                    <SectionedFormProvider
                        formDescriptor={DataSetFormDescriptor}
                    >
                        <SectionedFormLayout
                            sidebar={<DefaultSectionedFormSidebar />}
                        >
                            <form onSubmit={handleSubmit}>
                                <DataSetFormContents />
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
