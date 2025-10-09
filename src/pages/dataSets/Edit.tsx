import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
    DefaultSectionedFormSidebar,
    FormBase,
    SectionedFormErrorNotice,
    SectionedFormLayout,
} from '../../components'
import { DrawerRoot } from '../../components/drawer/Drawer'
import { DefaultFormFooter } from '../../components/form/DefaultFormFooter'
import { Section } from '../../components/formCreators/SectionFormList'
import {
    createFormError,
    SectionedFormProvider,
    SECTIONS_MAP,
    useOnSubmitEdit,
} from '../../lib'
import { EnhancedOnSubmit } from '../../lib/form/useOnSubmit'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { PickWithFieldFilters, DataSet } from '../../types/generated'
import { DataSetFormContents } from './form/DataSetFormContents'
import { validate } from './form/dataSetFormSchema'
import { DataSetFormDescriptor } from './form/formDescriptor'
import { dataSetValueFormatter } from './New'
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
    'dataEntryForm[id,displayName,htmlCode]',
    'sections[id,displayName,description,access]',
] as const

type DataSetValuesFromFilters = PickWithFieldFilters<
    DataSet,
    typeof fieldFilters
>
export type DataSetValues = Omit<
    DataSetValuesFromFilters,
    'sections' | 'dataEntryForm'
> & {
    sections: Section[]
    dataEntryForm?: {
        id: string
        customHTML: string
        deleted?: boolean
    }
}

const getErrorMessage = (failures: string[]): string => {
    const customFormFailure = failures.slice(-1)?.[0] === 'customForm'
    const sectionFailures = customFormFailure
        ? failures.length > 1
        : failures.length > 0
    if (customFormFailure && !sectionFailures) {
        return 'There was an error deleting the custom form'
    }
    if (!customFormFailure && sectionFailures) {
        return 'There was an error deleting sections: {{sectionNames}}'
    }
    return 'There was an error deleting the custom form and sections: {{sectionNames}}'
}

export const useOnSubmitDataSetsEdit = (modelId: string) => {
    const submitEdit: EnhancedOnSubmit<DataSetValues> = useOnSubmitEdit({
        section,
        modelId,
    })
    const dataEngine = useDataEngine()
    const queryClient = useQueryClient()

    return useMemo<EnhancedOnSubmit<DataSetValues>>(
        () => async (values, form, options) => {
            const formValues = form.getState().values
            const sectionsToDelete = formValues.sections.filter(
                (s) => s.deleted
            )

            const customFormDeleteResult =
                formValues?.dataEntryForm?.deleted &&
                (await Promise.allSettled([
                    dataEngine.mutate({
                        resource: 'dataEntryForms',
                        id: formValues.dataEntryForm.id,
                        type: 'delete',
                    }),
                ]))

            const deletionResults = await Promise.allSettled(
                sectionsToDelete.map((s) =>
                    dataEngine.mutate({
                        resource: 'sections',
                        id: s.id,
                        type: 'delete',
                    })
                )
            )

            const failures = deletionResults
                .map((deletion, i) => ({
                    ...deletion,
                    sectionName: sectionsToDelete[i].displayName,
                    type: 'section',
                }))
                .filter((deletion) => deletion.status === 'rejected')

            if (
                customFormDeleteResult &&
                customFormDeleteResult?.[0]?.status === 'rejected'
            ) {
                failures.push({
                    ...customFormDeleteResult[0],
                    sectionName: '',
                    type: 'customForm',
                })
            }
            if (failures.length > 0) {
                await queryClient.invalidateQueries({
                    queryKey: [{ resource: section.namePlural }],
                })
                return createFormError({
                    message: i18n.t(
                        getErrorMessage(failures.map((f) => f.type)),
                        {
                            sectionNames: failures
                                .map((f) => f.sectionName)
                                .join(', '),
                            nsSeparator: '~-~',
                        }
                    ),
                    errors: failures.map((f) => f.reason.message),
                })
            }

            const trimmedValues = {
                ...values,
                dataEntryForm:
                    customFormDeleteResult &&
                    customFormDeleteResult?.[0]?.status !== 'rejected'
                        ? null
                        : values.dataEntryForm,
            } as DataSetValues
            submitEdit(trimmedValues, form, options)
        },
        [submitEdit, dataEngine, queryClient]
    )
}

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const dataSetValues = useQuery({
        queryFn: queryFn<DataSetValues>,
        queryKey: [
            {
                resource: 'dataSets',
                id: modelId,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ] as const,
    })

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
            onSubmit={useOnSubmitDataSetsEdit(modelId)}
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
