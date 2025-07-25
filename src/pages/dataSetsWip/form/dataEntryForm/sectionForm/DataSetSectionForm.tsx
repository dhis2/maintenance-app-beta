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
    usePatchModel,
    createFormError,
    createJsonPatchOperations,
    useCreateModel,
} from '../../../../../lib'
import {
    DisplayableModel,
    PickWithFieldFilters,
    Section,
} from '../../../../../types/models'
import { DataSetSectionFormContents } from './DataSetSectionFormContents'
import { initialSectionValues } from './sectionFormSchema'

export const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
    'description',
    'code',
    'indicators[id,displayName]',
    'showRowTotals',
    'showColumnTotals',
    'disableDataElementAutoGroup',
    'displayOptions',
    'dataElements[id,displayName]',
] as const

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
> & {
    dataSet: { id: string }
    displayOptions?: any
}

export type DataSetSectionFormProps = {
    dataSetSection?: SectionFormValues
    onCancel?: () => void
} & Pick<FormBaseProps<SectionFormValues>, 'onSubmit'>

export const DataSetSectionForm = ({
    dataSetSection,
    onSubmit,
    onCancel,
}: DataSetSectionFormProps) => {
    const dataSetId = useParams().id as string
    const initialValues: Partial<SectionFormValues> | undefined =
        useMemo(() => {
            if (dataSetSection) {
                return dataSetSection
            }
            return {
                ...initialSectionValues,
                displayOptions:
                    initialSectionValues?.displayOptions &&
                    JSON.parse(initialSectionValues?.displayOptions),
            }
        }, [dataSetSection])

    const valueFormatter = useCallback(
        (values: SectionFormValues) => {
            return {
                ...values,
                dataSet: { id: dataSetId },
                displayOptions:
                    values.displayOptions &&
                    JSON.stringify(values.displayOptions),
            } as SectionFormValues
        },
        [dataSetId]
    )
    return (
        <FormBase
            initialValues={{ ...initialValues, dataSet: { id: dataSetId } }}
            onSubmit={onSubmit}
            valueFormatter={valueFormatter}
            includeAttributes={false}
        >
            <DataSetSectionFormContents onCancel={onCancel} />
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
    const handlePatch = usePatchModel(
        section.id,
        dataSetSectionSchemaSection.namePlural
    )

    const onFormSubmit: OnSubmit = async (values, form) => {
        console.log('onSubmit', values)
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }
        onSubmit?.(values)
        return undefined
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
            dataSetSection={sectionValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const NewDataSetSectionForm = ({
    onCancel,
    onSubmitted,
}: {
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues & DisplayableModel) => void
}) => {
    const handleCreate = useCreateModel(dataSetSectionSchemaSection.namePlural)

    const onFormSubmit: OnSubmit = async (values) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        const newId = (res.data as { response: { uid: string } }).response.uid

        onSubmitted?.({
            ...values,
            id: newId,
            displayName: values?.displayName || values.name,
        })
        return undefined
    }

    return (
        <DataSetSectionForm
            dataSetSection={undefined}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const EditOrNewDataSetSectionForm = ({
    dataSetSection,
    onCancel,
    onSubmitted: onSubmit,
}: {
    dataSetSection: DisplayableModel | null
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues) => void
}) => {
    console.log({ dataSetSection })
    if (dataSetSection === null) {
        return (
            <NewDataSetSectionForm onSubmitted={onSubmit} onCancel={onCancel} />
        )
    }

    return (
        <EditDataSetSectionForm
            section={dataSetSection}
            onCancel={onCancel}
            onSubmitted={onSubmit}
        />
    )
}
