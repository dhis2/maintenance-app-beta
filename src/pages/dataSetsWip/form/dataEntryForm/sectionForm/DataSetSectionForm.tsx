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
import { DisplayableModel } from '../../../../../types/models'
import { DataSetSectionFormContents } from './DataSetSectionFormContents'
import {
    initialSectionValues,
    SectionFormValues as SectionFormValuesFetched,
} from './sectionFormSchema'

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

export type SectionFormValues = SectionFormValuesFetched & {
    dataSet: { id: string }
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
            dataSetSection={sectionValues.data}
            onSubmit={onFormSubmit}
            onCancel={onCancel}
        />
    )
}

export const NewDataSetSectionForm = ({
    onCancel,
    onSubmitted: onSubmit,
}: {
    onCancel?: () => void
    onSubmitted?: (values: SectionFormValues) => void
}) => {
    const onDefaultSubmit = useOnSubmitNew({
        section: dataSetSectionSchemaSection,
        navigateTo: null,
    })
    const onFormSubmit: OnSubmit = async (values, form) => {
        const res = await onDefaultSubmit(values, form)
        console.log('(*******', values)
        // if (res && !res[FORM_ERROR]) {
        //     onSubmit?.(values)
        // }
        // return res
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
