import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FormBase, FormBaseProps } from '../../../../../components'
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
    displayOptions?: undefined
}
type PartialSectionFormValues = Partial<SectionFormValues>
type SubmittedSectionFormValues = PartialSectionFormValues & DisplayableModel

export type DataSetSectionFormProps = {
    dataSetSection?: PartialSectionFormValues
    onCancel?: () => void
} & Pick<FormBaseProps<PartialSectionFormValues>, 'onSubmit'>

export const DataSetSectionForm = ({
    dataSetSection,
    onSubmit,
    onCancel,
}: DataSetSectionFormProps) => {
    const dataSetId = useParams().id as string
    const initialValues: PartialSectionFormValues | undefined = useMemo(() => {
        if (dataSetSection) {
            return {
                ...dataSetSection,
                displayOptions:
                    dataSetSection?.displayOptions &&
                    JSON.parse(dataSetSection?.displayOptions),
            }
        }
        return {
            ...initialSectionValues,
            displayOptions:
                initialSectionValues?.displayOptions &&
                JSON.parse(initialSectionValues?.displayOptions),
        }
    }, [dataSetSection])

    const valueFormatter = useCallback(
        (values: PartialSectionFormValues) => {
            return {
                ...values,
                dataSet: { id: dataSetId },
                displayOptions:
                    values.displayOptions &&
                    JSON.stringify(values.displayOptions),
            }
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
        </FormBase>
    )
}

type OnDataSetFormSubmit = FormBaseProps<PartialSectionFormValues>['onSubmit']
export const EditDataSetSectionForm = ({
    section,
    onCancel,
    onSubmitted,
}: {
    section: DisplayableModel
    onCancel?: () => void
    onSubmitted?: (values: SubmittedSectionFormValues) => void
}) => {
    const handlePatch = usePatchModel(
        section.id,
        dataSetSectionSchemaSection.namePlural
    )

    const onFormSubmit: OnDataSetFormSubmit = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        const response = await handlePatch(jsonPatchOperations)
        if (response.error) {
            return createFormError(response.error)
        }
        const updatedName = jsonPatchOperations.find(
            (op) => op.path === '/name' && op.op === 'replace'
        )?.value as string | undefined
        const resolvedDisplayName =
            updatedName || values?.displayName || values.name || ''

        onSubmitted?.({
            ...values,
            id: section.id,
            displayName: resolvedDisplayName,
        })
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
    onSubmitted?: (values: SubmittedSectionFormValues) => void
}) => {
    const handleCreate = useCreateModel(dataSetSectionSchemaSection.namePlural)

    const onFormSubmit: OnDataSetFormSubmit = async (values) => {
        const res = await handleCreate(values)
        if (res.error) {
            return createFormError(res.error)
        }
        const newId = (res.data as { response: { uid: string } }).response.uid

        onSubmitted?.({
            ...values,
            id: newId,
            displayName: values?.displayName || values.name || '',
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
    onSubmitted?: (values: SubmittedSectionFormValues) => void
}) => {
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
