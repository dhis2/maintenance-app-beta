import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FormBase, FormBaseProps } from '../../../../../components'
import { DefaultFormErrorNotice } from '../../../../../components/form/DefaultFormErrorNotice'
import { LoadingSpinner } from '../../../../../components/loading/LoadingSpinner'
import {
    DEFAULT_FIELD_FILTERS,
    SchemaName,
    SchemaSection,
    useBoundResourceQueryFn,
    useOnSubmitEdit,
    useOnSubmitNew,
} from '../../../../../lib'
import { PickWithFieldFilters, Section } from '../../../../../types/generated'
import { DisplayableModel } from '../../../../../types/models'
import { initialSectionValues } from '../../dataSetFormSchema'
import { DataSetSectionFormContents } from './DataSetSectionFormContents'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'description',
    'shortName',
    'code',
    'indicators',
    'showRowTotals',
    'displayOptions',
    'dataElements[id,displayName]',
]

const dataSetSectionSchemaSection = {
    name: SchemaName.section,
    namePlural: 'sections',
    title: i18n.t('Section'),
    titlePlural: i18n.t('Sections'),
    parentSectionKey: 'dataSet',
} satisfies SchemaSection

export type SectionFormValues = PickWithFieldFilters<
    Section,
    typeof fieldFilters
>

export type DataSetSectionFormProps = {
    section?: SectionFormValues
    onCancel?: () => void
    notAssignedDataElements: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
    availableIndicators: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
} & Pick<FormBaseProps<SectionFormValues>, 'onSubmit'>
export const DataSetSectionForm = ({
    section,
    onSubmit,
    onCancel,
    notAssignedDataElements,
    availableIndicators,
}: DataSetSectionFormProps) => {
    const dataSetId = useParams().id as string
    const initialValues = useMemo(() => {
        if (section) {
            return section
        }
        return initialSectionValues
    }, [section])

    const valueFormatter = useCallback(
        (values: SectionFormValues) => {
            return {
                ...values,
                dataSet: { id: dataSetId },
            } as SectionFormValues
        },
        [dataSetId]
    )
    return (
        <FormBase
            initialValues={initialValues}
            onSubmit={onSubmit}
            valueFormatter={valueFormatter}
        >
            <DataSetSectionFormContents
                onCancel={onCancel}
                notAssignedDataElements={notAssignedDataElements}
                availableIndicators={availableIndicators}
            />
            <DefaultFormErrorNotice />
        </FormBase>
    )
}

type OnSubmit = FormBaseProps<SectionFormValues>['onSubmit']
export const EditDataSetSectionForm = ({
    section,
    onCancel,
    onSubmitted: onSubmit,
}: {
    section: DisplayableModel
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues) => void
}) => {
    const onDefaultSubmit = useOnSubmitEdit({
        modelId: section.id,
        section: dataSetSectionSchemaSection,
        navigateTo: null,
    })
    const onFormSubmit: OnSubmit = (values, form) => {
        console.log('onSubmit', values)
        return onDefaultSubmit(values, form)
        // onSubmit?.(values)
    }
    const queryFn = useBoundResourceQueryFn()
    const sectionValues = useQuery({
        queryFn: queryFn<SectionFormValues>,
        queryKey: [
            {
                resource: 'sections',
                id: section.id,
                params: {
                    fields: fieldFilters.concat(),
                },
            },
        ],
    })

    if (sectionValues.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <DataSetSectionForm
            section={sectionValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const NewDataSetSectionForm = ({
    onCancel,
    onSubmitted: onSubmit,
    notAssignedDataElements,
    availableIndicators,
}: {
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues) => void
    notAssignedDataElements: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
    availableIndicators: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
}) => {
    const onDefaultSubmit = useOnSubmitNew({
        section: dataSetSectionSchemaSection,
        navigateTo: null,
    })
    const onFormSubmit: OnSubmit = async (values, form) => {
        console.log('onSubmit', values)
        // const res = await onDefaultSubmit(values, form)
        // console.log({ res })
        // if (!res) {
        //     onSubmit?.(values)
        // }
        // return res
    }

    return (
        <DataSetSectionForm
            section={undefined}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
            notAssignedDataElements={notAssignedDataElements}
            availableIndicators={availableIndicators}
        />
    )
}

export const EditorNewDataSetSectionForm = ({
    section,
    notAssignedDataElements,
    availableIndicators,
    onCancel,
    onSubmitted: onSubmit,
}: {
    section: DisplayableModel | null
    notAssignedDataElements: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
    availableIndicators: DisplayableModel[] //Partial<SectionFormValues['dataSet']>
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues) => void
}) => {
    if (section === null) {
        return (
            <NewDataSetSectionForm
                onSubmitted={onSubmit}
                onCancel={onCancel}
                notAssignedDataElements={notAssignedDataElements}
                availableIndicators={availableIndicators}
            />
        )
    }

    return (
        <EditDataSetSectionForm
            section={section}
            onCancel={onCancel}
            onSubmitted={onSubmit}
        />
    )
}
