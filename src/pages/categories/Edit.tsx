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
    SCHEMA_SECTIONS,
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
import {
    DefaultFormContents,
    DefaultIdentifiableFields,
    DescriptionField,
    StandardFormField,
    StandardFormSection,
    StandardFormSectionDescription,
    StandardFormSectionTitle,
    useCustomAttributesQuery,
} from '../../components'
import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { init } from 'lodash/fp'
import { LoadingSpinner } from '../../components/loading/LoadingSpinner'
import { createJsonPatchOperations } from '../../lib/form/createJsonPatchOperations'
import { categorySchema } from './form'
import { createFormValidate } from '../../lib/form/validate'
import { useAlert } from '@dhis2/app-runtime'
import { CheckboxFieldFF, RadioFieldFF, Field as UIField } from '@dhis2/ui'

const fieldFilters = [
    ...DEFAULT_FIELD_FILTERS,
    'name',
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
                <StandardFormSection>
                    <StandardFormSectionTitle>
                        Basic information
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        Set up the basic information for this category.
                    </StandardFormSectionDescription>
                    <DefaultIdentifiableFields />
                    <DescriptionField
                        schemaSection={SCHEMA_SECTIONS.category}
                        helpText="Explain the purpose of this category."
                    />
                </StandardFormSection>

                <StandardFormSection>
                    <StandardFormSectionTitle>
                        Data configuration
                    </StandardFormSectionTitle>
                    <StandardFormSectionDescription>
                        Choose how this category will be used to capture and
                        analyze data.
                    </StandardFormSectionDescription>
                    <StandardFormField>
                        <UIField
                            label="Data dimension type (required)"
                            helpText="hello"
                        >
                            <Field<string | undefined>
                                name="dataDimensionType"
                                component={RadioFieldFF}
                                label="Disaggregation"
                                type="radio"
                                value={'DISAGGREGATION'}
                            />
                            <Field<string | undefined>
                                name="dataDimensionType"
                                component={RadioFieldFF}
                                label="Attribute"
                                type="radio"
                                value={'ATTRIBUTE'}
                            />
                        </UIField>
                    </StandardFormField>
                    <StandardFormField>
                        <Field
                            name="dataDimension"
                            type="checkbox"
                            component={CheckboxFieldFF}
                            label="Use as data dimension"
                            helpText="Category will be available to the analytics as another dimension"
                        />
                    </StandardFormField>
                </StandardFormSection>
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
    const saveAlert = useAlert(
        ({ message }) => message,
        (options) => options
    )
    const navigate = useNavigate()

    const onSubmit: OnSubmit<TInitialValues> = async (values, form) => {
        const jsonPatchOperations = createJsonPatchOperations({
            values,
            dirtyFields: form.getState().dirtyFields,
            originalValue: form.getState().initialValues,
        })
        if (jsonPatchOperations.length < 1) {
            saveAlert.show({
                message: 'No changes to be saved',
            })
            navigate(`/${getSectionPath(section)}`)
            return
        }
        const errors = await patchDirtyFields(jsonPatchOperations)
        if (errors) {
            return errors
        }
        saveAlert.show({ message: 'Saved successfully', success: true })
        navigate(`/${getSectionPath(section)}`)
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
