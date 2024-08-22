import {
    Form as ReactFinalForm,
    withTypes,
    FormProps,
    useForm,
    Field,
} from 'react-final-form'
import type { FormApi } from 'final-form'

import {
    DEFAULT_FIELD_FILTERS,
    SECTIONS_MAP,
    getSectionPath,
    useModelSectionHandleOrThrow,
    usePatchModel,
    useSchemaFromHandle,
    useSchemaSectionHandleOrThrow,
    validate,
} from '../../lib'
import {
    Attribute,
    AttributeValue,
    IdentifiableObject,
    PickWithFieldFilters,
} from '../../types/generated'
import { Category } from '../../types/models'
import { ResourceQuery } from '../../types'
import { getAllAttributeValues } from '../../lib/models/attributes'
import { useQueries, useQuery } from 'react-query'
import { useBoundResourceQueryFn } from '../../lib/query/useBoundQueryFn'
import { DefaultFormContents, useCustomAttributesQuery } from '../../components'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { init } from 'lodash/fp'
import { LoadingSpinner } from '../../components/loading/LoadingSpinner'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import { categorySchema } from './form'
import { createFormValidate } from '../../lib/form/validate'
import { useAlert } from '@dhis2/app-runtime'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'shortName',
    'code',
    'description',
    'categoryCombos',
    'categoryOptions',
    'dataDimension',
    'dataDimensionType',
    'displayFormName',
    // 'attributeValues',
] as const

type CategoryFormValues = PickWithFieldFilters<Category, typeof fieldFilters>

//const { Form } = withTypes<CategoryFormValues>()

export const Component = () => {
    const queryFn = useBoundResourceQueryFn()
    const modelId = useParams().id as string
    const query = {
        resource: 'categories',
        id: modelId,
        params: {
            fields: fieldFilters.concat(),
        },
    }
    const categoryQuery = useQuery({
        queryKey: [query] as const,
        queryFn: queryFn<CategoryFormValues>,
    })
    // categoryQuery.data?

    return (
        <EditForm
            modelId={modelId}
            initialValues={categoryQuery.data}
            validate={createFormValidate(categorySchema)}
        >
            <DefaultFormContents section={SECTIONS_MAP['category']}>
                <div>Test</div>
            </DefaultFormContents>
        </EditForm>
    )
}

type OnSubmit<TValues> = FormProps<TValues>['onSubmit']

type ModelWithAttributes = IdentifiableObject & {
    attributeValues?: AttributeValue[]
}
type EditFormProps<TValues> = {
    initialValues?: TValues
    children: React.ReactNode
    onSubmit?: OnSubmit<TValues>
    modelId: string
} & Pick<FormProps<TValues>, 'validate'>

function EditForm<TInitialValues extends ModelWithAttributes>(
    props: EditFormProps<TInitialValues>
) {
    const section = useModelSectionHandleOrThrow()
    const patchDirtyFields = usePatchModel(props.modelId, section.namePlural)
    const noChangesAlert = useAlert('No changes to be saved')
    const navigate = useNavigate()

    const onSubmit: OnSubmit<TInitialValues> = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        if (jsonPatchOperations.length < 1) {
            noChangesAlert.show()
            navigate(`/${getSectionPath(section)}`)
            return
        }
        const errors = await patchDirtyFields(jsonPatchOperations)
        return errors
    }

    const customAttributes = useCustomAttributesQuery()
    const initialValuesWithAttributes = useMemo(() => {
        if (!customAttributes.data) {
            return undefined
        }
        if (!props.initialValues?.attributeValues) {
            return props.initialValues
        }
        return {
            ...props.initialValues,
            attributeValues: getAllAttributeValues(
                props.initialValues.attributeValues,
                customAttributes.data
            ),
        }
    }, [customAttributes.data, props.initialValues])

    if (!initialValuesWithAttributes) {
        return <LoadingSpinner />
    }

    return (
        <ReactFinalForm<TInitialValues>
            onSubmit={props.onSubmit ?? onSubmit}
            initialValues={initialValuesWithAttributes}
            validate={props.validate}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>{props.children}</form>
            )}
        />
    )
}
