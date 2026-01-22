import i18n from '@dhis2/d2-i18n'
import { useQuery } from '@tanstack/react-query'
import arrayMutators from 'final-form-arrays'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-final-form'
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

export type SectionFormActions = {
    save: () => void
}

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
    'dataElements[id,displayName,categoryCombo[id]]',
    'greyedFields[dataElement, categoryOptionCombo]',
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
    displayOptions?: string
}
type PartialSectionFormValues = Partial<SectionFormValues>
type SubmittedSectionFormValues = PartialSectionFormValues & DisplayableModel

export type DataSetSectionFormProps = {
    dataSetSection?: PartialSectionFormValues
    onActionsReady?: (actions: SectionFormActions) => void
} & Pick<FormBaseProps<PartialSectionFormValues>, 'onSubmit'>

const DataSetSectionFormInner = ({
    onActionsReadyRef,
}: {
    onActionsReadyRef: React.RefObject<((actions: SectionFormActions) => void) | undefined>
}) => {
    const form = useForm()

    useEffect(() => {
        onActionsReadyRef.current?.({
            save: () => {
                form.submit()
            },
        })
    }, [form, onActionsReadyRef])

    return <DataSetSectionFormContents />
}

export const DataSetSectionForm = ({
    dataSetSection,
    onSubmit,
    onActionsReady,
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
    const onActionsReadyRef = React.useRef(onActionsReady)
    onActionsReadyRef.current = onActionsReady

    return (
        <FormBase
            initialValues={{ ...initialValues, dataSet: { id: dataSetId } }}
            onSubmit={onSubmit}
            valueFormatter={valueFormatter}
            includeAttributes={false}
            mutators={{ ...arrayMutators }}
        >
            <DataSetSectionFormInner onActionsReadyRef={onActionsReadyRef} />
        </FormBase>
    )
}

type OnDataSetFormSubmit = FormBaseProps<PartialSectionFormValues>['onSubmit']
export const EditDataSetSectionForm = ({
    section,
    onSubmitted,
    onActionsReady,
}: {
    section: DisplayableModel
    onSubmitted: (values: SubmittedSectionFormValues) => void
    onActionsReady?: (actions: SectionFormActions) => void
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
            onActionsReady={onActionsReady}
        />
    )
}

export const NewDataSetSectionForm = ({
    onSubmitted,
    onActionsReady,
}: {
    onSubmitted: (values: SubmittedSectionFormValues) => void
    onActionsReady?: (actions: SectionFormActions) => void
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
            onActionsReady={onActionsReady}
        />
    )
}

export const EditOrNewDataSetSectionForm = ({
    section,
    onSubmitted: onSubmit,
    onActionsReady,
}: {
    section: DisplayableModel | null | undefined
    onSubmitted: (values: SubmittedSectionFormValues) => void
    onActionsReady?: (actions: SectionFormActions) => void
}) => {
    if (section === undefined) {
        return
    }
    if (section === null) {
        return (
            <NewDataSetSectionForm
                onSubmitted={onSubmit}
                onActionsReady={onActionsReady}
            />
        )
    }

    return (
        <EditDataSetSectionForm
            section={section}
            onSubmitted={onSubmit}
            onActionsReady={onActionsReady}
        />
    )
}
