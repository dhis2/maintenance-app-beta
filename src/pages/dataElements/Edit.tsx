import { useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { FormApi } from 'final-form'
import React from 'react'
import { withTypes } from 'react-final-form'
import { useNavigate, useParams } from 'react-router-dom'
import { StandardFormActions } from '../../components'
import { SCHEMA_SECTIONS } from '../../constants'
import { getSectionPath } from '../../lib'
import { JsonPatchOperation } from '../../types'
import { Attribute, DataElement } from '../../types/generated'
import { formatFormValues } from './edit'
import classes from './Edit.module.css'
import { DataElementFormFields, useCustomAttributesQuery } from './form'
import { FormValues } from './form/types'

type FinalFormFormApi = FormApi<FormValues>

const { Form } = withTypes<FormValues>()

type DataElementQueryResponse = {
    dataElement: DataElement
}

const listPath = `/${getSectionPath(SCHEMA_SECTIONS.dataElement)}`

function useDataElementQuery(id: string) {
    const DATA_ELEMENT_QUERY = {
        dataElement: {
            resource: `dataElements/${id}`,
            params: {
                fields: ['*', 'attributeValues[*]'],
            },
        },
    }

    return useDataQuery<DataElementQueryResponse>(DATA_ELEMENT_QUERY, {
        variables: { id },
    })
}

function computeInitialValues({
    dataElement,
    customAttributes,
}: {
    dataElement: DataElement
    customAttributes: Attribute[]
}) {
    // We want to have an array in the state with all attributes, not just the
    // ones that have a value which is what the endpoint responds with
    const attributeValues = customAttributes.map((attribute) => {
        const attributeValue = dataElement.attributeValues.find(
            (currentAttributeValue) =>
                attribute.id === currentAttributeValue.attribute.id
        )

        if (!attributeValue) {
            return { attribute, value: '' }
        }

        return attributeValue
    })

    return {
        name: dataElement.name,
        shortName: dataElement.shortName,
        code: dataElement.code,
        description: dataElement.description,
        url: dataElement.url,
        style: {
            color: dataElement.style?.color,
            icon: dataElement.style?.icon,
        },
        fieldMask: dataElement.fieldMask,
        domainType: dataElement.domainType,
        formName: dataElement.formName,
        valueType: dataElement.valueType,
        aggregationType: dataElement.aggregationType,
        categoryCombo: dataElement.categoryCombo || { id: '' },
        optionSet: dataElement.optionSet || { id: '' },
        commentOptionSet: dataElement.commentOptionSet || { id: '' },
        legendSets: dataElement.legendSets || [],
        aggregationLevels: dataElement.aggregationLevels || [],
        attributeValues,
    }
}

export const Component = () => {
    const dataEngine = useDataEngine()
    const navigate = useNavigate()
    const params = useParams()

    const dataElementId = params.id as string
    const dataElementQuery = useDataElementQuery(dataElementId)
    const customAttributesQuery = useCustomAttributesQuery()

    const loading = dataElementQuery.loading || customAttributesQuery.loading
    const error = dataElementQuery.error || customAttributesQuery.error

    if (error && !loading) {
        // @TODO(Edit): Implement error screen
        return `Error: ${error.toString()}`
    }

    if (loading) {
        // @TODO(Edit): Implement loading screen
        return 'Loading...'
    }

    function onSubmit(values: FormValues, form: FinalFormFormApi) {
        const dirtyFields = form.getState().dirtyFields
        const jsonPatchPayload = formatFormValues({
            values,
            dirtyFields,
            dataElement: dataElementQuery.data?.dataElement as DataElement,
        })

        // We want the promise so we know when submitting is done. The promise
        // returned by the mutation function of useDataMutation will never
        // resolve
        const ADD_NEW_DATA_ELEMENT_MUTATION = {
            resource: 'dataElements',
            id: dataElementId,
            type: 'json-patch',
            data: ({ operations }: { operations: JsonPatchOperation[] }) =>
                operations,
        } as const

        return dataEngine.mutate(ADD_NEW_DATA_ELEMENT_MUTATION, {
            variables: { operations: jsonPatchPayload },
        })
    }

    const initialValues = computeInitialValues({
        dataElement: dataElementQuery.data?.dataElement as DataElement,
        customAttributes: customAttributesQuery.data,
    })

    return (
        <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit, submitting }) => (
                <form onSubmit={handleSubmit}>
                    <div className={classes.form}>
                        <DataElementFormFields />
                    </div>

                    <div className={classes.formActions}>
                        <StandardFormActions
                            cancelLabel={i18n.t('Cancel')}
                            submitLabel={i18n.t('Save and close')}
                            submitting={submitting}
                            onCancelClick={() => navigate(listPath)}
                        />
                    </div>
                </form>
            )}
        </Form>
    )
}
